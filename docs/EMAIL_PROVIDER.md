# AuraMart Commerce OS — Email Infrastructure Guide

## 1. Overview
The Email Infrastructure (`backend/src/notifications/email`) manages all transactional email dispatches using `EmailService` and `EmailTemplatesService`.

---

## 2. Supported Providers
- **Sandbox**: Log-only provider for development (`EMAIL_PROVIDER=sandbox`).
- **SMTP**: Direct SMTP relay (`EMAIL_PROVIDER=smtp`).
- **SendGrid**: SendGrid Web API integration (`EMAIL_PROVIDER=sendgrid`).
- **AWS SES**: Amazon Simple Email Service (`EMAIL_PROVIDER=ses`).

---

## 3. Transactional Email Templates
The `EmailTemplatesService` generates 9 responsive HTML and plain-text email templates:
1. **OTP**: Verification code with 10-minute expiry window.
2. **Welcome**: Customer onboarding welcome email.
3. **Order Confirmation**: Customer order placement summary with item breakdown.
4. **Shipment**: Tracking update notification with carrier tracking link.
5. **Refund**: Order refund confirmation with sanitized reference numbers.
6. **Password Reset**: Account password reset link with 30-minute expiration.
7. **Support Ticket**: Customer support status update notification.
8. **Vendor Approval**: Merchant onboarding approval notification.
9. **Admin Alerts**: System monitoring alert notification for operations personnel.
