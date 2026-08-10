# AuraMart Customer Account Center Architecture (CONTENT-006)

## 1. Overview

The AuraMart Customer Account Hub (`web/src/app/profile/page.tsx` & `mobile/src/app/account/index.tsx`) provides a unified, server-authoritative customer management portal.

---

## 2. Core Modules & Hub Sections

- **Dashboard Header:** Welcome Banner, Profile Completion progress card, AuraCoins balance, VIP Pass status pill, and AuraPay Wallet balance.
- **Profile Management:** Edit Full Name, Email, Phone, Alternate Phone, DOB, Gender, Preferred Language, Preferred Currency, and Marketing Alert Preferences (`POST /api/v1/auth/profile`).
- **Address Book:** Home, Work, and Other label chips, Default address toggle, delivery notes, and pincode serviceability check.
- **Order History & Returns:** Filterable orders, reorder CTA, invoice download placeholder, return/replacement request form with pickup scheduling.
- **Security & Privacy:** Password updates (`POST /api/v1/auth/security/password`), active session management (`GET /api/v1/auth/sessions`), and privacy preferences.
