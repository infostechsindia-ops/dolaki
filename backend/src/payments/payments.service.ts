import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentIntent, PaymentAttempt, PaymentIntentStatus } from '../database/entities';
import { CheckoutService } from '../checkout/checkout.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentIntentDto } from './dto/confirm-payment-intent.dto';
import { PaymentIntentResponseDto, PaymentAttemptDto } from './dto/payment-intent-response.dto';
import { IPaymentProvider } from './providers/payment-provider.interface';
import { CodPaymentProvider } from './providers/cod-payment.provider';
import { GenericGatewayProvider } from './providers/generic-gateway.provider';
import { StripePaymentProvider } from './providers/stripe-payment.provider';
import { RazorpayPaymentProvider } from './providers/razorpay-payment.provider';

@Injectable()
export class PaymentsService {
  private readonly providers: Map<string, IPaymentProvider> = new Map();
  private readonly stripeProvider = new StripePaymentProvider();
  private readonly razorpayProvider = new RazorpayPaymentProvider();

  constructor(
    @InjectRepository(PaymentIntent)
    private readonly intentRepo: Repository<PaymentIntent>,
    @InjectRepository(PaymentAttempt)
    private readonly attemptRepo: Repository<PaymentAttempt>,
    private readonly checkoutService: CheckoutService,
    private readonly codProvider: CodPaymentProvider,
    private readonly genericProvider: GenericGatewayProvider,
  ) {
    this.providers.set('COD', codProvider);
    this.providers.set('GENERIC', genericProvider);
    this.providers.set('UPI', genericProvider);
    this.providers.set('CARD', genericProvider);
    this.providers.set('STRIPE', this.stripeProvider);
    this.providers.set('RAZORPAY', this.razorpayProvider);
  }

  private formatCurrency(amountCents: number): string {
    const dollars = (amountCents / 100).toFixed(2);
    return `$${dollars}`;
  }

  private getProvider(method: string): IPaymentProvider {
    const configuredProvider = process.env.PAYMENT_PROVIDER?.toUpperCase();
    if (configuredProvider === 'STRIPE') return this.stripeProvider;
    if (configuredProvider === 'RAZORPAY') return this.razorpayProvider;

    const lower = (method || '').toLowerCase();
    if (lower === 'pay-cod' || lower === 'cod') return this.codProvider;
    if (lower.includes('stripe')) return this.stripeProvider;
    if (lower.includes('razorpay')) return this.razorpayProvider;
    return this.genericProvider;
  }

  private mapAttemptToDto(attempt: PaymentAttempt): PaymentAttemptDto {
    return {
      id: attempt.id,
      provider: attempt.provider,
      providerAttemptId: attempt.providerAttemptId,
      status: attempt.status,
      failureCode: attempt.failureCode,
      failureMessage: attempt.failureMessage,
      createdAt: attempt.createdAt,
    };
  }

  private async mapIntentToDto(intent: PaymentIntent): Promise<PaymentIntentResponseDto> {
    const attempts = await this.attemptRepo.find({
      where: { paymentIntentId: intent.id },
      order: { createdAt: 'DESC' },
    });

    const isCod = intent.paymentMethod === 'pay-cod' || intent.paymentMethod === 'COD';
    const isSucceeded = intent.status === 'SUCCEEDED';

    return {
      id: intent.id,
      customerId: intent.customerId,
      cartId: intent.cartId,
      amountMinor: intent.amountMinor,
      formattedAmount: this.formatCurrency(intent.amountMinor),
      currency: intent.currency,
      paymentMethod: intent.paymentMethod,
      provider: intent.provider,
      status: intent.status,
      idempotencyKey: intent.idempotencyKey,
      clientSecret: intent.clientSecret,
      requiresAction: !isSucceeded && !isCod && intent.status === 'REQUIRES_ACTION',
      actionType: isCod ? undefined : intent.paymentMethod.includes('upi') || intent.paymentMethod.includes('UPI') ? 'UPI_REDIRECT' : 'CARD_3DS',
      expiresAt: intent.expiresAt,
      attempts: attempts.map(this.mapAttemptToDto),
      createdAt: intent.createdAt,
      updatedAt: intent.updatedAt,
    };
  }

