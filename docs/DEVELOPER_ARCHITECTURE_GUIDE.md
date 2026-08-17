# AuraMart Commerce OS — Developer Architecture & Engineering Guide

This comprehensive reference documents the 7 core pillars of **AuraMart Commerce OS** for engineering handoff and onboarding.

---

## 1. Master UI Component Library (`web/src/components/ui/`)
All primitive UI components are single-sourced and variant-driven:
- `Button.tsx`: Variants (`primary`, `secondary`, `outline`, `ghost`, `danger`, `flado`), sizes (`sm`, `md`, `lg`), loading state.
- `Card.tsx`: Variants (`elevated`, `outlined`, `flat`, `interactive`), 20px radius (`--radius-card`), soft layered shadow.
- `Input.tsx`: 16px radius (`--radius-input`), focus glow ring, label & error messaging.
- `Badge.tsx`: Pill shapes (`999px` radius), variants (`primary`, `flado`, `warning`, `danger`, `success`, `glass`).
- `SearchInput.tsx`: Debounced autocomplete modal (`250ms`), voice search, camera visual search, barcode scanner trigger.
- `Modal.tsx`: 28px radius (`--radius-modal`), spring entrance animation (`modalScaleUp`), focus trap.
- `Drawer.tsx`: Position variants (`right`, `left`, `bottom` sheet), backdrop blur overlay.
- `Toast.tsx`: Portal-based floating alert notifications (`toastFloatIn`).
- `Tabs.tsx`: Sliding active indicator, full keyboard arrow navigation.
- `Skeleton.tsx`: Shimmer placeholder loading states (`shimmer 1.8s infinite`).
- `Pagination.tsx`: Accessible page stepper with prev/next buttons.

---

## 2. Design Tokens (`web/src/app/globals.css`)
- **Brand Palette:** `#5B4CFF` Primary, `#7C3AED` Secondary, `#14B8A6` Accent, `#F8FAFC` Canvas.
- **Radii:** `--radius-button: 14px`, `--radius-input: 16px`, `--radius-card: 20px`, `--radius-modal: 28px`.
- **Depth Shadows:** `--shadow-card: 0 8px 30px rgba(15,23,42,0.08)`, `--shadow-hover: 0 18px 50px rgba(15,23,42,0.12)`.
- **Motion Physics:** `--motion-spring: cubic-bezier(0.16, 1, 0.3, 1)`.

---

## 3. Project Folder Structure
```
AuraMart/
├── backend/               # NestJS PostgreSQL REST API & Microservices
├── web/                   # Next.js 15 App Router Customer Storefront
│   ├── src/app/           # 81 Page Routes & Layouts
│   ├── src/components/    # Reusable UI Primitives & Section Modules
│   ├── src/context/       # CartContext, AuthContext, ThemeContext
│   └── src/lib/           # i18n, featureFlags, api, config
├── admin/                 # Next.js Admin Platform & 12 Operations Modules
├── vendor/                # Vendor Merchant Portal
├── mobile/                # Mobile App, Rider & Warehouse Suites
└── docs/                  # 290+ Platform Documentation Files
```

---

## 4. Server-Authoritative API Contracts
- `POST /api/v1/orders/preview`: Server calculates taxes, shipping fees, discounts, and order subtotals.
- `POST /api/v1/orders`: Server creates immutable order record, reserves inventory, and issues payment intent.
- Standard JSON Response Envelope: `{ success: true, data: ..., error: null, meta: ... }`.

---

## 5. Relational Database Schema (`backend/src/database/`)
- `users`: Core account details, auth credentials, loyalty AuraCoins balance.
- `products`: Product SKUs, pricing, stock levels, brand_id, category_id, is_flado flag.
- `orders`: Order ID, customer_id, total_amount, payment_status, shipping_address.
- `order_items`: Order line items with price snapshots.
- `vendors`: Vendor store details, onboarding status, quality scores.

---

## 6. SDUI Block Types (`web/src/components/cms/CmsPageRenderer.tsx`)
- `hero_banner_carousel`: Hero slider with CTAs and auto-play interval.
- `flash_sale_ticker`: Live countdown timer & deal card carousel.
- `categories_grid`: Category department pills with icon mappings.
- `product_carousel`: Recommendations (`trending`, `recommended`, `frequently_bought`, `bestsellers`).
- `promotional_banner`: High-contrast editorial promo split cards.
- `brand_logos`: Partner brand logo grid.
- `customer_testimonials`: Verified buyer reviews & 5-star ratings.

---

## 7. Single Theme System Architecture
- Single luxury light theme with obsidian accents (`#0F172A`).
- Glassmorphism overlays (`backdrop-filter: blur(24px)`).
- Accessibility high-contrast ratio (> 4.5:1 text, > 3:1 UI elements).
