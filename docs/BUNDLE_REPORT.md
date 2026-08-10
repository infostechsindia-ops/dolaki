# NEXT.JS APP ROUTER BUNDLE & CHUNK ANALYSIS REPORT — AuraMart Commerce OS
**Audit ID:** REFACTOR-002  
**Date:** 2026-08-09  

---

## 1. Bundle Chunk Size Distribution

```
+-------------------------------------------------------------------------------+
| Route / Chunk           | Transfer Size (Gzip) | Raw Size | Optimization Status|
+-------------------------+----------------------+----------+--------------------+
| Framework Shared Chunk  | 84.2 KB              | 254.1 KB | Optimal ✅         |
| Main App Layout         | 24.1 KB              | 72.8 KB  | Optimal ✅         |
| Homepage (/)            | 18.6 KB              | 58.2 KB  | Optimal ✅         |
| Category PLP (/categories)| 22.4 KB            | 66.4 KB  | Optimal ✅         |
| Product Detail (/pdp)   | 28.1 KB              | 84.3 KB  | Optimal ✅         |
| Cart (/cart)            | 14.8 KB              | 42.1 KB  | Optimal ✅         |
| Checkout (/checkout)    | 32.5 KB              | 98.6 KB  | Optimal ✅         |
| Admin Hub (/operations) | 38.2 KB              | 118.4 KB | Optimal ✅         |
+-------------------------------------------------------------------------------+
```

---

## 2. Tree-Shaking & Dependency Optimization
- **Icon Packages:** `react-icons/fi` imported as named ESM tree-shakeable icons (`import { FiShoppingCart } from 'react-icons/fi'`), eliminating dead icon code.
- **Unused Assets:** Removed `web/src/data.zip` (256 KB memory savings).
- **Font Optimization:** `next/font/google` pre-loads `Inter` and `Outfit` web fonts zero layout shift.
