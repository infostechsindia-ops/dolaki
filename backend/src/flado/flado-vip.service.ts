import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { FladoVipSubscription, User, PaymentIntent } from '../database/entities';

export const VIP_PLANS = {
  MONTHLY: { id: 'MONTHLY', priceMinor: 399, durationMonths: 1, name: 'Monthly Superpass', formattedPrice: '$3.99' },
  QUARTERLY: { id: 'QUARTERLY', priceMinor: 999, durationMonths: 3, name: 'Quarterly Valuepass', formattedPrice: '$9.99' },
  ANNUAL: { id: 'ANNUAL', priceMinor: 2999, durationMonths: 12, name: 'Annual VIP Pass', formattedPrice: '$29.99' },
} as const;

export type VipPlanId = keyof typeof VIP_PLANS;

export function addMonths(startDate: Date, months: number): Date {
  const result = new Date(startDate.getTime());
  const expectedMonth = (result.getMonth() + months) % 12;
  result.setMonth(result.getMonth() + months);
  if (result.getMonth() !== (expectedMonth < 0 ? expectedMonth + 12 : expectedMonth)) {
    result.setDate(0); // Clamp to end of month on overflow (e.g. Jan 31 -> Feb 28/29)
  }
  return result;
}

@Injectable()
export class FladoVipService {
  constructor(
    @InjectRepository(FladoVipSubscription)
    private readonly subRepo: Repository<FladoVipSubscription>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(PaymentIntent)
    private readonly intentRepo: Repository<PaymentIntent>,
  ) {}

  /**
   * Retrieves the current active, non-expired VIP subscription for a user.
   * Automatically marks expired ACTIVE subscriptions as EXPIRED.
   */
  async getActiveVipSubscription(userId: string): Promise<FladoVipSubscription | null> {
    const activeSub = await this.subRepo.findOne({
      where: { userId, status: 'ACTIVE' },
      order: { expiresAt: 'DESC' },
    });

    if (!activeSub) return null;

    const now = new Date();
    if (activeSub.expiresAt && activeSub.expiresAt.getTime() <= now.getTime()) {
      // Lazy expiry normalization
      activeSub.status = 'EXPIRED';
      await this.subRepo.save(activeSub);
      await this.userRepo.update({ id: userId }, { isVip: false, vipExpiresAt: null });
      return null;
    }

    return activeSub;
  }

  /**
   * Checks whether a user currently has an active, non-expired VIP subscription.
   */
  async isVipActive(userId: string): Promise<boolean> {
    const activeSub = await this.getActiveVipSubscription(userId);
    return activeSub !== null;
  }

  /**
   * Initiates VIP Subscription. Creates a PENDING_PAYMENT subscription record & PaymentIntent.
   */
  async subscribe(
    userId: string,
    planId: string,
    idempotencyKey?: string,
  ): Promise<{
    subscription: FladoVipSubscription;
    paymentIntent: {
      id: string;
      clientSecret: string;
      amountMinor: number;
      formattedAmount: string;
      status: string;
    };
  }> {
    const normalizedPlan = (planId || '').toUpperCase() as VipPlanId;
    if (!VIP_PLANS[normalizedPlan]) {
      throw new BadRequestException(
        `Invalid VIP plan "${planId}". Valid plans are: ${Object.keys(VIP_PLANS).join(', ')}`,
      );
    }

    const planConfig = VIP_PLANS[normalizedPlan];

    // Check if user already has an active subscription
    const existingActive = await this.getActiveVipSubscription(userId);
    if (existingActive) {
      throw new BadRequestException('User already has an active Flado VIP subscription.');
    }

    // Idempotency check: reuse pending subscription if matching idempotencyKey or recent pending
    if (idempotencyKey) {
      const existingPending = await this.subRepo.findOne({
        where: { userId, plan: normalizedPlan, status: 'PENDING_PAYMENT' },
        order: { createdAt: 'DESC' },
      });
      if (existingPending && existingPending.paymentIntentId) {
        const existingIntent = await this.intentRepo.findOne({
          where: { id: existingPending.paymentIntentId },
        });
        if (existingIntent && existingIntent.status !== 'CANCELLED' && existingIntent.status !== 'EXPIRED') {
          return {
            subscription: existingPending,
            paymentIntent: {
              id: existingIntent.id,
              clientSecret: existingIntent.clientSecret || `sec_${existingIntent.id}`,
              amountMinor: Number(existingIntent.amountMinor),
              formattedAmount: `$${(Number(existingIntent.amountMinor) / 100).toFixed(2)}`,
              status: existingIntent.status,
            },
          };
        }
      }
    }

    // Create PENDING_PAYMENT subscription record
    const sub = this.subRepo.create({
      userId,
      plan: normalizedPlan,
      status: 'PENDING_PAYMENT',
      priceMinor: planConfig.priceMinor,
      amountPaidMinor: 0,
      currency: 'USD',
      cancelAtPeriodEnd: false,
    });

    const savedSub = await this.subRepo.save(sub);

    // Create PaymentIntent in payment infrastructure
    const clientSecret = `sec_vip_${savedSub.id}_${Date.now()}`;
    const intent = this.intentRepo.create({
      customerId: userId,
      amountMinor: planConfig.priceMinor,
      currency: 'USD',
      paymentMethod: 'CARD',
      provider: 'GENERIC',
      status: 'REQUIRES_ACTION',
      clientSecret,
      idempotencyKey: idempotencyKey || `idemp-vip-${savedSub.id}`,
    });

    const savedIntent = await this.intentRepo.save(intent);

    savedSub.paymentIntentId = savedIntent.id;
    await this.subRepo.save(savedSub);

    return {
      subscription: savedSub,
      paymentIntent: {
        id: savedIntent.id,
        clientSecret,
        amountMinor: planConfig.priceMinor,
        formattedAmount: planConfig.formattedPrice,
        status: savedIntent.status,
      },
    };
  }

