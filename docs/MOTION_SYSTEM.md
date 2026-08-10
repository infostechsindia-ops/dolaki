# AuraMart Commerce OS — Motion Design & Animation System Guide

## Overview
AuraMart utilizes GPU-accelerated CSS animations and React Native reanimated transitions for fluid, responsive interactions.

---

## 1. Keyframes & Transition Tokens

| Animation Name | Timing / Easing | Duration | Usage |
|----------------|-----------------|----------|-------|
| `shimmer` | `linear infinite` | 1.8s | Skeleton loading placeholder sweep |
| `float` | `ease-in-out infinite` | 3.0s | Hero promotional banner floating elements |
| `cardHover` | `cubic-bezier(0.16, 1, 0.3, 1)` | 250ms | Product card scale & elevation lift |
| `buttonPress` | `cubic-bezier(0.4, 0, 0.2, 1)` | 150ms | Active press compression effect |
| `modalSlide` | `cubic-bezier(0.16, 1, 0.3, 1)` | 300ms | Modal dialog slide-up & fade-in |
| `toastFade` | `cubic-bezier(0.16, 1, 0.3, 1)` | 300ms | Toast notification entry/exit |

---

## 2. Reduced Motion Fallback
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
