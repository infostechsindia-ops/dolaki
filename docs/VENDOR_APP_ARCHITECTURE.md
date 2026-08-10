# AuraMart Vendor Mobile App Architecture & Security (VENDOR-MOBILE-001)

## 1. Overview

The Vendor Mobile App Architecture enforces role-based access control (`Role.VENDOR_OWNER`), secure JWT session handling, offline-first read caching, and camera barcode scanner abstractions.

---

## 2. Server Authority & Financial Calculations

All financial numbers (Sales revenue, commission fees, taxes, upcoming payouts) originate strictly from backend NestJS API endpoints (`/api/v1/vendors/analytics`, `/api/v1/orders/vendor/queue`).
