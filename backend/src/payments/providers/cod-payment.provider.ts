import { Injectable, BadRequestException } from '@nestjs/common';
import { IPaymentProvider, ProviderIntentResult, ProviderConfirmResult, WebhookEventResult, ProviderRefundPayload, ProviderRefundResult } from './payment-provider.interface';
import { PaymentIntent } from '../../database/entities';
import { CheckoutPreviewResponseDto } from '../../checkout/dto/checkout-preview.dto';

@Injectable()
export class CodPaymentProvider implements IPaymentProvider {
  readonly name = 'COD';

  async createIntent(
    intent: PaymentIntent,
    preview: CheckoutPreviewResponseDto
  ): Promise<ProviderIntentResult> {
    // Revalidate COD eligibility: Max $1,000 threshold
    if (preview.grandTotal > 100000) {
      throw new BadRequestException('Cash on Delivery (COD) is unavailable for orders exceeding $1,000.00');
    }

    // COD intent transitions immediately to SUCCEEDED (ready for placement without online charge)
    return {
      providerReference: `cod_ref_${intent.id}`,
      status: 'SUCCEEDED',
      requiresAction: false,
      metadata: { method: 'COD', eligible: true },
    };
  }

  async confirmIntent(
    intent: PaymentIntent,
    payload?: any
  ): Promise<ProviderConfirmResult> {
    return {
      success: true,
      status: 'SUCCEEDED',
      providerTransactionId: `cod_tx_${intent.id}`,
      rawResponse: { type: 'COD', confirmedAt: new Date().toISOString() },
    };
  }

  async processRefund(
    payload: ProviderRefundPayload
  ): Promise<ProviderRefundResult> {
    return {
      success: true,
      status: 'NOT_REQUIRED',
      failureMessage: 'No online payment was captured for Cash on Delivery',
      sanitizedResponse: {
        gatewayStatus: 'NOT_REQUIRED',
        paymentMethod: 'COD',
      },
    };
  }

  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean {
    // COD does not use external gateway webhooks
    return true;
  }

  parseWebhookEvent(body: any): WebhookEventResult {
    return {
      eventType: 'cod.confirmed',
      providerReference: body?.reference || 'cod_default',
      status: 'SUCCEEDED',
    };
  }
}
