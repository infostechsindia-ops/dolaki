# AuraMart Product Recommendation Engine (CONTENT-003)

## 1. Overview

The Product Recommendation Engine resolves product collections dynamically via backend API `GET /api/v1/products/:id/recommendations?type=...`.

---

## 2. Resolver Types

1. `RELATED`: Products from the same primary category and sub-category.
2. `SIMILAR`: Products matching price band and brand tier.
3. `CUSTOMERS_ALSO_VIEWED`: Products co-viewed in historical sessions.
4. `RECENTLY_VIEWED`: User session history tray.
5. `RECOMMENDED_FOR_YOU`: Algorithmic customer profile recommendation.
6. `TRENDING_CATEGORY`: Top-selling products in current category.
7. `PREMIUM_ALTERNATIVES`: Higher spec items (Price > ₹2,000).
8. `BUDGET_ALTERNATIVES`: Cost-effective alternatives (Price < ₹2,000).
9. `ACCESSORIES`: Complementary add-on accessories (cases, chargers, cables).
10. `RECOMMENDED_AI`: AI-driven recommendation placeholder token returning backend catalog selections without client-side fake AI scoring.
