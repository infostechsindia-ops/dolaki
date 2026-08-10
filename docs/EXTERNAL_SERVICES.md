# AuraMart Commerce OS — External Services Architecture & Configuration Guide

---

## Provider Abstraction Architecture

AuraMart Commerce OS enforces strict provider abstraction interfaces across all external services. This guarantees zero vendor lock-in and allows seamless switching between cloud providers via environment variables.

---

## Domain Configuration Summary

| Domain | Strategy Interface | Supported Providers | Primary Env Variable |
|--------|---------------------|---------------------|----------------------|
| **Payments** | `IPaymentProvider` | `STRIPE`, `RAZORPAY`, `COD`, `GENERIC` | `PAYMENT_PROVIDER` |
| **Email** | `IEmailProvider` | `SMTP`, `SENDGRID`, `AWS_SES`, `SANDBOX` | `EMAIL_PROVIDER` |
| **SMS** | `ISmsProvider` | `TWILIO`, `MSG91`, `TEXTLOCAL`, `SANDBOX` | `SMS_PROVIDER` |
| **Push** | `IPushProvider` | `FCM`, `APNS`, `EXPO`, `SANDBOX` | `PUSH_PROVIDER` |
| **Storage** | `IStorageProvider` | `LOCAL`, `S3`, `R2` | `STORAGE_PROVIDER` |
| **Search** | `ISearchProvider` | `SQL`, `TYPESENSE`, `MEILISEARCH` | `SEARCH_PROVIDER` |
| **Analytics** | `IAnalyticsProvider` | `CONSOLE`, `GA4`, `FIREBASE`, `POSTHOG` | `ANALYTICS_PROVIDER` |
| **Monitoring** | `IMonitoringProvider` | `LOGGER`, `SENTRY`, `OPENTELEMETRY` | `MONITORING_PROVIDER` |

---

## Environment Variable Reference

```env
# Payments
PAYMENT_PROVIDER=GENERIC
STRIPE_WEBHOOK_SECRET=whsec_sandbox_secret
RAZORPAY_KEY_ID=rzp_test_key
RAZORPAY_KEY_SECRET=rzp_test_secret

# Email
EMAIL_PROVIDER=SANDBOX
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SENDGRID_API_KEY=SG.sandbox_key
AWS_REGION=us-east-1

# SMS
SMS_PROVIDER=SANDBOX
TWILIO_ACCOUNT_SID=AC_sandbox_sid
MSG91_AUTH_KEY=msg91_sandbox_key

# Push
PUSH_PROVIDER=SANDBOX
FCM_PROJECT_ID=auramart-sandbox

# Storage & Search
STORAGE_PROVIDER=LOCAL
SEARCH_PROVIDER=SQL
```

---

*Document generated for DEPLOY-002.*
