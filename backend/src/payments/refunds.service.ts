import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Refund, RefundItem, RefundAttempt, PaymentIntent, Order } from '../database/entities';
import { IPaymentProvider } from './providers/payment-provider.interface';
import { AuditService } from '../audit/audit.service';

export interface InitiateRefundDto {
  orderId: string;
  customerId: string;
  paymentIntentId?: string;
  sourceType: 'CANCELLATION' | 'RETURN' | 'MANUAL_ADJUSTMENT';
  sourceId: string;
  amountMinor: number;
  reason?: string;
  idempotencyKey?: string;
  items?: { orderItemId: string; quantity: number; amountMinor: number }[];
}

@Injectable()
export class RefundsService {
  constructor(
    @InjectRepository(Refund)
    private readonly refundRepository: Repository<Refund>,
    @InjectRepository(RefundItem)
    private readonly refundItemRepository: Repository<RefundItem>,
    @InjectRepository(RefundAttempt)
    private readonly refundAttemptRepository: Repository<RefundAttempt>,
    @InjectRepository(PaymentIntent)
    private readonly paymentIntentRepository: Repository<PaymentIntent>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
    private readonly auditService: AuditService,
    @Inject('PAYMENT_PROVIDERS')
    private readonly providers: Map<string, IPaymentProvider>,
  ) {}

