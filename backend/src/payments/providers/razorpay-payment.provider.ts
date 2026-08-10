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
export class RazorpayPaymentProvider implements IPaymentProvider {
  readonly name = 'RAZORPAY';
  private readonly webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_whsec_sandbox';
  private readonly keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_sandbox_key';

  async createIntent(
    intent: PaymentIntent,
    preview: CheckoutPreviewResponseDto,
  ): Promise<ProviderIntentResult> {
    const rawId = intent.id.replace(/-/g, '');
    const orderId = `order_rzp_${rawId.slice(0, 16)}`;

    return {
      providerReference: orderId,
      clientSecret: this.keyId,
      status: 'REQUIRES_ACTION',
      requiresAction: true,
      actionType: 'RAZORPAY_CHECKOUT',
      metadata: {
        provider: 'Razorpay Sandbox',
        orderId,
        keyId: this.keyId,
        amountMinor: intent.amountMinor,
        currency: intent.currency || 'INR',
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
        failureCode: payload.failureCode || 'BAD_REQUEST_ERROR',
        failureMessage: payload.failureMessage || 'Payment authorization failed on Razorpay.',
        rawResponse: { error: 'BAD_REQUEST_ERROR' },
      };
    }

    const razorpayPaymentId = payload?.razorpay_payment_id || `pay_rzp_${Date.now()}`;
    const razorpaySignature = payload?.razorpay_signature;
    const providerRef = (intent as any).providerReference || intent.clientSecret;

    // Validate signature if provided
    if (razorpaySignature && providerRef) {
      const generatedSig = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret')
        .update(`${providerRef}|${razorpayPaymentId}`)
        .digest('hex');

      if (generatedSig !== razorpaySignature) {
        return {
          success: false,
          status: 'FAILED',
          failureCode: 'INVALID_SIGNATURE',
          failureMessage: 'Razorpay payment signature validation failed.',
        };
      }
    }

    return {
      success: true,
      status: 'SUCCEEDED',
      providerTransactionId: razorpayPaymentId,
      rawResponse: {
        razorpay_payment_id: razorpayPaymentId,
        razorpay_order_id: providerRef,
        status: 'captured',
      },
    };
  }

  async processRefund(
    payload: ProviderRefundPayload,
  ): Promise<ProviderRefundResult> {
    if (payload.amountMinor <= 0) {
      throw new BadRequestException('Refund amount must be greater than zero');
    }

    const providerRefundReference = `rfnd_rzp_${payload.refundId.slice(0, 8)}_${Date.now()}`;

    return {
      success: true,
      status: 'SUCCEEDED',
      providerRefundReference,
      sanitizedResponse: {
        id: providerRefundReference,
        entity: 'refund',
        amount: payload.amountMinor,
        currency: payload.currency || 'INR',
        status: 'processed',
      },
    };
  }

  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean {
    if (!signature) return false;
    try {
      const bodyStr = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
      const expected = createHmac('sha256', this.webhookSecret).update(bodyStr).digest('hex');
      return signature === expected;
    } catch {
      return false;
    }
  }

  parseWebhookEvent(body: any): WebhookEventResult {
    const eventType = body?.event || 'payment.captured';
    const providerReference = body?.payload?.payment?.entity?.order_id || body?.payload?.order?.entity?.id || '';
    const rawStatus = body?.payload?.payment?.entity?.status;

    let status: PaymentIntentStatus = 'SUCCEEDED';
    if (eventType.includes('failed') || rawStatus === 'failed') {
      status = 'FAILED';
    } else if (rawStatus === 'authorized') {
      status = 'PROCESSING';
    }

    return {
      eventType,
      providerReference,
      status,
      failureCode: body?.payload?.payment?.entity?.error_code,
      failureMessage: body?.payload?.payment?.entity?.error_description,
      metadata: body?.payload?.payment?.entity?.notes,
    };
  }
}
