# AuraMart Native Vendor Mobile Application Architecture (VENDOR-MOBILE-001)

## 1. Executive Summary

The Vendor Mobile Application (`mobile/src/merchant/`) enables seller store operations, live revenue tracking, order state machine execution, inventory management, barcode scanning, and payout tracking comparable to Amazon Seller, Flipkart Seller Hub, Noon Seller, Shopify, and Meesho Supplier while preserving **100% server authority**.

> [!IMPORTANT]
> **LIVE PRODUCTION DEPLOYMENT: PAUSED**
> All code changes, mobile vendor services, inventory scanner abstractions, order processing hooks, and verification suites remain strictly repository-local.

---

## 2. Key Vendor Mobile Subsystems

- **Vendor Mobile Service (`mobile/src/merchant/vendor_service.ts`):** Provides biometric login abstraction, barcode/QR scanner integration, order state transitions (`NEW` -> `ACCEPTED` -> `PACKED` -> `SHIPPED`), and offline read caching.
- **Vendor Dashboard:** Real-time metrics for Today's Sales, Orders, Revenue, Pending Orders, Low Stock, and Out of Stock alerts.
- **Inventory & Barcode Scanner:** Camera-based 13-digit EAN/UPC barcode scanner abstraction mapping directly to SKU listings.
