# AuraMart Customer Portal Technical Guide (CONTENT-006)

## 1. Overview

The Customer Portal Technical Architecture details the communication contracts between frontend components and backend NestJS micro-services.

---

## 2. Service Wire-ups

- **Authentication & Security:** `AuthService` (`/api/v1/auth/profile`, `/api/v1/auth/sessions`, `/api/v1/auth/security/password`).
- **Support System:** `SupportService` (`/api/v1/support/tickets`).
- **Notifications Hub:** `NotificationsService` (`/api/v1/notifications`).
- **Flado VIP Pass:** `FladoVipService` (`/api/v1/flado/vip/status`).
- **Orders & Returns:** `OrdersService` (`/api/v1/orders`, `/api/v1/orders/:id/cancellations`, `/api/v1/returns`).
