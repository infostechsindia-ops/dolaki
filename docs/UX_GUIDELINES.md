# AuraMart Commerce OS — UX Guidelines & Customer Journey Architecture

## Overview
AuraMart delivers a cohesive customer and merchant experience modeled after Amazon, Apple, Nike, Flipkart, Myntra, Noon, Blinkit, and Zepto.

---

## 1. Key Customer Journeys

### 1. Discovery & Search (PLP)
- Instant debounced autocomplete search with zero layout shift.
- Multi-attribute faceted filter sidebar (Category, Brand, Price Range, In-Stock, Rating).
- View mode toggle (Grid vs List).

### 2. Product Detail Page (PDP)
- Full-screen image gallery with hover lens magnification zoom.
- PIN code serviceability checker.
- Variant swatches with immediate stock projection update.
- Dynamic cross-sell recommendation carousel.

### 3. Server-Authoritative Checkout
- Address selection with default fallback.
- Delivery slot scheduling (Flado 10-min vs Standard).
- Payment intent orchestration (Stripe, Razorpay, COD).

---

## 2. Empty & Error State Principles
- All empty cart, empty wishlist, and zero search results screens must render high-contrast illustrative iconography and an explicit recovery call-to-action button (e.g. "Continue Shopping").
