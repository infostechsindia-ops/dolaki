# Push Notification Provider Verification Guide — DEPLOY-002

## Supported Push Providers
1. **Firebase Cloud Messaging (FCM)**: Supports device token dispatching, topic subscription (`/topics/deals`), badge counts, and deep-link payload routing.
2. **Apple Push Notification Service (APNs)**: Supports iOS push dispatching, silent pushes (`content-available: 1`), and high priority delivery.
3. **Expo Push Service**: Handles Expo push tokens (`ExponentPushToken[...]`) with ticket ID tracking.
4. **Sandbox Provider**: In-memory logger provider for automated unit testing and sandbox validation.

## Deep Link Routing & Preferences
- Notifications enforce customer category preferences (`ORDER`, `DELIVERY`, `RETURN`, `PROMOTION`, `TRANSACTIONAL`).
- Payloads support deep-link routes (e.g. `auramart://orders/ORD-101`).
