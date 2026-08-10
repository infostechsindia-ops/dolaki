import { Injectable, Logger } from '@nestjs/common';
import { IAnalyticsProvider, AnalyticsEvent } from './analytics-provider.interface';

@Injectable()
export class PostHogAnalyticsProvider implements IAnalyticsProvider {
  readonly name = 'POSTHOG';
  private readonly logger = new Logger(PostHogAnalyticsProvider.name);
  private readonly apiKey = process.env.POSTHOG_API_KEY || 'phc_sandbox_key';

  async trackEvent(event: AnalyticsEvent): Promise<boolean> {
    const eventName = event.eventName || event.name || 'unknown_event';
    this.logger.log(
      `[POSTHOG DISPATCH] Event: "${eventName}" | User: ${event.userId || event.anonymousId || 'anon'}`,
    );
    return true;
  }
}
