# AuraMart Native Notification Engine & Real-Time Architecture (MOBILE-003)

## 1. Overview

The Native Notification Engine integrates an in-app notification center, deep-link routing validator, quiet hours preferences, Live Activity delivery state machine (`mobile/src/services/live_activities.ts`), and Home Screen Widget Data Provider (`mobile/src/services/widgets.ts`) while preserving 100% server authority.

---

## 2. Notification System Components

- **In-App Notification Center (`mobile/src/app/notifications.tsx`):** Category filtering, bulk mark-as-read, read/unread sync, archive support.
- **Deep Link Router (`mobile/src/services/notifications.ts`):** Whitelisted target validation for `/products/:id`, `/orders/:id`, `/brands/:slug`, `/account/support/:id`, and `/flado/vip`.
- **Live Activity Engine (`mobile/src/services/live_activities.ts`):** Real-time delivery progress updates (`OUT_FOR_DELIVERY` -> `DELIVERED`).
- **Home Screen Widget Provider (`mobile/src/services/widgets.ts`):** Widget data payload engine for Recent Orders, Flado Quick Reorder, AuraCoins balance, and VIP status.