  // ---------------------------------------------------------------------------
  // 1. Create Payment Intent (Server-Authoritative)
  // ---------------------------------------------------------------------------
  async createIntent(
    customerId: string,
    dto: CreatePaymentIntentDto,
    idempotencyHeader?: string
  ): Promise<PaymentIntentResponseDto> {
    const idempotencyKey = dto.idempotencyKey || idempotencyHeader;

    // Idempotency check: Return active existing intent if idempotencyKey matches
    if (idempotencyKey) {
      const existing = await this.intentRepo.findOne({
        where: { customerId, idempotencyKey },
      });
      if (existing && existing.status !== 'CANCELLED' && existing.status !== 'EXPIRED') {
        return this.mapIntentToDto(existing);
      }
    }

    // Authoritative Checkout Preview Revalidation (CMD-039 / CMD-041 / CMD-042)
    const preview = await this.checkoutService.getPreview(customerId, {
      addressId: dto.addressId,
      deliveryOptionId: dto.deliveryOptionId,
      paymentMethod: dto.paymentMethod,
    });

    // Verify overall checkout eligibility
    if (!preview.checkoutEligibility.isEligible) {
      throw new BadRequestException({
        message: 'Checkout is not eligible for payment intent creation',
        blockers: preview.checkoutEligibility.blockers,
      });
    }

    // Verify selected payment method eligibility
    const selectedMethod = preview.paymentMethods.find((p) => p.isSelected);
    if (!selectedMethod || !selectedMethod.isEligible) {
      const reason = selectedMethod?.uneligibleReason || 'Selected payment method is not eligible for this order.';
      throw new BadRequestException(reason);
    }

    // Amount comes strictly from authoritative preview (minor units / cents)
    const amountMinor = preview.grandTotal;
    const providerInstance = this.getProvider(dto.paymentMethod);

    // Initial intent record creation
    const intent = this.intentRepo.create({
      customerId,
      cartId: preview.cartId,
      amountMinor,
      currency: 'USD',
      paymentMethod: dto.paymentMethod,
      provider: providerInstance.name,
      status: 'REQUIRES_ACTION',
      idempotencyKey: idempotencyKey || undefined,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 mins TTL
    }) as PaymentIntent;

    const savedIntent = (await this.intentRepo.save(intent)) as PaymentIntent;

    // Delegate intent initialization to selected provider
    const providerResult = await providerInstance.createIntent(savedIntent, preview);

    savedIntent.providerReference = providerResult.providerReference || undefined;
    savedIntent.clientSecret = providerResult.clientSecret || undefined;
    savedIntent.status = providerResult.status;
    const finalIntent = (await this.intentRepo.save(savedIntent)) as PaymentIntent;

    // Log initial attempt
    const attempt = this.attemptRepo.create({
      paymentIntentId: finalIntent.id,
      provider: providerInstance.name,
      providerAttemptId: providerResult.providerReference || `init_${finalIntent.id}`,
      status: providerResult.status === 'SUCCEEDED' ? 'SUCCESS' : 'INITIATED',
      sanitizedResponseJson: JSON.stringify(providerResult),
    });
    await this.attemptRepo.save(attempt);

    return this.mapIntentToDto(finalIntent);
  }

  // ---------------------------------------------------------------------------
  // 2. Confirm Payment Intent
  // ---------------------------------------------------------------------------
  async confirmIntent(
    customerId: string,
    intentId: string,
    dto: ConfirmPaymentIntentDto
  ): Promise<PaymentIntentResponseDto> {
    const intent = await this.intentRepo.findOne({ where: { id: intentId } });
    if (!intent) {
      throw new NotFoundException(`Payment intent ${intentId} not found`);
    }

    if (intent.customerId !== customerId) {
      throw new ForbiddenException('Forbidden: You do not own this payment intent');
    }

    if (intent.status === 'SUCCEEDED') {
      return this.mapIntentToDto(intent);
    }

    if (intent.status === 'CANCELLED' || intent.status === 'EXPIRED') {
      throw new BadRequestException(`Cannot confirm payment intent in status ${intent.status}`);
    }

    const providerInstance = this.getProvider(intent.paymentMethod);
    const confirmPayload = (dto as any).providerPayload || (dto as any).payload;
    const confirmResult = await providerInstance.confirmIntent(intent, confirmPayload);

    intent.status = confirmResult.status;
    const updatedIntent = (await this.intentRepo.save(intent)) as PaymentIntent;

    const attempt = this.attemptRepo.create({
      paymentIntentId: intent.id,
      provider: providerInstance.name,
      providerAttemptId: confirmResult.providerTransactionId || `auth_${intent.id}`,
      status: confirmResult.success ? 'SUCCESS' : 'FAILURE',
      failureCode: confirmResult.failureCode,
      failureMessage: confirmResult.failureMessage,
      sanitizedResponseJson: JSON.stringify(confirmResult.rawResponse || {}),
    });
    await this.attemptRepo.save(attempt);

    return this.mapIntentToDto(updatedIntent);
  }

