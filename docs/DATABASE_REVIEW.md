# DATABASE REVIEW — AuraMart Commerce OS
**Audit ID:** MASTER-AUDIT-001 | **Date:** 2026-08-09

## Entity Count
29 entities verified in entities.ts.

## Tables Verified
users, addresses, otp_tokens, refresh_tokens, vendors, brands, categories, products, product_variants, attribute_keys, attribute_values, product_variant_attributes, product_images, variant_images, seller_listings, inventory, stock_history, price_history, orders, order_items, payments, payment_intents, payment_attempts, vendor_settlement_ledger, vendor_payouts, vendor_staff, vendor_invitations, vendor_activity_logs, cms_media_assets.

## Indexes
- categories: [@Index(['parentId', 'displayOrder']), @Index(['status', 'isMarketplace', 'isQuickCommerce'])]
- product_variants: [@Index(['productId', 'attributeSignature'], { unique: true })]
- brands: @Column({ unique: true }) on slug
- categories: @Column({ unique: true }) on slug
- users: @Column({ unique: true }) on email
- refresh_tokens: @Column({ unique: true }) on tokenHash

## Migrations
11 timestamped migration files in correct chronological order:
- 1722825600000-RenameUserRoles
- 1722900000000-NormalizeProductVariants
- 1722950000000-NormalizeCategories
- 1723000000000-CreateInventoryLocations
- 1723100000000-CreateInventoryReservations
- 1723200000000-CreatePriceEngineTables
- 1723300000000-CreateProductionPlatformEntities
- 1723400000000-SyncOrderAndShopFulfillmentColumns
- 1723500000000-CreateFladoVipSubscription
- 1723600000000-CreateSupportTicketTables
- 1723700000000-CreateCmsMediaAssetTable

## Issues Found

| ID | Severity | Finding |
|----|----------|---------|
| DB-001 | MEDIUM | Soft delete not universal — Product uses status field, no deletedAt column |
| DB-002 | MEDIUM | Checkout flow performs multiple repo reads without transaction isolation |
| DB-003 | HIGH | computeAttributeSignature calls findOne() per attribute in a loop (N+1) |
| DB-004 | LOW | BigIntSafeTransformer throws on overflow without caller catch block |

## Recommendations
- Add @DeleteDateColumn() (deletedAt) to Product entity for proper soft delete
- Wrap checkout.service.getPreview() in QueryRunner transaction
- Batch load attributeValues before loop in computeAttributeSignature

*LIVE PRODUCTION DEPLOYMENT remains PAUSED.*
