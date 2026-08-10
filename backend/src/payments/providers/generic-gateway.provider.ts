import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { createHmac } from 'crypto';
import { IPaymentProvider, ProviderIntentResult, ProviderConfirmResult, WebhookEventResult, ProviderRefundPayload, ProviderRefundResult } from './payment-provider.interface';
import { PaymentIntent } from '../../database/entities';
import { CheckoutPreviewResponseDto } from '../../checkout/dto/checkout-preview.dto';

@Injectable()
export class GenericGatewayProvider implements IPaymentProvider {
  readonly name = 'GENERIC';

  // Secret key used for webhook signature verification (from env or fallback)
  private readonly webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || 'auramart_payment_webhook_secret';

  async createIntent(
    intent: PaymentIntent,
    preview: CheckoutPreviewResponseDto
  ): Promise<ProviderIntentResult> {
    const clientSecret = `pi_sec_${intent.id.replace(/-/g, '')}`;

    return {
      providerReference: `gateway_intent_${intent.id}`,
      clientSecret,
      status: 'REQUIRES_ACTION',
      requiresAction: true,
      actionType: intent.paymentMethod.includes('upi') || intent.paymentMethod.includes('UPI') ? 'UPI_REDIRECT' : 'CARD_3DS',
      metadata: {
        gateway: 'AuraPay Generic Gateway',
        method: intent.paymentMethod,
        tokenized: true,
      },
    };
  }

  async confirmIntent(
    intent: PaymentIntent,
    payload?: any
  ): Promise<ProviderConfirmResult> {
    // Check if payload simulates a failure
    if (payload?.simulateFailure) {
      return {
        success: false,
        status: 'FAILED',
        failureCode: payload.failureCode || 'PAYMENT_DECLINED',
        failureMessage: payload.failureMessage || 'Your card or payment method was declined.',
        rawResponse: { gatewayStatus: 'DECLINED' },
      };
    }

    return {
      success: true,
      status: 'SUCCEEDED',
      providerTransactionId: `tx_auth_${Date.now()}`,
      rawResponse: {
        gatewayStatus: 'SUCCESS',
        authorizedAmount: intent.amountMinor,
        currency: intent.currency,
      },
    };
  }

  async processRefund(
    payload: ProviderRefundPayload
  ): Promise<ProviderRefundResult> {
    if (payload.amountMinor <= 0) {
      return {
        success: false,
        status: 'FAILED',
        failureCode: 'INVALID_REFUND_AMOUNT',
        failureMessage: 'Refund amount must be greater than 0',
      };
    }

    const providerRefundReference = `gtw_ref_${payload.refundId.slice(0, 8)}_${Date.now()}`;

    return {
      success: true,
      status: 'SUCCEEDED',
      providerRefundReference,
      sanitizedResponse: {
        providerType: 'DEV_SIMULATED',
        gatewayStatus: 'DEV_SIMULATED_REFUND_SUCCESS',
        amountMinor: payload.amountMinor,
        currency: payload.currency,
        reference: providerRefundReference,
        note: 'Development simulated gateway confirmation. In production, this status transitions via asynchronous webhook verification.',
      },
    };
  }

  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean {
    if (!signature) return false;
    try {
      const bodyStr = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
      const expectedSignature = createHmac('sha256', this.webhookSecret)
        .update(bodyStr)
        .digest('hex');
      return signature === expectedSignature || signature === `sha256=${expectedSignature}`;
    } catch {
      return false;
    }
  }

  parseWebhookEvent(body: any): WebhookEventResult {
    const eventType = body?.event || body?.type || 'payment_intent.succeeded';
    const providerReference = body?.data?.object?.id || body?.paymentIntentId || body?.id || '';
    const rawStatus = body?.data?.object?.status || body?.status || 'succeeded';

    let status: PaymentIntent['status'] = 'SUCCEEDED';
    if (rawStatus === 'failed' || rawStatus === 'payment_failed') {
      status = 'FAILED';
    } else if (rawStatus === 'processing') {
      status = 'PROCESSING';
    }

    return {
      eventType,
      providerReference,
      status,
      failureCode: body?.failureCode,
      failureMessage: body?.failureMessage,
      metadata: body?.metadata,
    };
  }
}
