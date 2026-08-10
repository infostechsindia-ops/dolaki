# AuraMart Server-Authoritative Faceted Filter Engine (CONTENT-004)

## 1. Overview

The Faceted Filter Engine computes dynamic filter facets for any category via `GET /api/v1/products/facets/:category`.

---

## 2. Supported Facets & Parameters

- **Brand:** Multi-select brand checkboxes with item counts.
- **Price Range:** Min/Max range slider based on catalog boundaries.
- **Customer Rating:** 4★ & above, 3★ & above threshold filters.
- **Availability:** In Stock count & Flado 10-Minute Express eligible count.
- **Server Sorting:** `relevance`, `price_asc`, `price_desc`, `rating`, `newest`.
- **URL Parameter Sync:** Filters synchronize cleanly with URL query parameters for bookmarkable & shareable catalog links.
