import { PaymentIntent, PaymentIntentStatus } from '../../database/entities';
import { CheckoutPreviewResponseDto } from '../../checkout/dto/checkout-preview.dto';

export interface ProviderIntentResult {
  providerReference?: string;
  clientSecret?: string;
  status: PaymentIntentStatus;
  requiresAction?: boolean;
  actionType?: string;
  metadata?: Record<string, any>;
}

export interface ProviderConfirmResult {
  success: boolean;
  status: PaymentIntentStatus;
  failureCode?: string;
  failureMessage?: string;
  providerTransactionId?: string;
  rawResponse?: Record<string, any>;
}

export interface WebhookEventResult {
  eventType: string;
  providerReference: string;
  status: PaymentIntentStatus;
  failureCode?: string;
  failureMessage?: string;
  metadata?: Record<string, any>;
}

export interface ProviderRefundPayload {
  refundId: string;
  paymentIntentReference?: string;
  amountMinor: number;
  currency: string;
  reason?: string;
}

export interface ProviderRefundResult {
  success: boolean;
  providerRefundReference?: string;
  status: 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'NOT_REQUIRED';
  failureCode?: string;
  failureMessage?: string;
  sanitizedResponse?: Record<string, any>;
}

export interface IPaymentProvider {
  readonly name: string;

  createIntent(
    intent: PaymentIntent,
    preview: CheckoutPreviewResponseDto
  ): Promise<ProviderIntentResult>;

  confirmIntent(
    intent: PaymentIntent,
    payload?: any
  ): Promise<ProviderConfirmResult>;

  processRefund(
    payload: ProviderRefundPayload
  ): Promise<ProviderRefundResult>;

  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean;

  parseWebhookEvent(body: any): WebhookEventResult;
}
