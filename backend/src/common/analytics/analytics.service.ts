import { Injectable, Logger } from '@nestjs/common';
import { IAnalyticsProvider, AnalyticsEvent } from './analytics-provider.interface';
import { ConsoleAnalyticsProvider } from './console-analytics.provider';
import { Ga4AnalyticsProvider } from './ga4-analytics.provider';
import { FirebaseAnalyticsProvider } from './firebase-analytics.provider';
import { PostHogAnalyticsProvider } from './posthog-analytics.provider';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly providers: Map<string, IAnalyticsProvider> = new Map();

  constructor(
    private readonly consoleProvider: ConsoleAnalyticsProvider,
    private readonly ga4Provider: Ga4AnalyticsProvider,
    private readonly firebaseProvider: FirebaseAnalyticsProvider,
    private readonly posthogProvider: PostHogAnalyticsProvider,
  ) {
    this.providers.set('CONSOLE', consoleProvider);
    this.providers.set('GA4', ga4Provider);
    this.providers.set('FIREBASE', firebaseProvider);
    this.providers.set('POSTHOG', posthogProvider);
  }

  private getProvider(): IAnalyticsProvider {
    const configured = (process.env.ANALYTICS_PROVIDER || 'CONSOLE').toUpperCase();
    return this.providers.get(configured) || this.consoleProvider;
  }

  async trackEvent(event: AnalyticsEvent): Promise<boolean> {
    const provider = this.getProvider();
    return provider.trackEvent(event);
  }
}
