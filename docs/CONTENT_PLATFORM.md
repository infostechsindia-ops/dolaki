# AuraMart Commerce OS — Enterprise Content Platform Guide

## Overview
AuraMart integrates a dynamic Server-Driven UI (SDUI) content platform that replaces hardcoded static pages with server-managed, CMS-driven content routes across Customer Web and Mobile.

---

## 1. Information Architecture Categories
- **Company**: About AuraMart, Our Story, Leadership, Careers, Press, Sustainability, Partner programs.
- **Customer & Help**: Help Center, FAQ, Contact Us, Support Ticket Tracker, Product Safety, Accessibility Help.
- **Policies**: Shipping, Returns & Refunds, Warranty, Payments, EMI, Cash on Delivery.
- **Legal Center**: Privacy Policy, Terms of Service, Cookie Policy, User/Vendor Agreements, GDPR.
- **Business Center**: Sell on AuraMart, Fulfillment Services, Advertising Portal, Developer API.
- **Community & Blog**: AuraMart Journal, Buying Guides, Tech Reviews, Lifestyle Content.

---

## 2. Dynamic Content Resolution
All informational routes resolve through centralized registry [`web/src/lib/content-data.ts`](file:///Users/arifalnukhbah/antigravity/AuraMart/web/src/lib/content-data.ts) and render via [`web/src/components/cms/CmsPageRenderer.tsx`](file:///Users/arifalnukhbah/antigravity/AuraMart/web/src/components/cms/CmsPageRenderer.tsx).
