import { Injectable, Logger } from '@nestjs/common';
import { IPushProvider, PushPayload, PushSendResult } from './push-provider.interface';

@Injectable()
export class ApnsPushProvider implements IPushProvider {
  readonly name = 'APNS';
  private readonly logger = new Logger(ApnsPushProvider.name);
  private readonly topic = process.env.APNS_TOPIC || 'com.auramart.customer';

  async sendPush(payload: PushPayload): Promise<PushSendResult> {
    const ticketIds = payload.tokens.map(
      (token) => `apns_${token.slice(0, 8)}_${Date.now()}`,
    );
    this.logger.log(
      `[APNS DISPATCH (${this.topic})] Title: "${payload.title}" | Tokens: ${payload.tokens.length} | Priority: ${payload.isSilent ? '5 (silent)' : '10 (immediate)'}`,
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
