# Enterprise Feature Flag System & Control Console
## AuraMart Commerce OS v2.0.0-rc.1 | Date: 2026-08-08

---

## Executive Summary

The **AuraMart Feature Flag Console** provides runtime enable/disable controls for 30 platform capabilities with region targeting (`IN`, `AE`, `GLOBAL`), user segment targeting (`ALL`, `VIP`, `NEW_USER`), percentage rollouts (0–100%), and instant rollback without app redeployment.

---

## Feature Flag Catalog (30 Flagged Features)

| Flag ID | Feature Name | Category | Rollout % | Default |
|---------|--------------|----------|-----------|---------|
| `flado` | Flado Quick-Commerce Engine | `CORE` | 100% | Enabled |
| `grocery` | Fresh Grocery Catalog | `CORE` | 100% | Enabled |
| `pharmacy` | Pharmacy & Wellness | `CORE` | 100% | Enabled |
| `coupons` | Coupons & Discount Engine | `COMMERCE` | 100% | Enabled |
| `auraCoins` | AuraCoins Cashback Loyalty | `ENGAGEMENT` | 100% | Enabled |
| `wallet` | AuraPay Digital Wallet | `PAYMENTS` | 100% | Enabled |
| `referral` | Referral Rewards Program | `ENGAGEMENT` | 100% | Enabled |
| `vipPass` | Flado VIP Pass Subscription | `COMMERCE` | 100% | Enabled |
| `aiAssistant` | AuraAI Shopping Assistant | `AI_SEARCH` | 100% | Enabled |
| `recommendations` | Personalized Recommendations | `AI_SEARCH` | 100% | Enabled |
| `voiceSearch` | Voice Search Input | `AI_SEARCH` | 100% | Enabled |
| `imageSearch` | Visual Image Search | `AI_SEARCH` | 100% | Enabled |
| `liveTracking` | Real-Time Order Live Tracking | `CORE` | 100% | Enabled |
| `chatSupport` | Live Support Ticket Chat | `CORE` | 100% | Enabled |
| `cod` | Cash on Delivery (COD) | `PAYMENTS` | 100% | Enabled |
| `applePay` | Apple Pay Checkout | `PAYMENTS` | 100% | Enabled |
| `googlePay` | Google Pay & UPI | `PAYMENTS` | 100% | Enabled |
| `expressDelivery` | Express Next-Day Delivery | `CORE` | 100% | Enabled |
| `buyAgain` | Quick Buy Again Shelf | `COMMERCE` | 100% | Enabled |
| `continueShopping` | Continue Shopping Carousel | `COMMERCE` | 100% | Enabled |
| `recentlyViewed` | Recently Viewed Products | `COMMERCE` | 100% | Enabled |
| `wishlist` | Customer Wishlist | `COMMERCE` | 100% | Enabled |
| `compare` | Product Comparison Engine | `COMMERCE` | 100% | Enabled |
| `reviews` | Customer Reviews & Ratings | `ENGAGEMENT` | 100% | Enabled |
| `qAndA` | Product Q&A Forum | `ENGAGEMENT` | 100% | Enabled |
| `blog` | Tech & Lifestyle Blog | `ENGAGEMENT` | 100% | Enabled |
| `buyingGuides` | Interactive Buying Guides | `ENGAGEMENT` | 100% | Enabled |
| `sellerProgram` | Merchant Onboarding Portal | `OPS` | 100% | Enabled |
| `warehouseOperations` | Warehouse Fulfillment Tools | `OPS` | 100% | Enabled |
| `riderOperations` | Flado Fleet Rider Dispatch | `OPS` | 100% | Enabled |

---

*Document generated for UX-001.*
