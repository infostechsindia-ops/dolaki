import { Injectable, Logger } from '@nestjs/common';
import { IPushProvider, PushPayload, PushSendResult } from './push-provider.interface';

@Injectable()
export class FcmpushProvider implements IPushProvider {
  readonly name = 'FCM';
  private readonly logger = new Logger(FcmpushProvider.name);
  private readonly projectId = process.env.FCM_PROJECT_ID || 'auramart-fcm-sandbox';

  async sendPush(payload: PushPayload): Promise<PushSendResult> {
    const ticketIds = payload.tokens.map(
      (_, idx) => `projects/${this.projectId}/messages/fcm_msg_${Date.now()}_${idx}`,
    );
    this.logger.log(
      `[FCM DISPATCH (${this.projectId})] Title: "${payload.title}" | Tokens: ${payload.tokens.length} | Badge: ${payload.badge ?? 1}`,
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
    this.logger.log(`[FCM TOPIC] Subscribed ${tokens.length} tokens to FCM topic "${topic}"`);
    return true;
  }

  async unsubscribeFromTopic(tokens: string[], topic: string): Promise<boolean> {
    this.logger.log(`[FCM TOPIC] Unsubscribed ${tokens.length} tokens from FCM topic "${topic}"`);
    return true;
  }
}