  async getIntent(customerId: string, intentId: string): Promise<PaymentIntentResponseDto> {
    const intent = await this.intentRepo.findOne({ where: { id: intentId } });
    if (!intent) {
      throw new NotFoundException(`Payment intent ${intentId} not found`);
    }
    if (intent.customerId !== customerId) {
      throw new ForbiddenException('Forbidden: You do not own this payment intent');
    }
    return this.mapIntentToDto(intent);
  }

  async cancelIntent(customerId: string, intentId: string): Promise<PaymentIntentResponseDto> {
    const intent = await this.intentRepo.findOne({ where: { id: intentId } });
    if (!intent) {
      throw new NotFoundException(`Payment intent ${intentId} not found`);
    }

    if (intent.customerId !== customerId) {
      throw new ForbiddenException('Forbidden: You do not own this payment intent');
    }

    if (intent.status === 'SUCCEEDED') {
      throw new BadRequestException('Cannot cancel a succeeded payment intent');
    }

    intent.status = 'CANCELLED';
    const updated = await this.intentRepo.save(intent);
    return this.mapIntentToDto(updated);
  }

  async handleWebhook(
    providerName: string,
    signature: string,
    payload: any,
  ): Promise<{ received: boolean; status: PaymentIntentStatus }> {
    const rawBody = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return this.handleWebhookEvent(providerName, rawBody, signature);
  }

  // ---------------------------------------------------------------------------
  // 3. Process Webhook Event
  // ---------------------------------------------------------------------------
  async handleWebhookEvent(
    providerName: string,
    rawBody: string | Buffer,
    signature: string
  ): Promise<{ received: boolean; status: PaymentIntentStatus }> {
    const providerInstance = this.getProvider(providerName);
    const isValid = providerInstance.verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      throw new UnauthorizedException(`Invalid webhook signature for provider ${providerName}`);
    }

    const webhookEvent = providerInstance.parseWebhookEvent(rawBody);

    // Find intent by reference or ID
    let intent: PaymentIntent | null = null;
    if (webhookEvent.providerReference) {
      intent = await this.intentRepo.findOne({
        where: [
          { id: webhookEvent.providerReference },
          { clientSecret: webhookEvent.providerReference },
        ],
      });
    }

    if (!intent) {
      // Find latest non-terminal intent as fallback
      const recentIntents = await this.intentRepo.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });
      intent = recentIntents.length > 0 ? recentIntents[0] : null;
    }

    if (!intent) {
      return { received: true, status: 'CREATED' };
    }

    // State machine check: Succeeded payments stay Succeeded
    if (intent.status === 'SUCCEEDED' && webhookEvent.status !== 'SUCCEEDED') {
      return { received: true, status: intent.status };
    }

    intent.status = webhookEvent.status;
    const updated = await this.intentRepo.save(intent);

    const attempt = this.attemptRepo.create({
      paymentIntentId: intent.id,
      provider: providerInstance.name,
      providerAttemptId: webhookEvent.providerReference,
      status: webhookEvent.status === 'SUCCEEDED' ? 'SUCCESS' : 'FAILURE',
      failureCode: webhookEvent.failureCode,
      failureMessage: webhookEvent.failureMessage,
      sanitizedResponseJson: JSON.stringify(webhookEvent),
    });
    await this.attemptRepo.save(attempt);

    return { received: true, status: updated.status };
  }

  // ---------------------------------------------------------------------------
  // 4. Reconcile Payment Status (Sandbox / Production Reconciliation Engine)
  // ---------------------------------------------------------------------------
  async reconcilePaymentStatus(intentId: string): Promise<PaymentIntentResponseDto> {
    const intent = await this.intentRepo.findOne({ where: { id: intentId } });
    if (!intent) {
      throw new NotFoundException(`Payment intent ${intentId} not found`);
    }

    if (intent.status === 'REQUIRES_ACTION' || intent.status === 'PROCESSING') {
      const attempts = await this.attemptRepo.find({
        where: { paymentIntentId: intent.id },
        order: { createdAt: 'DESC' },
      });

      const lastAttempt = attempts[0];
      if (lastAttempt && lastAttempt.status === 'SUCCESS') {
        intent.status = 'SUCCEEDED';
        await this.intentRepo.save(intent);
      }
    }

    return this.mapIntentToDto(intent);
  }
}
