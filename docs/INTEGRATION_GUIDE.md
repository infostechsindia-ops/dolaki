# AuraMart Commerce OS — External Services Integration Guide

## 1. Architecture Overview
AuraMart Commerce OS utilizes a decoupled, interface-driven provider architecture for all third-party external services. Every external dependency (payments, email, SMS, push notifications, object storage, search, analytics, monitoring) is accessed exclusively through a strict TypeScript interface contract.

This architecture guarantees:
- **100% Server Authority**: Client applications never interact directly with third-party vendor APIs or hold vendor API secrets.
- **Plug-and-Play Provider Switching**: Switching providers (e.g. from SendGrid to AWS SES, or Stripe to Razorpay) requires zero application code changes—only an environment variable configuration update (`EMAIL_PROVIDER=ses` or `PAYMENT_PROVIDER=stripe`).
- **Zero-Dependency Local Sandbox Development**: All integrations ship with built-in Sandbox/Mock implementations that simulate production API responses and webhook events locally without requiring cloud infrastructure or paid API keys.

---

## 2. Provider Abstraction Matrix

| Domain | Interface | Available Providers | Default Development Provider | Config Env Key |
|--------|-----------|--------------------|------------------------------|----------------|
| **Payments** | `IPaymentProvider` | Stripe, Razorpay, COD, Generic Gateway | `COD` / `GENERIC` | `PAYMENT_PROVIDER` |
| **Email** | `IEmailProvider` | SMTP, SendGrid, AWS SES, Sandbox | `SANDBOX` | `EMAIL_PROVIDER` |
| **SMS** | `ISmsProvider` | Twilio, MSG91, TextLocal, Sandbox | `SANDBOX` | `SMS_PROVIDER` |
| **Push Notifications** | `IPushProvider` | FCM, APNs, Expo Push, Sandbox | `SANDBOX` | `PUSH_PROVIDER` |
| **Object Storage** | `IStorageProvider` | AWS S3, Cloudflare R2, Local Storage | `LOCAL` | `STORAGE_PROVIDER` |
| **Search Engine** | `ISearchProvider` | Typesense, Meilisearch, Fallback SQL | `SQL` | `SEARCH_PROVIDER` |
| **Analytics** | `IAnalyticsProvider` | GA4, Firebase, PostHog, Console | `CONSOLE` | `ANALYTICS_PROVIDER` |
| **Monitoring** | `IMonitoringProvider` | Sentry, OpenTelemetry, Structured Logger | `STRUCTURED_LOGGER` | `MONITORING_PROVIDER` |

---

## 3. Sandbox vs. Production Activation
By default, AuraMart runs in **Sandbox Mode** using local repository storage and mock provider logging.

To transition to production:
1. Copy `.env.production.example` to `.env`.
2. Populate the required production API credentials.
3. Restart the backend container (`npm run start:prod`).
