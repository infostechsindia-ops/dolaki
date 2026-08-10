# AUTHORITATIVE BACKEND SEARCH INTEGRATION (BLOCKER-FIX-001)

## Overview
All static product imports (`import { products } from '@/data/products'`) have been removed from the search experience. The Customer Web search interface (`web/src/app/search/page.tsx`) now communicates exclusively with server-authoritative NestJS backend API search endpoints.

## Backend Endpoints Consumed

| Functionality | HTTP Method & Path | Query Parameters | Description |
|---------------|-------------------|------------------|-------------|
| Full Search | `GET /api/v1/products/search` | `q`, `category`, `brand`, `minPrice`, `maxPrice`, `minRating`, `sortBy`, `page`, `limit` | Paginated, sorted, multi-faceted product search |
| Autocomplete Suggestions | `GET /api/v1/products/search/suggestions` | `q` | Real-time category, brand, and product name suggestions |
| Analytics Event Tracking | `POST /api/v1/products/search/analytics` | Body: `{ query, resultCount }` | Records search queries and result volumes for business intelligence |

## Search UX Architecture & Features

### 1. Debounced Execution
- Search requests are debounced by 300ms using `setTimeout` in React `useEffect`.
- Rapid keystrokes or quick filter adjustments do not hammer the backend server.

### 2. Multi-Facet Filtering
- **Category Pill Selector:** Filters search scope by department (`electronics`, `fashion`, `beauty`, `home`, `groceries`).
- **Max Price Slider:** Dynamic price range slider (₹0 – ₹150,000).
- **Brand Checkboxes:** Dynamically populated from backend result facets.
- **Star Rating Filter:** 4★ & above, 3★ & above, 2★ & above.
- **Discounted Items Toggle:** Filters items with active discount pricing.

### 3. Server-Authoritative Sorting
- `relevance` (default)
- `price-low` (`price_asc`)
- `price-high` (`price_desc`)
- `rating` (`rating`)
- `newest` (`newest`)

### 4. Search UX States
- **Loading State:** Animated skeleton cards during API request execution.
- **Empty State:** User-friendly notification with "Reset All Filters" action button when zero items match.
- **Error State:** Network error alert with "Retry Search" action button.
- **Pagination:** Server-side page navigation with Previous/Next controls and Page X of Y indicator.
- **Recent Searches:** Saved locally in `localStorage` (`auramart_recent_searches_v1`) with quick-search pills and a clear button.
- **Trending Keywords:** One-click popular search pills (AirPods, MacBook Air, Nike Shoes, Organic Milk, Smart TV).

## Bundle & Performance Impact
- **Bundle Reduction:** Removed 256 KB static `products.ts` import from client bundle.
- **Memory Footprint:** Client memory usage significantly reduced.
- **Catalog Consistency:** Search results immediately reflect live backend database changes, pricing updates, and inventory stock levels.
