import { Injectable, Logger } from '@nestjs/common';
import { IAnalyticsProvider, AnalyticsEvent } from './analytics-provider.interface';

@Injectable()
export class FirebaseAnalyticsProvider implements IAnalyticsProvider {
  readonly name = 'FIREBASE_ANALYTICS';
  private readonly logger = new Logger(FirebaseAnalyticsProvider.name);

  async trackEvent(event: AnalyticsEvent): Promise<boolean> {
    const eventName = event.eventName || event.name || 'unknown_event';
    this.logger.log(
      `[FIREBASE ANALYTICS DISPATCH] Event: "${eventName}" | User: ${event.userId || 'anon'}`,
    );
    return true;
  }
}
