# AuraMart Progressive Web App (PWA) Architecture (CONTENT-009)

## 1. Overview

The Progressive Web App implementation enables standalone installation, offline fallback handling, and native shortcuts.

---

## 2. PWA Manifest & Shortcuts (`web/public/manifest.json`)

- **Theme Color:** `#7C3AED`
- **Background Color:** `#F8FAFC`
- **Display Mode:** `standalone`
- **Shortcuts:** Flado 10-Minute Express (`/flado`), My Orders (`/account/orders`).

---

## 3. Offline Fallback Page (`web/src/app/offline/page.tsx`)

Displays friendly offline notice with network retry controls when connectivity is dropped.
