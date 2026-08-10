# Mobile Migration Inventory — Legacy Native Android to Canonical Expo

**Date**: 2026-08-06  
**Status**: ACTIVE (CMD-059 Architecture Baseline)

This document audits all native Android capabilities in the repository (`app/`) and maps them to their canonical Expo / React Native implementation targets (`mobile/`).

---

## 1. Native Capability Inventory

| Feature Domain | Legacy Native Android Implementation (`app/`) | Canonical Expo Target (`mobile/`) | Implementation Command | Notes |
|----------------|-----------------------------------------------|-----------------------------------|------------------------|-------|
| Application Bootstrap & Navigation | Android Activity / Fragment / Jetpack Navigation | Expo Router (file-based routing, `_layout.tsx`, tabs) | CMD-060, CMD-061 | Single entrypoint for Android + iOS |
| Authentication & Session Storage | SharedPreferences | `expo-secure-store` / Typed Auth Hook | CMD-060 | JWT auth with secure keychain storage |
| Customer Home (Marketplace + Flado) | Native RecyclerView / Views | React Native ScrollView / FlatList SDUI Feed | CMD-062 | Location-first Quick Home feed integration |
| Search & Auto-complete | Native SearchView | Typed Search Screen & Debounced Query Hook | CMD-063 | Store-scoped & global search |
| Product Listing Page (PLP) | Native Category Grid | Responsive Grid / Category Filters | CMD-064 | Darkstore inventory scope isolation |
| Product Detail Page (PDP) | Native Product Activity | PDP Screen with Image Carousel & Variant Picker | CMD-065 | Server-authoritative price & stock rendering |
| Cart & Quick Cart | Native Cart View | Authoritative Cart & Quick Cart Overlay | CMD-066 | Direct consumption of backend `/cart` APIs |
| Checkout & Order Placement | Native Checkout Activity | Checkout Preview & Payment Orchestration | CMD-067 | Verbatim backend fee breakdown & payment intent |
| Order History & Live Tracking | Native Order List | Order History & Real-Time Tracking Screen | CMD-068 | Server-authoritative ETA & tracking events |

---

## 2. Freeze Notice

As of **CMD-059**, all feature additions to `app/` (legacy native Android) are **FROZEN**.  
All ongoing mobile customer feature development will occur exclusively in `mobile/` using Expo and React Native.
