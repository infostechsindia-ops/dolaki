# Enterprise Scheduled Theme Engine Specification
## AuraMart Commerce OS v2.0.0-rc.1 | Date: 2026-08-08

---

## Executive Summary

The **AuraMart Enterprise Theme Engine** enables CMS-controlled seasonal, event, and regional brand themes without requiring code redeployment. Overrides branding logo, primary/secondary color tokens, hero carousels, category icons, splash screen colors, loading screen accents, and campaign visibility.

---

## Scheduled Theme Preset Catalog

| Theme ID | Theme Name | Primary Accent | Target Regions | Typical Schedule |
|----------|------------|----------------|----------------|------------------|
| `default` | AuraMart Classic | `#6366F1` (Indigo) | Global | Year-Round |
| `diwali` | Diwali Lights Fest | `#D97706` (Amber/Gold) | India / Global | Oct 20 – Nov 05 |
| `ramadan` | Ramadan & Eid Kareem | `#059669` (Emerald) | UAE / Global | Feb 15 – Mar 25 |
| `black-friday` | Black Friday Mega | `#06B6D4` (Cyan/Neon) | Global | Nov 20 – Nov 30 |
| `independence-day` | Freedom Festival | `#EA580C` (Saffron) | India | Aug 10 – Aug 18 |
| `republic-day` | Republic Parade | `#2563EB` (Royal Blue) | India | Jan 20 – Jan 28 |
| `holi` | Festival of Colors | `#EC4899` (Magenta) | India | Mar 15 – Mar 22 |
| `eid` | Eid Celebration | `#10B981` (Mint) | UAE / Global | Apr 05 – Apr 12 |
| `christmas` | Merry Christmas | `#DC2626` (Crimson) | Global | Dec 15 – Dec 28 |
| `new-year` | New Year Bash | `#8B5CF6` (Violet) | Global | Dec 28 – Jan 05 |
| `summer-sale` | Summer Heatwave | `#0284C7` (Sky Blue) | Global | Jun 01 – Jun 30 |
| `back-to-school` | Back to Campus | `#2563EB` (Blue/Yellow) | Global | Aug 01 – Sep 10 |
| `fashion-festival` | Style Carnival | `#E11D48` (Rose Gold) | Global | Sep 15 – Sep 30 |
| `grocery-carnival` | Flado Super Fest | `#059669` (Green) | Global | Monthly Weekend |
| `electronics-week` | Tech & Gaming Week | `#7C3AED` (Electric Purple) | Global | Bi-Monthly |

---

## Overrides & Dynamic Capabilities

- **Brand Visuals**: Custom logo URL, hero carousel banners, splash screen background color.
- **Design Tokens**: Dynamic CSS variables `--theme-primary`, `--theme-secondary`, `--theme-banner-gradient`.
- **Campaign Visibility**: Toggle Hero Carousel, Flash Sale, Sponsored Strip, Studio Lookbook, and Live Deals independently.
- **Activation Modes**: Scheduled activation, manual CMS toggle, live preview mode, regional targeting, and instant one-click rollback.

---

*Document generated for UX-001.*
