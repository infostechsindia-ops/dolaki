# Master Catalog Taxonomy & Product Structure Specification

---

## 1. Enterprise Category Taxonomy Structure

AuraMart features a 3-tier deep taxonomy: **Top-Level Category $\rightarrow$ Subcategory $\rightarrow$ Leaf Category**.

```
1. Electronics & Gadgets
   ├── Audio & Sound (Wireless Headphones, True Wireless, Soundbars)
   ├── Mobile & Tablets (Flagship Smartphones, Budget Devices, Tablets)
   ├── Wearables & Smartwatches (Fitness Bands, Premium Watches)
   └── Laptops & Computing (Ultrabooks, Gaming Laptops, Monitors)
2. Fresh Grocery & FMCG
   ├── Fresh Fruits & Vegetables (Organic Apples, Citrus, Leafy Greens)
   ├── Dairy & Bakery (Pasteurized Milk, Sourdough, Artisan Cheese)
   └── Cold Drinks & Juices (Fresh Juices, Sparkling Water, Energy Drinks)
3. Fashion & Apparel
   ├── Men's Wear (Denim Jackets, Cotton Shirts, Activewear)
   ├── Women's Wear (Summer Dresses, Silk Sarees, Athleisure)
   └── Footwear & Kicks (Pro Running Shoes, Sneakers, Formal Leather)
```

---

## 2. Product Record Attribute Standard

Every product record includes 100% complete commercial and technical specifications:
- `sku`: Unique stock keeping unit code (e.g., `AM-ELE-AUD-001`).
- `barcode`: `EAN-13` / `UPC-A` scannable barcode string.
- `taxClass`: `STANDARD` (18% GST), `FOOD_ESSENTIAL` (5% GST), `ZERO`, `EXEMPT`.
- `shippingWeightGrams`: Net and gross shipping weights.
- `dimensionsCm`: Package Length × Width × Height.
- `countryOfOrigin`: Manufacturing country declaration.

---

*Document generated for CONTENT-DATA-002.*
