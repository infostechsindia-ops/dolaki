# AuraMart Server-Authoritative Recommendation Engine & AI Abstraction (CONTENT-008)

## 1. Overview

The Recommendation Engine exposes public endpoints for home, product detail pages, shopping cart cross-sells, and customer account hubs.

---

## 2. API Endpoints

- `GET /api/v1/recommendations/home`: Homepage personalized shelves per customer segment.
- `GET /api/v1/recommendations/product/:id`: Related products, Frequently Bought Together bundles, and accessories.
- `GET /api/v1/recommendations/cart`: Cart cross-sell items and bundle suggestions.
- `GET /api/v1/recommendations/account`: Customer Insights metrics.
- `POST /api/v1/recommendations/track`: Behavioral event logging (product views, wishlist adds, cart adds, search queries).

---

## 3. AI Abstraction Layer

Interface: `RecommendationProvider`
Default Implementation: `RuleBasedRecommendationProvider`
Future Providers: OpenAI, Gemini, Claude, Local LLMs (Ollama).
