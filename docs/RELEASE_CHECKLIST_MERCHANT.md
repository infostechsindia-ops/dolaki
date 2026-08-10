# Quick-Commerce Merchant Android Production Release Checklist (CMD-098)

## Executive Summary
This document defines the production release audit gate for the **AuraMart Quick-Commerce Merchant Android Application**.
- **Overall Status**: **CONDITIONALLY READY**
- **Reason**: Repository code, TypeScript, backend API contracts, security sanitization, `expo-secure-store` authentication, crash boundaries, and unit test suites pass 100%. External manual steps (Google Play Console account configuration, production FCM push credentials, production APK/AAB build artifact generation on Expo EAS, physical device validation) remain required prior to live store publishing.

---

## 1. Release Readiness Matrix

| Category | Readiness Item | Repository Status | Verdict | Action Required / Notes |
|----------|----------------|-------------------|---------|-------------------------|
| **Identity** | Package ID (`com.auramart.app`) | Confirmed in `app.json` | **PASS** | Identifiers stable for Play Store submission |
| **Identity** | Expo Slug & App Name | Confirmed (`auramart` / `AuraMart`) | **PASS** | Matching production branding |
| **Identity** | Version & VersionCode | `1.0.0`, EAS autoIncrement | **PASS** | Managed via `eas.json` production profile |
| **Environment**| Production API Base URL | `https://api.auramart.com/api/v1` | **PASS** | No localhost/http fallback in release profile |
| **Auth & Security** | Token Storage | `expo-secure-store` | **PASS** | Zero merchant tokens in `AsyncStorage` |
| **Auth & Security** | Session Cleanup | 401 & Logout auto-purge | **PASS** | Purges `expo-secure-store` credentials |
| **Permissions** | Android Permissions | Location (`COARSE`, `FINE`), Notifications | **PASS** | Minimal permissions applied in `app.json` |
| **Permissions** | Permission Justifications | Documented in `app.json` infoPlist | **PASS** | Clear usage description provided |
| **Resilience** | Crash Error Boundary | `MerchantErrorBoundary` | **PASS** | Redacts bearer tokens and secrets in logs |
| **Resilience** | Offline Mutation Protection | Fail-fast on mutations | **PASS** | Zero offline mutation queueing |
| **Notifications** | Operational Push Payload | Sanitized (no PII/secrets) | **PASS** | Event payloads contain `{ shopId, orderId, deepLink }` |
| **Notifications** | Production FCM Credentials | External Setup Required | **BLOCKED** | Requires FCM service account upload to EAS |
| **Build** | EAS Build Profile (`production`) | Configured in `eas.json` | **PASS** | Profile uses `distribution: store` & HTTPS API |
| **Build** | Release Build Artifact (`.aab`) | EAS Cloud Run Required | **MANUAL VERIFICATION REQUIRED** | Run `npm run build:android` on authenticated EAS CLI |
| **Play Console** | App Access / Reviewer Credentials | Test credentials required | **MANUAL VERIFICATION REQUIRED** | Provide test merchant login in Play Console |
| **Play Console** | Privacy Policy & Data Safety | URL & Questionnaire | **MANUAL VERIFICATION REQUIRED** | Complete in Google Play Console |

---

## 2. Mandatory Permissions Justification

| Android Permission | Purpose / Justification | Granted Scope |
|--------------------|------------------------|---------------|
| `ACCESS_FINE_LOCATION` | Required to calculate exact 10-minute Quick Commerce serviceability radius and locate nearest darkstores. | Foreground Only |
| `ACCESS_COARSE_LOCATION` | Network/cell-tower location fallback for initial serviceability check. | Foreground Only |
| `POST_NOTIFICATIONS` | Required to deliver critical real-time merchant alerts (`NEW_QUICK_ORDER`, `SLA_BREACH_WARNING`, `PICKING_ASSIGNMENT`, `UNRESOLVED_OOS_ATTENTION`, `RIDER_HANDOFF_READY`). | User-prompted runtime permission |

---

## 3. Security & Vulnerability Audit Findings

- **Token Persistence**: 0 instances of merchant authentication tokens stored in unencrypted `AsyncStorage` or plain text files.
- **Log Sanitization**: Console logs in `MerchantErrorBoundary` explicitly redact bearer tokens and authorization headers.
- **API Transport Security**: Production profile exclusively targets `https://api.auramart.com/api/v1` with zero fallback to unencrypted `http://` or `localhost`.
- **Sensitive PII Handling**: Operational push notifications and activity log endpoints strip customer phone numbers, delivery address details, passwords, and OTP secrets.

---

## 4. EAS Production Build Command

To generate the final signed Android App Bundle (`.aab`) for Google Play Store upload, run:

```bash
cd mobile
npm run build:android
# or: npx eas-cli build --platform android --profile production
```

---

## 5. Final Release Gate Verdict

**CONDITIONALLY READY**

The repository code is fully hardened, tested, and ready for production build packaging. Proceed with manual Google Play Console submission and FCM credential upload.
