# AuraMart Enterprise SDUI Homepage Engine & Layout Builder (CONTENT-002)

## 1. Overview

The AuraMart SDUI Homepage Engine is a server-authoritative, component-based layout renderer and drag-and-drop editor. It powers the homepage experience across Customer Web, Customer Mobile (React Native Expo), Flado Quick Commerce, and Admin CMS.

---

## 2. Configurable Homepage Section Types (30+ Blocks)

Each homepage block in `backend/sdui_homepage.json` conforms to a standard schema:
```typescript
export interface SduiHomepageSection {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  enabled: boolean;
  sortOrder: number;
  desktopImage?: string;
  tabletImage?: string;
  mobileImage?: string;
  videoUrl?: string;
  gradientOverlay?: string;
  backgroundColor?: string;
  textColor?: string;
  ctaPrimary?: { text: string; url: string };
  ctaSecondary?: { text: string; url: string };
  collectionResolver?: string;
  badge?: string;
  priority?: number;
  theme?: 'LIGHT' | 'DARK';
  startDate?: string;
  endDate?: string;
  visibilityRules?: { userSegment?: string; platform?: string };
  animation?: 'fade' | 'slide' | 'zoom' | 'scale' | 'card_lift' | 'hover';
}
```

### Supported Section Types:
1. `hero-carousel`: 8-Slide Hero Banner Carousel
2. `announcement-bar`: Global Ticker Notice
3. `trending-searches`: Popular Real-Time Search Terms
4. `featured-categories`: 24 Master Categories Grid
5. `trending-categories`: High-Demand Category Strips
6. `official-brand-stores`: Official Brand Flagship Stores
7. `premium-brands`: Luxury & High-End Brands
8. `flash-sale`: Hourly Lightning Deals Countdown
9. `todays-deals`: Handpicked Daily Savings
10. `deal-of-the-day`: Single Featured Loot Deal
11. `best-sellers`: Top-Rated & Most Purchased Items
12. `new-arrivals`: Fresh Released Electronics & Fashion
13. `trending-products`: Viral & High-Demand Shelf
14. `recommended-products`: Personalized Recommendations
15. `continue-shopping`: In-Progress Purchase Trailing Shelf
16. `recently-viewed`: History-Based Product Tray
17. `budget-picks`: Low Price Point Essentials (< ₹1,999)
18. `premium-collection`: High-End Flagship Electronics & Watches
19. `electronics-collection`: Laptops, Audio & Cameras
20. `fashion-collection`: Streetwear & Denim
21. `beauty-collection`: Serums & Skincare
22. `grocery-collection`: Flado Quick Commerce Grocery Staples
23. `home-kitchen`: Kitchen Appliances & Furniture
24. `sports-collection`: Fitness & Dumbbells
25. `auramart-choice`: Editorial Staff Picks
26. `auravip-membership`: VIP Pass Subscription Teaser
27. `coupons-strip`: Instant Discount Coupons
28. `festival-banner`: Festive Campaign Spotlight
29. `trust-banner`: 100% Genuine Guarantee & 7-Day Returns
30. `download-app`: Mobile App Teaser
31. `newsletter`: Email Subscription Banner
32. `footer-promo`: Footer Partner Tickers

---

## 3. Admin Layout Builder Capabilities

Admin users manage layout blocks at `/admin/cms`:
- **Toggle Visibility:** Enable/Disable individual sections instantly without code changes.
- **Reordering:** Drag-and-drop or Move Up / Move Down buttons to re-sequence sections.
- **Hero Carousel Builder:** Edit desktop/mobile banners, gradient overlays, badges, and CTAs across 8 slides.
- **Live Preview:** Real-time Desktop, Tablet, and Mobile preview simulators.
- **Version History & Rollback:** View snapshot history (`GET /api/v1/sdui/revisions`) and restore prior versions (`POST /api/v1/sdui/revisions/restore/:version`).
