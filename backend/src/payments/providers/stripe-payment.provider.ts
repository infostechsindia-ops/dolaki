import { Injectable, BadRequestException } from '@nestjs/common';
import { createHmac } from 'crypto';
import {
  IPaymentProvider,
  ProviderIntentResult,
  ProviderConfirmResult,
  WebhookEventResult,
  ProviderRefundPayload,
  ProviderRefundResult,
} from './payment-provider.interface';
import { PaymentIntent, PaymentIntentStatus } from '../../database/entities';
import { CheckoutPreviewResponseDto } from '../../checkout/dto/checkout-preview.dto';

@Injectable()
export class StripePaymentProvider implements IPaymentProvider {
  readonly name = 'STRIPE';
  private readonly webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_sandbox_secret';

  async createIntent(
    intent: PaymentIntent,
    preview: CheckoutPreviewResponseDto,
  ): Promise<ProviderIntentResult> {
    const rawId = intent.id.replace(/-/g, '');
    const providerReference = `pi_sandbox_${rawId.slice(0, 16)}`;
    const clientSecret = `${providerReference}_secret_${rawId.slice(16, 32)}`;

    return {
      providerReference,
      clientSecret,
      status: 'REQUIRES_ACTION',
      requiresAction: true,
      actionType: 'CARD_3DS',
      metadata: {
        provider: 'Stripe Sandbox',
        amountMinor: intent.amountMinor,
        currency: intent.currency.toLowerCase(),
        cartId: intent.cartId,
      },
    };
  }

  async confirmIntent(
    intent: PaymentIntent,
    payload?: any,
  ): Promise<ProviderConfirmResult> {
    if (payload?.simulateFailure) {
      return {
        success: false,
        status: 'FAILED',
        failureCode: payload.failureCode || 'card_declined',
        failureMessage: payload.failureMessage || 'Your card was declined by Stripe.',
        rawResponse: { stripeError: 'card_declined' },
      };
    }

    const ref = (intent as any).providerReference || intent.clientSecret || `pi_sandbox_${intent.id}`;

    return {
      success: true,
      status: 'SUCCEEDED',
      providerTransactionId: `ch_sandbox_${Date.now()}`,
      rawResponse: {
        id: ref,
        status: 'succeeded',
        amount_captured: intent.amountMinor,
        currency: intent.currency.toLowerCase(),
      },
    };
  }

  async processRefund(
    payload: ProviderRefundPayload,
  ): Promise<ProviderRefundResult> {
    if (payload.amountMinor <= 0) {
      throw new BadRequestException('Refund amount must be greater than zero');
    }

    const providerRefundReference = `re_sandbox_${payload.refundId.slice(0, 8)}_${Date.now()}`;

    return {
      success: true,
      status: 'SUCCEEDED',
      providerRefundReference,
      sanitizedResponse: {
        id: providerRefundReference,
        object: 'refund',
        amount: payload.amountMinor,
        currency: payload.currency.toLowerCase(),
        status: 'succeeded',
      },
    };
  }

  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean {
    if (!signature) return false;
    try {
      const bodyStr = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
      const expected = createHmac('sha256', this.webhookSecret).update(bodyStr).digest('hex');
      return signature.includes(expected) || signature === expected;
    } catch {
      return false;
    }
  }

  parseWebhookEvent(body: any): WebhookEventResult {
    const eventType = body?.type || 'payment_intent.succeeded';
    const providerReference = body?.data?.object?.id || '';
    const rawStatus = body?.data?.object?.status;

    let status: PaymentIntentStatus = 'SUCCEEDED';
    if (eventType.includes('failed') || rawStatus === 'requires_payment_method') {
      status = 'FAILED';
    } else if (rawStatus === 'processing') {
      status = 'PROCESSING';
    }

    return {
      eventType,
      providerReference,
      status,
      failureCode: body?.data?.object?.last_payment_error?.code,
      failureMessage: body?.data?.object?.last_payment_error?.message,
      metadata: body?.data?.object?.metadata,
    };
  }
}
