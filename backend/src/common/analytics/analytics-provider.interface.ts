export interface AnalyticsEvent {
  eventName?: string;
  name?: string;
  userId?: string;
  anonymousId?: string;
  properties?: Record<string, any>;
  timestamp?: string;
}

export interface IAnalyticsProvider {
  readonly name: string;
  trackEvent(event: AnalyticsEvent): Promise<boolean>;
  identifyUser?(userId: string, traits?: Record<string, any>): Promise<boolean>;
}