  /**
   * Confirms payment for a VIP subscription and activates benefits.
   */
  async confirmPayment(userId: string, subscriptionId: string): Promise<FladoVipSubscription> {
    const sub = await this.subRepo.findOne({
      where: { id: subscriptionId, userId },
    });

    if (!sub) {
      throw new NotFoundException(`VIP Subscription ${subscriptionId} not found.`);
    }

    // Idempotent return if already ACTIVE
    if (sub.status === 'ACTIVE') {
      return sub;
    }

    if (!sub.paymentIntentId) {
      throw new BadRequestException('Subscription does not have an associated payment intent.');
    }

    const intent = await this.intentRepo.findOne({
      where: { id: sub.paymentIntentId },
    });

    if (!intent) {
      throw new NotFoundException(`PaymentIntent ${sub.paymentIntentId} not found.`);
    }

    // Mark intent as SUCCEEDED (simulating provider confirmation in generic workflow)
    intent.status = 'SUCCEEDED';
    intent.amountCapturedMinor = Number(intent.amountMinor);
    await this.intentRepo.save(intent);

    const now = new Date();
    const planConfig = VIP_PLANS[sub.plan as VipPlanId] || VIP_PLANS.MONTHLY;
    const expiresAt = addMonths(now, planConfig.durationMonths);

    sub.status = 'ACTIVE';
    sub.amountPaidMinor = Number(intent.amountMinor);
    sub.activatedAt = now;
    sub.expiresAt = expiresAt;

    const savedSub = await this.subRepo.save(sub);

    // Update denormalized User VIP fields
    await this.userRepo.update(
      { id: userId },
      { isVip: true, vipExpiresAt: expiresAt },
    );

    return savedSub;
  }

  /**
   * Cancels renewal of active VIP subscription. Benefits persist until expiresAt.
   */
  async cancelSubscription(userId: string): Promise<FladoVipSubscription> {
    const activeSub = await this.getActiveVipSubscription(userId);

    if (!activeSub) {
      throw new NotFoundException('No active Flado VIP subscription found to cancel.');
    }

    activeSub.cancelAtPeriodEnd = true;
    activeSub.cancelledAt = new Date();

    return this.subRepo.save(activeSub);
  }

  /**
   * Generates public VIP status DTO for Web and Mobile clients.
   */
  async getStatus(userId: string): Promise<{
    isVip: boolean;
    plan?: string;
    status: string;
    activatedAt?: Date | null;
    expiresAt?: Date | null;
    cancelAtPeriodEnd?: boolean;
    priceMinor?: number;
    formattedPlanPrice?: string;
    benefits?: string[];
  }> {
    const activeSub = await this.getActiveVipSubscription(userId);

    if (!activeSub) {
      return {
        isVip: false,
        status: 'INACTIVE',
        benefits: [
          'Unlimited FREE 10-minute delivery on all Flado Quick orders above $5.00',
          '100% Waived handling and packaging cold-chain fees',
          'Priority dispatch matching at local darkstores',
        ],
      };
    }

    const planConfig = VIP_PLANS[activeSub.plan as VipPlanId] || VIP_PLANS.MONTHLY;

    return {
      isVip: true,
      plan: activeSub.plan,
      status: activeSub.status,
      activatedAt: activeSub.activatedAt,
      expiresAt: activeSub.expiresAt,
      cancelAtPeriodEnd: activeSub.cancelAtPeriodEnd,
      priceMinor: activeSub.priceMinor,
      formattedPlanPrice: planConfig.formattedPrice,
      benefits: [
        'Unlimited FREE 10-minute delivery on all Flado Quick orders above $5.00',
        '100% Waived handling and packaging cold-chain fees',
        'Priority dispatch matching at local darkstores',
      ],
    };
  }
}
