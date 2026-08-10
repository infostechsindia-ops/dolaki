# AuraMart Analytics Abstraction Layer (CONTENT-009)

## 1. Overview

The Analytics Abstraction Engine (`web/src/lib/analytics.ts`) provides a provider interface (`AnalyticsProvider`) without making live external API calls during local development or paused deployment.

---

## 2. Implementation

Interface: `AnalyticsProvider`
Default Implementation: `ConsoleAnalyticsProvider`
Future Integrations: Google Analytics (GA4), PostHog, Microsoft Clarity.
