# AuraMart Flagship Native Mobile Architecture & Performance (MOBILE-002)

## 1. Executive Overview

The AuraMart Customer Mobile application is engineered as a flagship, high-performance native application (React Native / Expo) designed for sub-second launch times, resilient offline-first read caching, native device integrations (Biometrics, Haptics, Native Share, Clipboard), push notification deep-link routing, and accessibility compliance—while strictly preserving **100% server-authoritative commerce logic**.

> [!IMPORTANT]
> **LIVE PRODUCTION DEPLOYMENT: PAUSED**
> All code changes, offline caching layers, biometric authentication abstractions, background synchronization services, and performance monitoring hooks remain strictly repository-local.

---

## 2. Performance Optimization & List Virtualization

### 2.1 Virtualized List Tuning
- FlatList & SectionList configurations across Home, Search, Product Listing Pages, Order History, and Notifications enforce:
  - `initialNumToRender: 5`
  - `maxToRenderPerBatch: 10`
  - `windowSize: 5`
  - `getItemLayout` & fixed item height calculations to prevent layout recalibration during scrolling.

### 2.2 Memory Management & Image Caching
- Progressive image placeholders and lazy loading for off-screen product thumbnails.
- Memory leak prevention via unmount cleanup in hooks.

---

## 3. Resilient Offline-First Architecture (`mobile/src/services/offline.ts`)

### 3.1 Offline Read Cache
- Caches last successful server responses for:
  - Homepage SDUI layout
  - Categories & Brand lists
  - Products & Recommendations
  - Customer Orders & Addresses
  - Profile & Flado VIP status
  - Push Notification history

### 3.2 Server Authority Safeguards
- Mutations that affect financial totals, stock reservation, or eligibility (Checkout, Payment, Order Placement, Coupon Validation) are explicitly blocked when offline with clear user guidance ("Internet Connection Required to Complete Checkout").
- Automatic background resynchronization upon network reconnection.

---

## 4. Native Device Integrations (`mobile/src/services/device.ts`)

- **Biometric Authentication:** Abstracted support for Face ID, Touch ID, and Android Biometrics for secure session re-entry and high-value wallet operations.
- **Secure Storage:** Keychain / Keystore abstraction for authentication tokens.
- **Native Share & Clipboard:** One-touch product sharing via native system Share Sheet and promo code copying.
- **Haptic Feedback:** Tactile haptic feedback for cart additions, wishlist toggles, and swipe gestures.

---

## 5. Performance Monitoring & Accessibility (`mobile/src/services/performance.ts`)

- **Telemetry Abstraction:** Repository-local screen render timing and API request latency logging without external third-party tracking.
- **Accessibility Compliance:** Dynamic font scaling support, high-contrast text ratios, explicit VoiceOver/TalkBack labels, and accessibility roles.
