# AuraMart CMS Merchandising & PDP Placement Engine (CONTENT-003)

## 1. Overview

The PDP Merchandising Engine allows merchandising managers to configure category buying guides, cross-sell recommendation slots, bundle promotions, and trust signal banners directly from the Admin CMS.

---

## 2. Merchandising Features

1. **Category Buying Guides (`GET /api/v1/products/buying-guides/:category`):**
   - CMS-managed buying guides for Laptops, Mobile, TV, Fashion, Grocery, and Home Appliances.
   - Includes buying advice, specs recommendations, and FAQ matrices.

2. **Product Comparison Drawer (`POST /api/v1/products/compare`):**
   - Side-by-side comparison of up to 4 products.
   - Compares price, ratings, stock, and spec key-value maps.

3. **Bundles (`GET /api/v1/products/:id/bundles`):**
   - Frequently Bought Together bundle combinations with server-calculated extra savings.

4. **Trust Badges & Banners:**
   - 100% Brand Guarantee, 7-Day Replacement, Free Shipping, and Certified Original product badges.
