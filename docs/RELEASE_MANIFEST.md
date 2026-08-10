# AuraMart Commerce OS — Release Candidate Manifest (RELEASE-001)

**Release Candidate ID:** AuraMart RC-1  
**Release Date:** August 8, 2026  
**Git Branch:** `main`  
**Git Commit SHA:** `6c64913`  
**Deployment Status:** **LIVE PRODUCTION DEPLOYMENT: PAUSED**  
**Release Gate Verdict:** **`RELEASE CANDIDATE FROZEN — READY FOR PRODUCTION DEPLOYMENT AUTHORIZATION`**

---

## 1. Executive Summary

AuraMart Commerce OS Release Candidate 1 (RC-1) is fully frozen, audited, and verified across all 5 workspace projects. All 10 pre-launch audit gaps (`GAP-P1-01` through `GAP-P1-06`, `GAP-P2-01` through `GAP-P2-04`) are resolved, 728 automated unit/integration tests are passing across 88 test suites with 0 typecheck errors, and 100% of database entities are covered by 11 ordered database migration files.

This document serves as the authoritative Release Manifest detailing workspace versions, test metrics, API inventory, database schema tables, security architecture, and external deployment dependencies.

---

## 2. Repository & Workspace Freeze Summary

### Environment & Framework Versions
- **Node.js:** v20+ LTS
- **TypeScript:** v5.5+
- **NestJS (Backend):** v10.4.0
- **Next.js (Web/Vendor/Admin):** v16.2.9 (Turbopack)
- **React:** v19.0.0
- **Expo SDK (Mobile):** v51.0.0
- **React Native:** v0.74.5
- **TypeORM:** v0.3.20

### Workspace Architecture
```
AuraMart/
├── backend/   # NestJS Server-Authoritative API Engine (Port 3001)
├── web/       # Customer Next.js Web Surface (Port 3000)
├── mobile/    # Customer & Merchant Expo React Native App
├── vendor/    # Vendor Portal Next.js Web Surface (Port 3002)
└── admin/     # Admin Platform Next.js Web Surface (Port 3003)
```

---

## 3. Automated Test & Build Metrics

| Workspace | Test Count | Test Suites | Typecheck (`tsc`) | Build Output | Status |
|-----------|------------|-------------|-------------------|--------------|--------|
| **Backend** | 217 / 217 PASS | 20 suites | 0 errors | `dist/` Compiled | **PASSED** |
| **Customer Web** | 362 / 362 PASS | 45 suites | 0 errors | 54 Routes Pre-rendered | **PASSED** |
| **Customer Mobile** | 109 / 109 PASS | 19 suites | 0 errors | Expo Bundle Ready | **PASSED** |
| **Vendor Portal** | 20 / 20 PASS | 2 suites | 0 errors | 16 Routes Pre-rendered | **PASSED** |
| **Admin Platform** | 20 / 20 PASS | 2 suites | 0 errors | 18 Routes Pre-rendered | **PASSED** |
| **TOTAL** | **728 / 728 PASS** | **88 suites** | **0 errors** | **All 5 Workspaces Green** | **FROZEN** |

---

## 4. Migration Freeze Summary

100% of production database schema entities in `backend/src/database/entities.ts` are covered by 11 ordered SQL migration files in `backend/src/database/migrations/`. No entity depends on `synchronize=true`.

