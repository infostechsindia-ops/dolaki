# AuraMart Server-Authoritative Merchandising & Collection Resolver Engine (CONTENT-002)

## 1. Overview

The Merchandising Engine dynamically resolves product collections server-side to power homepage shelves, category landing pages, and campaign collections without relying on client-side hardcoding.

---

## 2. Collection Resolver Tokens (22 Resolvers)

1. `MANUAL`: Specific list of product IDs selected by merchandiser.
2. `NEWEST`: Products ordered by creation timestamp DESC.
3. `TRENDING`: Products with high recent view & purchase velocity.
4. `BEST_SELLER`: Highest volume orders.
5. `HIGHEST_RATED`: 4.5+ star rating with highest review counts.
6. `MOST_VIEWED`: High traffic items.
7. `RECOMMENDED`: Algorithmic personalized recommendation.
8. `BUDGET_PICKS`: Price under ₹1,999.
9. `PREMIUM_COLLECTION`: Price over ₹15,000.
10. `LUXURY`: Flagship Apple, Sony, Fossil, Titan items.
11. `EDITORS_CHOICE`: Staff handpicked catalog items.
12. `STAFF_PICKS`: Curated quality recommendations.
13. `FAST_MOVING`: High velocity inventory items.
14. `HIGH_MARGIN`: High profitability catalog items.
15. `LOW_INVENTORY`: Stock under 10 units.
16. `SEASONAL`: Active seasonal campaign products.
17. `VIP_ONLY`: Exclusive items for AuraVIP Pass subscribers.
18. `FLADO`: Quick Commerce products (`isQuickCommerce: true`).
19. `RECOMMENDED_AI`: AI-driven recommendation tokens.
20. `FREQUENTLY_BOUGHT_TOGETHER`: Co-purchased bundle items.
21. `RECENTLY_VIEWED`: User history-based product tray.
22. `BUY_AGAIN`: Order history repeat purchases.
