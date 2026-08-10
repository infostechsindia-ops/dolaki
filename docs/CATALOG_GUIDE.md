# AuraMart Commerce OS — Master Catalog Structure & Data Guide

---

## 1. Master Category Taxonomy

| Category | Slug | Top Subcategories | Tax Class | Default Delivery SLA |
|----------|------|-------------------|-----------|---------------------|
| **Electronics** | `electronics` | Audio, Wearables, Laptops, Mobile Accessories | `STANDARD` (18%) | Standard 2-Day |
| **Fresh Grocery** | `fresh-grocery` | Fruits & Veg, Dairy & Bread, Staples, Organic | `FOOD_ESSENTIAL` (5%) | Flado 10-15 Min |
| **Fashion** | `fashion` | Men's Wear, Women's Wear, Footwear, Accessories | `STANDARD` (18%) | Standard 2-Day |
| **Beauty & Care** | `beauty-care` | Skincare, Haircare, Fragrances, Makeup | `STANDARD` (18%) | Express Next-Day |
| **Home & Kitchen** | `home-kitchen` | Cookware, Appliances, Decor, Storage | `STANDARD` (18%) | Standard 2-Day |
| **Beverages** | `beverages` | Juices, Cold Drinks, Tea & Coffee, Water | `FOOD_ESSENTIAL` (5%) | Flado 10-15 Min |

---

## 2. Product Metadata Standard

Every product SKU in AuraMart Commerce OS requires the following structured attributes:

```json
{
  "sku": "AM-ELE-AUD-001",
  "barcode": "8901234567890",
  "title": "AuraSound Pro Wireless Headphones",
  "brand": "AuraSound",
  "category": "electronics",
  "subCategory": "audio",
  "taxClass": "STANDARD",
  "countryOfOrigin": "India",
  "weightGrams": 280,
  "dimensionsCm": { "length": 18.5, "width": 15.0, "height": 8.0 },
  "hsnCode": "85183000",
  "basePriceMinor": 499900,
  "currency": "INR"
}
```

---

## 3. Variant Structure Guidelines

Variants support multi-dimensional combinations (e.g. `Color × Size` or `Storage × RAM`).
- Each variant has its own unique SKU, EAN barcode, MSRP, and inventory stock level across assigned fulfillment locations (Warehouse vs. Darkstore).

---

*Document generated for DATA-001.*
