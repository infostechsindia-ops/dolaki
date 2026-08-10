# AuraMart Regional Commerce Rules (CONTENT-010)

## 1. Overview

Regional Commerce Rules govern country-specific campaign banners, promo codes, shipping methods, and COD availability guards.

---

## 2. Market Profile Resolver

The `RegionalLocalizationService` (`backend/src/pricing/i18n.service.ts`) validates country profiles before permitting checkout.
