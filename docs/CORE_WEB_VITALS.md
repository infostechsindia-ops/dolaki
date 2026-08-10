# AuraMart Core Web Vitals Optimization (CONTENT-009)

## 1. Metrics & Targets

- **LCP (Largest Contentful Paint):** Target < 1.2s via priority hero images.
- **CLS (Cumulative Layout Shift):** Target < 0.05 via explicit image width/height aspect ratios and skeleton loaders.
- **INP (Interaction to Next Paint):** Target < 100ms via debounced inputs and non-blocking state updates.
- **TTFB (Time to First Byte):** Target < 150ms via static route pre-rendering.
