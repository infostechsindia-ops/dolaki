# Mobile Release Architecture & Variant Management Guide

---

## 1. Multi-App Architecture (`mobile/`)

AuraMart mobile apps are built from a unified React Native codebase (`mobile/`) leveraging Expo Router dynamic entry points and `EXPO_PUBLIC_APP_VARIANT` environment variables:

- **Customer App**: `EXPO_PUBLIC_APP_VARIANT=customer` (`com.auramart.customer`)
- **Vendor App**: `EXPO_PUBLIC_APP_VARIANT=vendor` (`com.auramart.vendor`)
- **Rider App**: `EXPO_PUBLIC_APP_VARIANT=rider` (`com.auramart.rider`)
- **Warehouse App**: `EXPO_PUBLIC_APP_VARIANT=warehouse` (`com.auramart.warehouse`)

---

## 2. Version Alignment

- **Version Name**: `2.0.0-rc.1`
- **Version Code (Android)**: `200001`
- **Build Number (iOS)**: `2.0.0`

---

*Document generated for STORE-001.*
