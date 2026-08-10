# AuraMart Customer Personalization Engine Architecture (CONTENT-008)

## 1. Overview

The Personalization Engine (`PersonalizationService`) categorizes customers into behavioral segments to deliver dynamic homepage variations, personalized recommendation shelves, and targeted campaign banners.

---

## 2. Customer Behavioral Segments

- `GUEST`: Anonymous browser.
- `FIRST_ORDER`: New registered customer with 0 completed orders.
- `RETURNING_CUSTOMER`: Customer with 1-5 completed orders.
- `VIP_MEMBER`: Active Flado VIP Pass subscriber.
- `HIGH_VALUE_CUSTOMER`: Customer with total spend > ₹25,000.
- `GROCERY_SHOPPER`: Customer whose primary orders belong to Flado Quick-Commerce.
- `FASHION_SHOPPER`: Customer whose primary orders belong to Fashion & Apparel.
- `ELECTRONICS_SHOPPER`: Customer whose primary orders belong to Consumer Electronics.
- `FREQUENT_BUYER`: Customer with > 5 completed orders.

---

## 3. Customer Mobile Integration (MOBILE-004)
- **Mobile AI Assistant (`mobile/src/services/ai_assistant.ts`):** Rule-based intent processor for gift finders, outfit styling, and grocery planning.
- **Personalized Shelves (`mobile/src/services/personalization.ts`):** Segment-driven shelves (`Recommended For You`, `Buy Again`, `Trending Near You`).
- **Customer Insights Dashboard:** Spend summary, savings summary, favorite categories, and AuraCoins balance.
