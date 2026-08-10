export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

export interface AnalyticsProvider {
  name: string;
  track(event: AnalyticsEvent): void;
  identify(userId: string, traits?: Record<string, any>): void;
}

export class ConsoleAnalyticsProvider implements AnalyticsProvider {
  name = 'ConsoleAnalyticsProvider';

  track(event: AnalyticsEvent): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[CONSOLE ANALYTICS EVENT] ${event.name}`, event.properties || {});
    }
  }

  identify(userId: string, traits?: Record<string, any>): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[CONSOLE ANALYTICS IDENTIFY] ${userId}`, traits || {});
    }
  }
}

export class Ga4AnalyticsProvider implements AnalyticsProvider {
  name = 'Ga4AnalyticsProvider';

  track(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.name, event.properties || {});
    } else if (process.env.NODE_ENV !== 'production') {
      console.log(`[GA4 ANALYTICS DISPATCH] ${event.name}`, event.properties || {});
    }
  }

  identify(userId: string, traits?: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || 'G-SANDBOX', {
        user_id: userId,
        user_properties: traits,
      });
    }
  }
}

export class PostHogAnalyticsProvider implements AnalyticsProvider {
  name = 'PostHogAnalyticsProvider';

  track(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture(event.name, event.properties || {});
    } else if (process.env.NODE_ENV !== 'production') {
      console.log(`[POSTHOG ANALYTICS DISPATCH] ${event.name}`, event.properties || {});
    }
  }

  identify(userId: string, traits?: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.identify(userId, traits);
    }
  }
}

export class FirebaseAnalyticsProvider implements AnalyticsProvider {
  name = 'FirebaseAnalyticsProvider';

  track(event: AnalyticsEvent): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[FIREBASE ANALYTICS DISPATCH] ${event.name}`, event.properties || {});
    }
  }

  identify(userId: string, traits?: Record<string, any>): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[FIREBASE ANALYTICS IDENTIFY] ${userId}`, traits || {});
    }
  }
}

export function createAnalyticsDispatcher(): AnalyticsProvider {
  const provider = (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER || 'console').toLowerCase();
  switch (provider) {
    case 'ga4':
      return new Ga4AnalyticsProvider();
    case 'posthog':
      return new PostHogAnalyticsProvider();
    case 'firebase':
      return new FirebaseAnalyticsProvider();
    default:
      return new ConsoleAnalyticsProvider();
  }
}

export const analytics = createAnalyticsDispatcher();
