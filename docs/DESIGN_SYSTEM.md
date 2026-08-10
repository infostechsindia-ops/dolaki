# AuraMart Commerce OS — Enterprise Design System Guide

## Overview
The AuraMart Design System provides unified tokens, typography hierarchies, layout primitives, and presentational UI components across Customer Web, Customer Mobile, Vendor Portal, and Admin Platform.

---

## 1. Color Palette & Brand Tokens

| Token | CSS Variable | Hex / Value | Usage |
|-------|--------------|-------------|-------|
| **Primary Brand** | `--color-primary` | `#7C3AED` | AuraMart Deep Violet core brand & primary CTA buttons |
| **Primary Hover** | `--color-primary-hover` | `#6D28D9` | Hover states for primary controls |
| **Flado Brand** | `--color-flado` | `#059669` | Flado Quick Commerce emerald accent & 10-min SLA badges |
| **Background Alt**| `--color-bg-alt` | `#F1F5F9` | Slate neutral card backgrounds |
| **Text Primary** | `--color-text-primary` | `#0F172A` | High-contrast body & heading text |
| **Success** | `--color-success` | `#10B981` | Order succeeded, inventory in-stock status |
| **Danger** | `--color-danger` | `#EF4444` | Out of stock, cancellation alerts, form error states |

---

## 2. Glassmorphism & Elevation System

```css
/* Glassmorphism Surface Token */
.glass-panel {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
}
```

---

## 3. UI Component Primitives
- `Button` (`components/ui/Button`): Primary, Secondary, Outline, Ghost, Danger variants with active scale animation.
- `ProductCard` (`components/product/ProductCard`): Presentational card with lens magnification hover zoom and badge overlay.
- `Modal` (`components/ui/Modal`): Accessible dialog with focus trap and backdrop overlay.
