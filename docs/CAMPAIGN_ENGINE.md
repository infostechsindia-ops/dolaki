# AuraMart Enterprise Campaign Engine (CONTENT-002)

## 1. Executive Summary

The AuraMart Campaign Engine orchestrates seasonal sales, flash events, festive campaigns, and brand partnerships across all consumer touchpoints.

---

## 2. Seasonal & Festive Campaigns

The system natively supports 15+ pre-built seasonal campaign types:
- `Ramadan` & `Eid`
- `Summer Sale` & `Back To School`
- `Black Friday` & `Cyber Monday`
- `Christmas` & `New Year`
- `Diwali` & `Festive Bonanza`
- `Mega Electronics Sale`
- `Fashion Festival`
- `Beauty Carnival`
- `Grocery Carnival`
- `Weekend Flash Sale`

---

## 3. Campaign Schema & Attributes

```typescript
export interface Campaign {
  id: string;
  name: string;
  slug: string;
  campaignType: 'SEASONAL' | 'FESTIVAL' | 'FLASH' | 'BRAND_PARTNER';
  enabled: boolean;
  priority: number;
  themeColors: { primary: string; accent: string };
  desktopBanner: string;
  mobileBanner: string;
  videoBanner?: string;
  homepagePlacement: 'HERO_SLIDER' | 'TOP_TICKER' | 'MID_HOMEPAGE' | 'MODAL_POPUP';
  productCollection: string;
  brandCollection?: string;
  categoryCollection?: string;
  couponAssignment?: string;
  schedule: {
    startDate: string;
    endDate: string;
    timezone: string;
  };
  announcementBar?: string;
  seo?: {
    metaTitle: string;
    metaDescription: string;
    openGraphImage: string;
  };
}
```

---

## 4. API Endpoints

- `GET /api/v1/campaigns`: Public list of active campaigns (`?enabledOnly=true`).
- `GET /api/v1/campaigns/:slug`: Fetch campaign details by slug.
- `POST /api/v1/admin/campaigns`: Create new campaign (Guarded by `SUPER_ADMIN` / `CATALOG_ADMIN`).
- `PUT /api/v1/admin/campaigns/:id`: Update campaign parameters (Guarded by `SUPER_ADMIN` / `CATALOG_ADMIN`).