  /**
   * Authoritative Refund Initiation (Transactional & Concurrency-Safe)
   */
  async initiateRefund(dto: InitiateRefundDto): Promise<Refund> {
    const { orderId, customerId, sourceType, sourceId, amountMinor, reason, idempotencyKey, items } = dto;

    if (amountMinor === undefined || amountMinor === null || amountMinor < 0) {
      throw new BadRequestException('Refund amountMinor must be greater than or equal to 0');
    }

    // 1. Idempotency Check by idempotencyKey
    if (idempotencyKey) {
      const existingKey = await this.refundRepository.findOne({ where: { idempotencyKey } });
      if (existingKey) return existingKey;
    }

    // 2. Database Unique Check by sourceType + sourceId
    const existingSource = await this.refundRepository.findOne({ where: { sourceType, sourceId } });
    if (existingSource) return existingSource;

    return this.dataSource.transaction(async (manager) => {
      // Re-verify unique source constraint inside transaction
      const existingInTx = await manager.findOne(Refund, { where: { sourceType, sourceId } });
      if (existingInTx) return existingInTx;

      const order = await manager.findOne(Order, { where: { id: orderId } });
      if (!order) throw new NotFoundException(`Order ${orderId} not found`);

      // Find associated payment intent
      let paymentIntentId = dto.paymentIntentId || order.paymentIntentId;
      let paymentIntent: PaymentIntent | null = null;
      if (paymentIntentId) {
        paymentIntent = await manager.findOne(PaymentIntent, {
          where: { id: paymentIntentId },
          lock: { mode: 'pessimistic_write' },
        }).catch(() => manager.findOne(PaymentIntent, { where: { id: paymentIntentId } }));
      }

      // Check if order is COD or payment intent was not captured
      const isCod = order.paymentMethod === 'COD' || (paymentIntent && paymentIntent.paymentMethod === 'COD');
      const isCaptured = paymentIntent && paymentIntent.status === 'SUCCEEDED';

      // Safe COD / Zero-Capture Semantics: No provider call, mark NOT_REQUIRED
      if (isCod || !isCaptured) {
        const notRequiredRefund = manager.create(Refund, {
          orderId,
          customerId,
          paymentIntentId: paymentIntent?.id || undefined,
          sourceType,
          sourceId,
          amountMinor,
          currency: paymentIntent?.currency || 'USD',
          destination: 'NOT_REQUIRED',
          reason: reason || 'Cash on Delivery / No Online Payment Captured',
          status: 'NOT_REQUIRED',
          failureMessage: 'No online payment captured; no online gateway refund required.',
          idempotencyKey,
        });

        const savedRefund = await manager.save(Refund, notRequiredRefund);

        const attempt = manager.create(RefundAttempt, {
          refundId: savedRefund.id,
          provider: 'COD',
          status: 'NOT_REQUIRED',
          sanitizedResponseJson: JSON.stringify({ gatewayStatus: 'NOT_REQUIRED', paymentMethod: isCod ? 'COD' : 'UNCAPTURED' }),
          failureMessage: 'No online refund required',
        });
        await manager.save(RefundAttempt, attempt);

        await this.auditService.log({
          actorId: customerId,
          actorRole: 'SYSTEM',
          action: 'REFUND_NOT_REQUIRED',
          resourceType: 'Refund',
          resourceId: savedRefund.id,
          details: { orderId, sourceType, sourceId, amountMinor, isCod },
        });

        return savedRefund;
      }

      if (!paymentIntent) {
        throw new BadRequestException('PaymentIntent is required to process refund for prepaid order');
      }

      // Concurrency & Balance Validation for Prepaid Captured Orders
      const capturedAmountMinor = (paymentIntent as any).amountCapturedMinor || paymentIntent.amountMinor;
      const activeRefunds = await manager.find(Refund, { where: { orderId } });
      const activeStatusSet = new Set(['PENDING', 'PROCESSING', 'SUCCEEDED']);
      const totalRefundedMinor = activeRefunds
        .filter((r) => activeStatusSet.has(r.status))
        .reduce((sum, r) => sum + r.amountMinor, 0);

      const remainingRefundableMinor = Math.max(0, capturedAmountMinor - totalRefundedMinor);
      if (amountMinor > remainingRefundableMinor) {
        throw new BadRequestException(
          `Refund amount (${amountMinor} minor) exceeds remaining captured refundable balance (${remainingRefundableMinor} minor). Captured: ${capturedAmountMinor}, Already Refunded: ${totalRefundedMinor}`
        );
      }

      // Create Refund record
      const refund = manager.create(Refund, {
        orderId,
        customerId,
        paymentIntentId: paymentIntent.id,
        sourceType,
        sourceId,
        amountMinor,
        currency: paymentIntent.currency || 'USD',
        destination: 'ORIGINAL_PAYMENT_METHOD',
        reason,
        status: 'PENDING',
        idempotencyKey,
      });
      const savedRefund = await manager.save(Refund, refund);

      // Save RefundItems if provided
      if (items && items.length > 0) {
        for (const itemDto of items) {
          const item = manager.create(RefundItem, {
            refundId: savedRefund.id,
            orderItemId: itemDto.orderItemId,
            quantity: itemDto.quantity,
            amountMinor: itemDto.amountMinor,
          });
          await manager.save(RefundItem, item);
        }
      }

      // Process via Provider Abstraction
      const providerName = paymentIntent.paymentMethod === 'COD' ? 'COD' : 'GENERIC';
      const provider = this.providers.get(providerName) || this.providers.get('GENERIC');

      if (!provider) {
        savedRefund.status = 'FAILED';
        savedRefund.failureCode = 'PROVIDER_UNAVAILABLE';
        savedRefund.failureMessage = 'Payment provider implementation unavailable';
        return manager.save(Refund, savedRefund);
      }

      savedRefund.status = 'PROCESSING';
      await manager.save(Refund, savedRefund);

      const providerResult = await provider.processRefund({
        refundId: savedRefund.id,
        paymentIntentReference: (paymentIntent as any).providerReference || paymentIntent.id,
        amountMinor,
        currency: savedRefund.currency,
        reason,
      });

      // Save Sanitized Attempt
      const sanitizedResponseJson = providerResult.sanitizedResponse
        ? JSON.stringify(providerResult.sanitizedResponse)
        : undefined;

      const attempt = manager.create(RefundAttempt, {
        refundId: savedRefund.id,
        provider: providerName,
        providerRefundReference: providerResult.providerRefundReference,
        status: providerResult.status,
        sanitizedResponseJson,
        failureCode: providerResult.failureCode,
        failureMessage: providerResult.failureMessage,
      });
      await manager.save(RefundAttempt, attempt);

      if (providerResult.success && providerResult.status === 'SUCCEEDED') {
        savedRefund.status = 'SUCCEEDED';
        savedRefund.completedAt = new Date();
      } else if (providerResult.status === 'FAILED') {
        savedRefund.status = 'FAILED';
        savedRefund.failureCode = providerResult.failureCode || 'GATEWAY_DECLINED';
        savedRefund.failureMessage = providerResult.failureMessage || 'Refund declined by provider gateway';
      }

      const finalSaved = await manager.save(Refund, savedRefund);

      await this.auditService.log({
        actorId: customerId,
        actorRole: 'SYSTEM',
        action: finalSaved.status === 'SUCCEEDED' ? 'REFUND_SUCCEEDED' : 'REFUND_INITIATED',
        resourceType: 'Refund',
        resourceId: finalSaved.id,
        details: { orderId, amountMinor, status: finalSaved.status, providerReference: providerResult.providerRefundReference },
      });

      return finalSaved;
    });
  }

