# AuraMart Commerce OS — Push Notifications Guide

## 1. Overview
The Push Notification System (`backend/src/notifications/push`) manages native mobile push dispatches, device registration, topic subscriptions, silent notifications, and deep-link payload routing across iOS and Android.

---

## 2. Supported Providers
- **Sandbox**: Log-only provider (`PUSH_PROVIDER=sandbox`).
- **Firebase Cloud Messaging (FCM)**: Google FCM v1 API (`PUSH_PROVIDER=fcm`).
- **Apple Push Notification Service (APNs)**: Apple APNs HTTP/2 API (`PUSH_PROVIDER=apns`).
- **Expo Push Service**: Expo Push API (`PUSH_PROVIDER=expo`).

---

## 3. Advanced Notification Capabilities
- **Device Token Registration**: `POST /api/v1/notifications/device-tokens`.
- **Topic Subscriptions**: `PushService.subscribeToTopic(tokens, 'promotions')`.
- **Silent Notifications**: Background state sync payloads (`isSilent: true`).
- **Deep-Link Payload Routing**: Universal links (`deepLinkUrl: '/orders/ord-101'`).
- **Badge Count Sync**: Unread inbox badge count payload synchronization.
