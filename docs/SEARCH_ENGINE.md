# AuraMart Enterprise Search Engine Architecture (CONTENT-004)

## 1. Overview

The AuraMart Enterprise Search Engine provides instant, debounced product search, autocomplete suggestions, voice search triggers, visual search triggers, and search analytics tracking. It is 100% server-authoritative and powered by NestJS backend APIs.

---

## 2. API Endpoints

- `GET /api/v1/products/search`: Search products with query text, category/brand/price/rating filters, server-side sorting (`relevance`, `price_asc`, `price_desc`, `rating`, `newest`), and pagination (`page`, `limit`).
- `GET /api/v1/products/search/suggestions`: Returns debounced autocomplete results including:
  - `trending`: Popular search terms.
  - `categories`: Matching product categories.
  - `brands`: Matching brand flagship stores.
  - `products`: Top 5 matching product listings with thumbnails & prices.
- `POST /api/v1/products/search/analytics`: Logs search queries, zero-result keywords, and search conversion events.

---

## 3. Client Integrations

- **Web Search Input (`web/src/components/ui/SearchInput.tsx`):** Debounced 250ms lookup, instant dropdown modal, voice search trigger, and visual image search trigger.
- **Mobile Search Screen (`mobile/src/app/products/index.tsx`):** Category search, instant pull-to-refresh, and sorting bottom modal sheet.