| Migration # | Timestamp & Class Name | Target Schema Tables / Columns |
|-------------|------------------------|--------------------------------|
| 1 | `1722825600000-RenameUserRoles` | `users` role enum normalization (`VENDOR_OWNER`, `SUPER_ADMIN`, `RIDER`) |
| 2 | `1722900000000-NormalizeProductVariants` | `brands`, `product_variants`, `attribute_keys`, `attribute_values`, `product_variant_attributes`, `seller_listings` |
| 3 | `1722950000000-NormalizeCategories` | `category_attribute_keys`, category paths and hierarchies |
| 4 | `1723000000000-CreateInventoryLocations` | `inventory_locations`, `inventory_balances` |
| 5 | `1723100000000-CreateInventoryReservations` | `inventory_reservations`, `inventory_reservation_items` |
| 6 | `1723200000000-CreatePriceEngineTables` | `seller_listing_price_overrides`, `promotions`, `tax_categories` |
| 7 | `1723300000000-CreateProductionPlatformEntities` | `stock_history`, `price_history`, `vendor_settlement_ledger`, `vendor_payouts`, `vendor_staff`, `vendor_invitations`, `vendor_activity_logs`, `device_tokens`, `notification_preferences` |
| 8 | `1723400000000-SyncOrderAndShopFulfillmentColumns` | `shop_hours`, order fulfillment sync columns |
| 9 | `1723500000000-CreateFladoVipSubscription` | `flado_vip_subscriptions`, `users.isVip`, `users.vipExpiresAt` |
| 10 | `1723600000000-CreateSupportTicketTables` | `support_tickets`, `support_ticket_messages`, `support_ticket_attachments`, `support_ticket_audit_logs` |
| 11 | `1723700000000-CreateCmsMediaAssetTable` | `cms_media_assets` |

---

## 5. API Inventory & Classification

All backend API routes under `/api/v1/` are strictly classified by access control level:

| Module / Scope | Endpoint Route | HTTP Method | Access Level | Description |
|----------------|----------------|-------------|--------------|-------------|
| **Auth** | `/api/v1/auth/register` | POST | Public | Customer registration |
| **Auth** | `/api/v1/auth/login` | POST | Public | OTP / Password login |
| **Auth** | `/api/v1/auth/refresh` | POST | Public | Token rotation |
| **Catalog** | `/api/v1/products` | GET | Public | Marketplace catalog listing |
| **Catalog** | `/api/v1/products/:id` | GET | Public | Product detail & variant info |
| **Brands** | `/api/v1/brands` | GET | Public | Brand taxonomy directory |
| **Flado** | `/api/v1/flado/serviceability` | POST | Public | Serviceability & darkstore lookup |
| **Cart** | `/api/v1/cart` | GET/POST/PATCH | Authenticated | Server-authoritative cart |
| **Checkout** | `/api/v1/checkout/preview` | POST | Authenticated | Pre-order financial preview |
| **Orders** | `/api/v1/orders` | POST/GET | Authenticated | Order placement & history |
| **Support** | `/api/v1/support/tickets` | POST/GET | Authenticated | Customer ticket creation & list |
| **Notifications**| `/api/v1/users/notification-preferences` | GET/PATCH | Authenticated | Push preferences management |
| **Vendor** | `/api/v1/vendors/analytics` | GET | Vendor Authorized | Vendor portal analytics charts |
| **Vendor** | `/api/v1/vendors/inventory` | GET/PATCH | Vendor Authorized | Inventory stock updates |
| **Merchant** | `/api/v1/flado/darkstores/:id/picking` | GET/POST | Merchant Staff | Darkstore order picking |
| **Merchant** | `/api/v1/flado/darkstores/:id/handoff` | POST | Merchant Staff | Rider OTP handoff verification |
| **Admin** | `/api/v1/admin/cms/assets` | GET/POST/DELETE | Admin Only | CMS media asset upload & picker |
| **Admin** | `/api/v1/admin/support/tickets` | GET/PATCH | Admin/Support | Admin ticket queue & replies |

---

## 6. Database Table Inventory

