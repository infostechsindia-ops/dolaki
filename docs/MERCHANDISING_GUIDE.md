# AuraMart Commerce OS — Merchandising & Campaign Management Guide

---

## 1. Merchandising Surfaces & Layouts

AuraMart supports server-driven UI (SDUI) merchandising across 4 main surfaces:
1. **Marketplace Web Homepage**: Hero carousel, flash sales, category grid, curated shelves, promotional banners.
2. **Flado Quick-Commerce App**: 10-minute banner alerts, essential bundles, quick-add shelves, VIP pass banners.
3. **Category Landing Pages**: Subcategory navigation pills, brand showcases, filtered product grids.
4. **Checkout & Cart**: Cross-sell shelves, coupon application bar, delivery threshold progress indicators.

---

## 2. Active Campaign Registry

| Campaign Name | Surface | Discount Type | Target Scope | Active Coupons |
|---------------|---------|---------------|--------------|----------------|
| **Grand Launch Fest** | Marketplace | 20% OFF | Electronics & Accessories | `AURA100` |
| **Flado Fresh Rush** | Quick-Commerce | Flat ₹100 OFF | Dairy, Fruits, Snacks | `FLADO100` |
| **Fashion Super Sale** | Marketplace | Up to 50% OFF | Men's & Women's Wear | `AURA50` |
| **Daily Essentials** | Quick-Commerce | Flat ₹50 OFF | Milk, Bread, Beverages | `FLADO50` |

---

## 3. Server-Authoritative Promotion Precedence

Promotion calculation rules are enforced in `PriceEngineService`:
1. **Maximum Savings First**: Selects the promotion yielding the highest net savings for the customer.
2. **Priority Tie-Breaker**: If savings match, selects higher priority (`priority` column DESC).
3. **Deterministic ID Fallback**: If priority matches, uses alphabetical ID comparison ASC.
4. **Anti-Stacking**: Order-level coupons apply to net item subtotals after item-level promotional discounts.

---

*Document generated for DATA-001.*
