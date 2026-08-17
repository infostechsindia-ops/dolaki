# AuraMart 2027 Design Constitution & Governance Policy

Every feature, component, and surface added to **AuraMart Commerce OS** MUST strictly adhere to this Design Constitution. **No exceptions.**

---

## 1. Core Brand Identity & Palette Tokens
- **Brand Primary:** `#5B4CFF` (`--color-primary`) — Used for main CTAs, active states, key brand accents.
- **Brand Secondary:** `#7C3AED` (`--color-secondary`) — Used for gradient transitions, secondary highlights.
- **Brand Accent:** `#14B8A6` (`--color-accent`) — Used for Quick Commerce badges and positive trust signals.
- **Canvas Background:** `#F8FAFC` (`--color-background`) — Single luxury light theme.
- **Surface Elevation:** `#FFFFFF` (`--color-surface`) — Clean glassmorphic card overlays.

---

## 2. Radius & Depth Standards
- **Button Radius:** `14px` (`--radius-button`)
- **Input Radius:** `16px` (`--radius-input`)
- **Card Radius:** `20px` (`--radius-card`)
- **Image Radius:** `20px` (`--radius-image`)
- **Dialog Radius:** `24px` (`--radius-dialog`)
- **Modal Radius:** `28px` (`--radius-modal`)
- **Glass Blur:** `backdrop-filter: blur(24px)`
- **Layered Depth Shadows:** `--shadow-card: 0 8px 30px rgba(15, 23, 42, 0.08)`

---

## 3. Motion Physics & Interactive Feedback
- **Spring Physics Curve:** `cubic-bezier(0.16, 1, 0.3, 1)`
- **Tactile Click Feedback:** `button:active, .card:active { transform: scale(0.97) !important }`
- **Accessibility:** Overridden by `@media (prefers-reduced-motion: reduce)` to `0.01ms`.

---

## 4. Design Governance Principles
1. **Single-Sourced Components:** All primitive components must reside in `web/src/components/ui/`.
2. **Zero Hardcoded Styling:** All colors, font sizes, radii, and spacing must reference token variables in `web/src/app/globals.css`.
3. **WCAG 2.1 AA Compliance:** Single `<h1>` per route, 3px focus rings, 4.5:1 contrast, keyboard tab order.
4. **Server-Authoritative Invariants:** Zero client-side price math bypasses.
