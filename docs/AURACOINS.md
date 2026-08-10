# AuraCoins Loyalty & Gamification Engine (CONTENT-006)

## 1. Overview

The AuraCoins Loyalty Program (`web/src/context/AuraCoinContext.tsx`) provides gamified customer retention, streak check-ins, daily missions, unlocked badges, and coin redemption rules.

---

## 2. Loyalty Rules & Conversion

- **Exchange Rate:** 10 AuraCoins = ₹1 Wallet cash value.
- **Redemption Cap:** Max 20% discount on order subtotal per checkout.
- **Daily Streak Check-In:**
  - Day 1: +10 Coins
  - Day 2: +20 Coins
  - Day 3+: +40 Coins + Streak Bonus
- **Missions:** Order placement, product review photo uploads, browsing catalog drops, sharing referral invite links.
