import { Injectable, Logger } from '@nestjs/common';
import { IPushProvider, PushPayload, PushSendResult } from './push-provider.interface';

@Injectable()
export class ExpoPushProvider implements IPushProvider {
  readonly name = 'EXPO';
  private readonly logger = new Logger(ExpoPushProvider.name);

  async sendPush(payload: PushPayload): Promise<PushSendResult> {
    const ticketIds = payload.tokens.map(
      (token) => `expo_ticket_${token.replace(/[^a-zA-Z0-9]/g, '_').slice(-10)}_${Date.now().toString().slice(-6)}`,
    );
    this.logger.log(
      `[EXPO PUSH DISPATCH] Title: "${payload.title}" | Tokens: ${payload.tokens.length} | DeepLink: ${payload.deepLinkUrl || 'N/A'}`,
    );
    return {
      success: true,
      sentCount: payload.tokens.length,
      failedCount: 0,
      provider: this.name,
      ticketIds,
    };
  }
}
