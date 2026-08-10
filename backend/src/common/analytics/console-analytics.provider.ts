import { Injectable, Logger } from '@nestjs/common';
import { IAnalyticsProvider, AnalyticsEvent } from './analytics-provider.interface';

@Injectable()
export class ConsoleAnalyticsProvider implements IAnalyticsProvider {
  readonly name = 'CONSOLE';
  private readonly logger = new Logger(ConsoleAnalyticsProvider.name);

  async trackEvent(event: AnalyticsEvent): Promise<boolean> {
    const eventName = event.eventName || event.name || 'unknown_event';
    this.logger.log(
      `[ANALYTICS] Event: "${eventName}" | User: ${event.userId || 'anon'} | Props: ${JSON.stringify(event.properties || {})}`,
    );
    return true;
  }
}
