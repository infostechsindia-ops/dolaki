import { Injectable, Logger } from '@nestjs/common';
import { IPushProvider, PushPayload, PushSendResult } from './push-provider.interface';
import { SandboxPushProvider } from './sandbox-push.provider';
import { FcmpushProvider } from './fcm-push.provider';
import { ApnsPushProvider } from './apns-push.provider';
import { ExpoPushProvider } from './expo-push.provider';

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);
  private readonly providers: Map<string, IPushProvider> = new Map();

  constructor(
    private readonly sandboxProvider: SandboxPushProvider,
    private readonly fcmProvider: FcmpushProvider,
    private readonly apnsProvider: ApnsPushProvider,
    private readonly expoProvider: ExpoPushProvider,
  ) {
    this.providers.set('SANDBOX', sandboxProvider);
    this.providers.set('FCM', fcmProvider);
    this.providers.set('APNS', apnsProvider);
    this.providers.set('EXPO', expoProvider);
  }

  private getProvider(): IPushProvider {
    const configured = (process.env.PUSH_PROVIDER || 'SANDBOX').toUpperCase();
    return this.providers.get(configured) || this.sandboxProvider;
  }

  async sendPush(payload: PushPayload): Promise<PushSendResult> {
    const provider = this.getProvider();
    this.logger.log(`Dispatching push notification to ${payload.tokens.length} devices via ${provider.name}`);
    return provider.sendPush(payload);
  }

  async sendSilentNotification(tokens: string[], data: Record<string, any>): Promise<PushSendResult> {
    return this.sendPush({
      tokens,
      title: '',
      body: '',
      isSilent: true,
      data,
    });
  }

  async subscribeToTopic(tokens: string[], topic: string): Promise<boolean> {
    const provider = this.getProvider();
    if (provider.subscribeToTopic) {
      return provider.subscribeToTopic(tokens, topic);
    }
    return true;
  }
}
