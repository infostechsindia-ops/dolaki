import { Injectable, Logger } from '@nestjs/common';
import { IAnalyticsProvider, AnalyticsEvent } from './analytics-provider.interface';

@Injectable()
export class Ga4AnalyticsProvider implements IAnalyticsProvider {
  readonly name = 'GA4';
  private readonly logger = new Logger(Ga4AnalyticsProvider.name);
  private readonly measurementId = process.env.GA4_MEASUREMENT_ID || 'G-SANDBOX123';

  async trackEvent(event: AnalyticsEvent): Promise<boolean> {
    const eventName = event.eventName || event.name || 'unknown_event';
    this.logger.log(
      `[GA4 DISPATCH (${this.measurementId})] Event: "${eventName}" | User: ${event.userId || 'anon'}`,
    );
    return true;
  }
}
