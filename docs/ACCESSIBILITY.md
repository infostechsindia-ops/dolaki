# AuraMart Commerce OS — WCAG AA Accessibility Guide

## Overview
AuraMart enforces Web Content Accessibility Guidelines (WCAG 2.1 AA) compliance across all digital surfaces.

---

## 1. Compliance Audit Matrix

| Guideline | Implementation Strategy | Verification Metric | Status |
|-----------|------------------------|---------------------|--------|
| **1.4.3 Contrast (Minimum)** | Contrast ratio >= 4.5:1 for normal text and >= 3:1 for large text. | Verified on slate text vs background. | ✅ Compliant |
| **2.1.1 Keyboard** | All interactive controls accessible via `<Tab>`, `<Enter>`, `<Space>`, and arrow keys. | Tested on search, filters, modals. | ✅ Compliant |
| **2.4.7 Focus Visible** | Distinct 2.5px violet focus ring defined in `:focus-visible` CSS. | Outline offset 2px visible on focus. | ✅ Compliant |
| **2.3.1 Three Flashes** | No flashing content exceeding 3 Hz. | Static shimmers & smooth transitions. | ✅ Compliant |
| **2.2.2 Pause, Stop, Hide** | Carousel auto-play toggling & reduced motion media query overrides. | `@media (prefers-reduced-motion)` active. | ✅ Compliant |

---

## 2. ARIA Implementation Standard
- Modals: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`.
- Navigation Tree: `role="tree"`, `role="treeitem"`, `aria-expanded`.
- Form Error Alerts: `aria-live="polite"`, `role="alert"`.
