# AuraMart Premium Product Detail Page (PDP) Architecture (CONTENT-003)

## 1. Overview

The AuraMart Product Detail Page (PDP) is built as a server-authoritative, responsive, high-performance shopping interface across Customer Web (`web/src/app/products/[id]/page.tsx`), Customer Mobile (`mobile/src/app/products/[id].tsx`), Admin CMS (`admin/src/app/cms`), and Backend NestJS Services.

---

## 2. Server Authority Model

All financial figures, stock balances, delivery ETAs, and promotional savings are calculated and verified exclusively by the backend API:
- **Price Resolution:** `MRP`, `Selling Price`, `Discount %`, `Coupon Savings`, `VIP Pass Savings`, `Delivery Fee`, `Handling Fee`, `Grand Total`.
- **Inventory Validation:** Real-time stock status (`IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK`) per darkstore or fulfillment source.
- **Serviceability:** PIN Code serviceability & ETA calculation via `POST /api/v1/products/:id/serviceability`.

---

## 3. Core Component Modules

1. **Product Gallery:** High-res image carousel, lens magnification hover-zoom (desktop), touch pinch-zoom (mobile), fullscreen modal gallery, thumbnail strip, video tab, and 360° product view model.
2. **Product Information & Badges:** Title, brand link, Official Store verified badge, rating summary, review count, Bestseller/Trending/Choice badges, SKU, warranty, and seller info.
3. **Variant Matrix Selector:** Interactive color swatches, size pills, RAM/Storage chips, and bundle selectors. Selecting a variant updates images, SKU, pricing, and stock via backend APIs.
4. **Rich Accordions & Spec Matrices:** Collapsible accordions for Key Features, Specifications, What's in the Box, Country of Origin, Warranty, Safety, Care, Size Guide, and Grocery Nutrition Facts.
5. **Frequently Bought Together:** Bundle item checklist, total bundle price, individual item toggle, and one-click "Add All to Cart".
6. **Customer Reviews & Q&A:** Rating histogram bar, verified purchase badges, customer media gallery, helpful voting, Q&A search, and user question submission.
7. **Trust Signals & Delivery:** PIN Code ETA checker, 10-Minute Flado quick-commerce indicator, and 100% Authentic / 7-Day Replacement badges.
