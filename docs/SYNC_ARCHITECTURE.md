# AuraMart Cross-Platform Synchronization Architecture (SYNC-001)

## 1. Executive Summary

The Cross-Platform Synchronization Engine guarantees session consistency, real-time cart state synchronization, wishlist status reconciliation, profile management, and deterministic conflict resolution across Customer Web and Customer Mobile while strictly preserving **100% server authority**.

> [!IMPORTANT]
> **LIVE PRODUCTION DEPLOYMENT: PAUSED**
> All code changes, synchronization audit rules, state management documentation, and cross-platform verification suites remain strictly repository-local.

---

## 2. Synchronization Subsystems

- **Cart & Wishlist Synchronization:** Add, remove, or modify items on Customer Web instantly reflects on Customer Mobile via backend NestJS API state authority.
- **Conflict Resolution Matrix:** In concurrent modification scenarios (Web + Mobile), backend NestJS database state supersedes local client state.
- **Financial Calculations:** All cart subtotals, GST/VAT taxes, VIP discounts, delivery fees, and grand totals originate exclusively from backend `PricingEngineService` and `CheckoutService`.
- **Session Revocation:** `logout` and `logoutAll` flag active JWT refresh tokens in table `RefreshToken`, immediately revoking access across all devices.