| Table Name | Purpose & Domain | Primary Key | Owner Module | Sensitive Fields |
|------------|------------------|-------------|--------------|------------------|
| `users` | User accounts & credentials | `id` (UUID) | `AuthModule` | `passwordHash`, `phone` |
| `user_sessions` | JWT refresh tokens | `id` (UUID) | `AuthModule` | `tokenHash` |
| `products` | Base product catalog | `id` (UUID) | `ProductsModule` | None |
| `product_variants` | Product SKUs & attributes | `id` (UUID) | `ProductsModule` | None |
| `brands` | Brand taxonomy | `id` (UUID) | `BrandsModule` | None |
| `categories` | Category tree taxonomy | `id` (UUID) | `CategoriesModule` | None |
| `seller_listings` | Vendor product offers | `id` (UUID) | `VendorsModule` | None |
| `inventory_locations` | Warehouses & darkstores | `id` (UUID) | `InventoryModule` | None |
| `inventory_balances` | Stock levels | `id` (UUID) | `InventoryModule` | None |
| `orders` | Customer orders | `id` (UUID) | `OrdersModule` | `deliveryAddress` |
| `order_items` | Order line items | `id` (UUID) | `OrdersModule` | None |
| `flado_shops` | Darkstores | `id` (UUID) | `FladoModule` | `address` |
| `flado_vip_subscriptions` | VIP membership plans | `id` (UUID) | `FladoVipModule` | `paymentIntentId` |
| `support_tickets` | Support tickets | `id` (UUID) | `SupportModule` | `customerEmail` |
| `support_ticket_messages`| Ticket conversation thread | `id` (UUID) | `SupportModule` | `isInternalNote` |
| `cms_media_assets` | Promotional media assets | `id` (UUID) | `CmsAssetsModule` | `storageKey` |
| `device_tokens` | FCM/Expo push tokens | `id` (UUID) | `NotificationsModule`| `deviceToken` |
| `notification_preferences`| Push category toggles | `id` (UUID) | `NotificationsModule`| None |

---

## 7. Security Architecture Summary

1. **Role-Based Access Control (RBAC):** Enforces `SUPER_ADMIN`, `CATALOG_ADMIN`, `OPERATIONS`, `SUPPORT_AGENT`, `VENDOR_OWNER`, `VENDOR_STAFF`, `DARKSTORE_PICKER`, `RIDER`, and `CUSTOMER`.
2. **IDOR & Resource Isolation:** Strict server-side ownership validation for Customer orders/tickets and Vendor products/analytics.
3. **Financial Authority:** All pricing, tax, fee, discount, and refund totals are calculated server-side in integer minor units. Client requests submit no monetary totals.
4. **Data Privacy:** Support ticket internal notes (`isInternalNote: true`) are stripped from customer API responses. Device push tokens are isolated per authenticated user session.
5. **CMS Media Asset Validation:** Upload endpoints strictly validate MIME types (`image/jpeg`, `image/png`, `image/webp`), 5MB file size limit, and path-traversal prevention (`storageKey` sanitization). Referenced media assets cannot be deleted while assigned to active hero banners.

---

## 8. External Infrastructure & Service Requirements

The following external cloud services must be provisioned during production deployment (`DEPLOY-004B`):

```
EXTERNAL CONFIGURATION REQUIRED
├── Hosting & Compute: Hostinger Cloud VPS / Docker Container Host
├── Managed Database: PostgreSQL 15+ Instance
├── In-Memory Cache: Redis Cluster (for Session & Cart state)
├── Domain & Network: Hostinger DNS & TLS / SSL Certificate
├── Payment Gateways: Stripe / Razorpay (Live API Credentials)
├── Mobile Push Services: Firebase Cloud Messaging (FCM) & Expo EAS Push
├── Email & SMS Services: SendGrid / Twilio (Live API Credentials)
└── Object Storage: AWS S3 / Compatible S3 Endpoint (for CMS Media Uploads)
```

---

## 9. Release Sign-Off Recommendation

```
RELEASE CANDIDATE FROZEN — READY FOR PRODUCTION DEPLOYMENT AUTHORIZATION
```

AuraMart RC-1 (Commit `6c64913`) is 100% frozen and ready for deployment authorization. All code, migrations, tests, and documentation are complete. Live deployment remains **PAUSED** awaiting explicit user command for `DEPLOY-004B`.
