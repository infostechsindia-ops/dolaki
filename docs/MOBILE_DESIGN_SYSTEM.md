# AuraMart Native Mobile Design System Tokens & Quality Standards (MOBILE-005)

## 1. Design System Tokens

- **Primary Brand Color:** `#7C3AED` (Aura Purple)
- **Secondary Accent:** `#3B82F6` (Electric Blue)
- **Flado Express Accent:** `#10B981` (Emerald Green)
- **Dark Surface:** `#0F172A` (Slate Dark)
- **Light Surface:** `#F8FAFC` (Slate Light)
- **Border Radius:** `12px` (Cards), `8px` (Buttons), `20px` (Pills)
- **Minimum Touch Target:** `44x44dp`

---

## 2. Quality Audit Guidelines

- **Typography & Scale:** H1 (24sp bold), H2 (20sp bold), Body (16sp regular), Caption (12sp medium).
- **Accessibility:** 100% screen reader VoiceOver / TalkBack label coverage, dynamic font scaling support.
- **Performance:** Sub-100ms render transitions, virtualized lists (`windowSize: 5`).
- **Server Authority:** All cart totals, coupons, stock levels, and order states calculated by backend APIs.
