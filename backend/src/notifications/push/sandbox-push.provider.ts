import { Injectable, Logger } from '@nestjs/common';
import { IPushProvider, PushPayload, PushSendResult } from './push-provider.interface';

@Injectable()
export class SandboxPushProvider implements IPushProvider {
  readonly name = 'SANDBOX';
  private readonly logger = new Logger(SandboxPushProvider.name);

  async sendPush(payload: PushPayload): Promise<PushSendResult> {
    const ticketIds = payload.tokens.map(
      (t) => `sbx_push_tkt_${t.slice(-4)}_${Date.now().toString().slice(-6)}`,
    );
    this.logger.log(
      `[SANDBOX PUSH] Title: "${payload.title}" | Tokens: ${payload.tokens.length} | DeepLink: ${payload.deepLinkUrl || 'none'} | Silent: ${!!payload.isSilent}`,
    );
    return {
      success: true,
      sentCount: payload.tokens.length,
      failedCount: 0,
      provider: this.name,
      ticketIds,
    };
  }

  async subscribeToTopic(tokens: string[], topic: string): Promise<boolean> {
    this.logger.log(`[SANDBOX PUSH TOPIC] Subscribed ${tokens.length} tokens to topic "${topic}"`);
    return true;
  }

  async unsubscribeFromTopic(tokens: string[], topic: string): Promise<boolean> {
    this.logger.log(`[SANDBOX PUSH TOPIC] Unsubscribed ${tokens.length} tokens from topic "${topic}"`);
    return true;
  }
}
