# AuraMart Commerce OS — Known Limitations & Production Constraints
## Current Version: v2.0.0-rc.1 | Date: 2026-08-08

---

## Operational & Environment Constraints

1. **Production Deployment Status**: Live cloud deployment remains **PAUSED** awaiting executive authorization command (`DEPLOY-004B`).
2. **Payment Gateways**: Stripe, Razorpay, COD, and Generic providers are configured to run in Sandbox/Test Mode until final production API keys are injected at launch.
3. **External Messaging**: Email (SMTP/SendGrid/SES), SMS (Twilio/MSG91/TextLocal), and Push Notifications (FCM/APNs/Expo) default to local sandbox log providers when third-party provider keys are omitted in development.
4. **Geofenced Quick-Commerce**: Flado instant delivery SLAs require active darkstore coverage within a 5km radius. Out-of-service addresses automatically fall back to standard marketplace fulfillment.

---

*Document generated for LIVE-IMPROVEMENT workflow.*
