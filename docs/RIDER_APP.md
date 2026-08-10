# AuraMart Native Rider Mobile Application (RIDER-001)

## 1. Executive Summary

The Rider Mobile Application (`mobile/src/services/rider_service.ts`) powers last-mile delivery fulfillment, real-time location telemetry, customer OTP verification, and cash collection tracking comparable to Amazon Flex, Noon Riders, Blinkit Delivery Partner, Zepto Rider, Swiggy Instamart, and Zomato Delivery while preserving **100% server authority**.

> [!IMPORTANT]
> **LIVE PRODUCTION DEPLOYMENT: PAUSED**
> All code changes, rider delivery services, map navigation abstractions, OTP verification hooks, and verification suites remain strictly repository-local.

---

## 2. Key Rider Mobile Subsystems

- **Rider Service (`mobile/src/services/rider_service.ts`):** Biometric login abstraction, delivery task queue (`ASSIGNED`, `ACCEPTED`, `PICKED_UP`, `ON_THE_WAY`, `DELIVERED`), location telemetry update handler, and OTP verification.
- **Rider Dashboard:** Earnings, completed deliveries, distance travelled, acceptance rate, customer rating, and cash collection balance.
- **Navigation Provider Abstraction:** Placeholders for Google Maps, Apple Maps, OpenStreetMap, and HERE Maps without requiring production API keys.
