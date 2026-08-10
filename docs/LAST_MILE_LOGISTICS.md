# AuraMart Last-Mile Logistics & Dispatch Engine (RIDER-001)

## 1. Logistics Architecture

The Last-Mile Logistics Engine optimizes darkstore dispatching, 10-minute Flado Quick Commerce routing, delivery radius geofencing (3km radius), rider batching, and cash collection reconciliation.

---

## 2. Server Authority & Safety

All delivery fees, rider payouts, distance tracking, and OTP validations originate strictly from backend NestJS microservices (`DeliveryService`, `OrdersService`).
