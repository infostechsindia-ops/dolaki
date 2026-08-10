# AuraMart Smart Merchandising & Collection Resolvers (CONTENT-008)

## 1. Overview

The Merchandising Resolver Engine maps SDUI block collection resolvers to live catalog queries.

---

## 2. Resolvers

- `TRENDING`: Highest overall customer rating + view velocity.
- `HOT`: Flash sale items with active discounts.
- `NEW`: Products sorted by `createdAt DESC`.
- `HIGH_MARGIN`: Enterprise margin items.
- `LOW_STOCK`: Inventory balance < 5 items remaining.
- `VIP_ONLY`: Exclusive discounts for Flado VIP Pass members.
- `BESTSELLER`: Highest total order count.
- `AI_RECOMMENDED`: Personalized recommendation provider result.
