# AuraMart Customer Intelligence & Shopping Insights (CONTENT-008)

## 1. Overview

Customer Intelligence tracks user engagement, brand affinities, average basket values, total lifetime savings, VIP pass savings, and AuraCoins earned.

---

## 2. Customer Insights DTO

```typescript
export interface CustomerInsightsDto {
  favoriteCategory: string;
  favoriteBrand: string;
  mostPurchasedItem: string;
  averageBasketValue: number;
  lifetimeSavingsCents: number;
  vipSavingsCents: number;
  auraCoinsEarned: number;
  shoppingStreakDays: number;
}
```