  /**
   * Process Webhook Event for Refunds (Monotonic state transition protection)
   */
  async processWebhookRefundEvent(providerRefundRef: string, status: 'SUCCEEDED' | 'FAILED', failureMessage?: string): Promise<Refund> {
    const attempt = await this.refundAttemptRepository.findOne({ where: { providerRefundReference: providerRefundRef } });
    if (!attempt) throw new NotFoundException(`Refund attempt for reference ${providerRefundRef} not found`);

    const refund = await this.refundRepository.findOne({ where: { id: attempt.refundId } });
    if (!refund) throw new NotFoundException(`Refund ${attempt.refundId} not found`);

    // Monotonic Transition Protection: SUCCEEDED & NOT_REQUIRED are terminal states. Duplicate or stale webhooks cannot regress status or duplicate attempts.
    if (refund.status === 'SUCCEEDED' || refund.status === 'NOT_REQUIRED') {
      return refund;
    }

    if (status === 'SUCCEEDED') {
      refund.status = 'SUCCEEDED';
      refund.completedAt = new Date();
    } else if (status === 'FAILED' && (refund.status as string) !== 'SUCCEEDED') {
      refund.status = 'FAILED';
      refund.failureMessage = failureMessage || 'Refund failed via gateway webhook notification';
    }

    const saved = await this.refundRepository.save(refund);

    await this.auditService.log({
      actorId: 'WEBHOOK',
      actorRole: 'SYSTEM',
      action: status === 'SUCCEEDED' ? 'REFUND_WEBHOOK_SUCCEEDED' : 'REFUND_WEBHOOK_FAILED',
      resourceType: 'Refund',
      resourceId: saved.id,
      details: { providerRefundRef, status: saved.status },
    });

    return saved;
  }

  /**
   * Retrieve Customer Refunds for an Order (IDOR Protected)
   */
  async getRefundsForOrder(user: any, orderId: string): Promise<any[]> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    if (user.role === 'CUSTOMER' && order.customerId !== user.userId) {
      throw new ForbiddenException('You do not have permission to view refunds for this order');
    }

    const refunds = await this.refundRepository.find({ where: { orderId }, order: { createdAt: 'DESC' } });

    return Promise.all(
      refunds.map(async (r) => {
        const attempts = await this.refundAttemptRepository.find({ where: { refundId: r.id }, order: { createdAt: 'DESC' } });
        const latestAttempt = attempts[0];

        return {
          id: r.id,
          orderId: r.orderId,
          sourceType: r.sourceType,
          sourceId: r.sourceId,
          amountMinor: r.amountMinor,
          formattedAmount: `$${(r.amountMinor / 100).toFixed(2)}`,
          currency: r.currency,
          destination: r.destination,
          status: r.status,
          refundRequired: r.status !== 'NOT_REQUIRED',
          failureMessage: r.failureMessage || null,
          providerReference: latestAttempt?.providerRefundReference || null,
          createdAt: r.createdAt,
          completedAt: r.completedAt || null,
        };
      })
    );
  }

  /**
   * Retrieve Specific Refund Details (IDOR Protected)
   */
  async getRefundDetails(user: any, refundId: string): Promise<any> {
    const refund = await this.refundRepository.findOne({ where: { id: refundId } });
    if (!refund) throw new NotFoundException('Refund not found');

    if (user.role === 'CUSTOMER' && refund.customerId !== user.userId) {
      throw new ForbiddenException('You do not have permission to view this refund');
    }

    const attempts = await this.refundAttemptRepository.find({ where: { refundId: refund.id }, order: { createdAt: 'DESC' } });
    const items = await this.refundItemRepository.find({ where: { refundId: refund.id } });

    return {
      id: refund.id,
      orderId: refund.orderId,
      customerId: refund.customerId,
      sourceType: refund.sourceType,
      sourceId: refund.sourceId,
      amountMinor: refund.amountMinor,
      formattedAmount: `$${(refund.amountMinor / 100).toFixed(2)}`,
      currency: refund.currency,
      destination: refund.destination,
      status: refund.status,
      refundRequired: refund.status !== 'NOT_REQUIRED',
      failureMessage: refund.failureMessage || null,
      idempotencyKey: refund.idempotencyKey || null,
      items: items.map((i) => ({
        orderItemId: i.orderItemId,
        quantity: i.quantity,
        amountMinor: i.amountMinor,
        formattedAmount: `$${(i.amountMinor / 100).toFixed(2)}`,
      })),
      attempts: attempts.map((a) => ({
        provider: a.provider,
        providerRefundReference: a.providerRefundReference || null,
        status: a.status,
        createdAt: a.createdAt,
      })),
      createdAt: refund.createdAt,
      completedAt: refund.completedAt || null,
    };
  }
}
