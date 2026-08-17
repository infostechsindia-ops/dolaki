# DATABASE RELATIONAL INTEGRITY REPORT — AuraMart Commerce OS
**Audit ID:** ENTERPRISE-PRECISION-001  
**Date:** 2026-08-18  

---

## Relational Schema Verification Matrix

| Entity Name | Primary Key | Foreign Key Relations | Indices Enforced | Integer Math Unit | Integrity Status |
|-------------|-------------|------------------------|------------------|-------------------|------------------|
| **Product** | `id` (UUID) | `categoryId`, `brandId`, `vendorId` | `slug`, `categoryId`, `status` | Minor Units (Paise) | Verified ✅ |
| **Category** | `id` (UUID) | `parentId` (Self-relational) | `slug`, `path`, `depth` | N/A | Verified ✅ |
| **Brand** | `id` (UUID) | None | `slug`, `status` | N/A | Verified ✅ |
| **Vendor** | `id` (UUID) | `userId` | `storeName`, `status` | Minor Units (Paise) | Verified ✅ |
| **Order** | `id` (UUID) | `userId`, `vendorId`, `hubId` | `orderNumber`, `status` | Minor Units (Paise) | Verified ✅ |
| **Inventory** | `id` (UUID) | `productId`, `locationId` | `sku`, `locationId` | Units Count | Verified ✅ |

---

## Key Integrity Controls
1. **Foreign Key Enforcement:** Products cannot reference non-existent categories or brands.
2. **Transaction Locking:** Stock reservations and wallet debits execute inside isolated database transactions (`queryRunner.startTransaction()`).
