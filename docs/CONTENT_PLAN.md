# AuraMart Commerce OS — Master Demo Content Plan (CONTENT-001)

**Date:** August 8, 2026  
**Status:** **ACTIVE / POPULATED**  
**Target Platform:** AuraMart Commerce OS (Backend API, Customer Web, Customer Mobile, Vendor Portal, Admin Platform)  
**Deployment Status:** **LIVE PRODUCTION DEPLOYMENT: PAUSED**

---

## 1. Executive Overview

Command `CONTENT-001` populates AuraMart Commerce OS with a production-grade master demo content foundation. Every customer-facing page, category grid, brand catalog, product detail page, search result, and homepage section displays realistic commercial data without relying on lorem ipsum or placeholder text.

### Population Metrics:
- **Total Master Categories:** 24 Top Categories
- **Total Master Brands:** 50 Real Master Brands
- **Total Marketplace Products:** 120 Products
- **Total Flado Quick-Commerce Products:** 60 Products
- **Total Products:** **180 Production-Quality Products**
- **Customer Reviews & Ratings:** 100+ Verified Customer Reviews
- **CMS Media Library Assets:** 20+ High-Resolution Media Assets (`CmsMediaAsset`)
- **Homepage SDUI Sections:** 20+ Admin-Editable Homepage Layout Blocks

---

## 2. Category Master Hierarchy (24 Top Categories)

1. **Electronics** (`electronics`): Laptops, Audio, Cameras, Smart Home (Icon: 💻)
2. **Mobiles** (`mobiles`): Flagship Smartphones & 5G Phones (Icon: 📱)
3. **Laptops** (`laptops`): Ultrabooks, MacBooks & Gaming Rigs (Icon: 🖥️)
4. **Fashion** (`fashion`): Trendsetting Streetwear & Lifestyle Wear (Icon: 👗)
5. **Men** (`men`): Men's Clothing & Style (Icon: 👔)
6. **Women** (`women`): Women's Wear & Ethnic Fashion (Icon: 👚)
7. **Kids** (`kids`): Kids' Fashion & Wear (Icon: 🧒)
8. **Shoes** (`shoes`): Footwear, Sneakers & Running Shoes (Icon: 👟)
9. **Beauty** (`beauty`): Skincare, Cosmetics & Serums (Icon: 💄)
10. **Health** (`health`): Health & Wellness Essentials (Icon: 💊)
11. **Home & Kitchen** (`home`): Smart Appliances & Kitchenware (Icon: 🏠)
12. **Furniture** (`furniture`): Living Room & Ergonomic Furniture (Icon: 🛋️)
13. **Grocery** (`groceries`): Supermarket & Quick Commerce Staples (Icon: 🛒)
14. **Sports** (`sports`): Fitness, Gym Equipment & Gear (Icon: ⚽)
15. **Books** (`books`): Bestsellers & Hardcover Books (Icon: 📚)
16. **Toys** (`toys`): Action Toys, LEGO & Board Games (Icon: 🧸)
17. **Baby** (`baby`): Baby Care & Diapering Essentials (Icon: 🍼)
18. **Pet Supplies** (`pet-supplies`): Dog Food & Cat Essentials (Icon: 🐶)
19. **Office** (`office`): Ergonomic Desk Equipment & Stationery (Icon: 📎)
20. **Automotive** (`automotive`): Car Accessories & Mounts (Icon: 🚗)
21. **Accessories** (`accessories`): Sunglasses & Eyewear (Icon: 🕶️)
22. **Travel** (`travel`): Luggage & Travel Bags (Icon: 🧳)
23. **Jewellery** (`jewellery`): Fine Jewellery & Solitaire Rings (Icon: 💍)
24. **Watches** (`watches`): Chronographs & Smartwatches (Icon: ⌚)

---

## 3. Brand Master Catalog (50 Master Real Brands)

Apple, Samsung, Sony, LG, Dell, HP, Lenovo, Asus, Acer, Nike, Adidas, Puma, Reebok, Levi's, H&M, Zara, L'Oréal, Maybelline, Nivea, Dove, Dettol, Nestlé, Britannia, Amul, Cadbury, Pepsi, Coca-Cola, Red Bull, Philips, Panasonic, Bosch, Whirlpool, IFB, Boat, JBL, Noise, Realme, OnePlus, Nothing, Xiaomi, OPPO, Vivo, Canon, Nikon, Fossil, Titan, Casio, AuraFresh, AuraTech, AuraStyle.

---

## 4. Product Catalog Architecture

### 120 Marketplace Products + 60 Flado Quick-Commerce Products = 180 Products
Every product record includes:
- Canonical Title & SEO-optimized Slug
- Detailed Short Description & Long Description
- Base Price, Discount Price & Reference MRP (in Minor Units integer / Decimal)
- Manufacturer SKU & Barcode
- Category & Brand Foreign Keys
- Product Images & Gallery URLs (Unsplash High-Res)
- Variants with Net Quantity, Unit of Measure, and Attributes
- Seller Listing & Inventory Stock Balances (Quick-Commerce stock default 50+ per darkstore)
- Customer Review Ratings & Aggregated Review Counts
- Merchandising Flags (`isFeatured`, `isTrending`, `isNewArrival`, `isBestSeller`)

---

## 5. Homepage CMS & SDUI Configuration

The backend `sdui_homepage.json` contains 20+ Admin-editable sections:
1. `top_announcement`: Big Billion Sale ticker banner
2. `hero_banners`: 4-Slide Hero Carousel (Big Billion Sale, Sneakers, Tech Hub, Flado 10-min)
3. `category_grid`: 24 Top Categories Grid
4. `sponsor_strip`: Official Brand Flagship stores (Apple, Samsung, Nike, Sony, Adidas, L'Oréal)
5. `flash_sale`: Hourly Lightning Deals countdown with discounted items
6. `flado_banner`: Flado 10-Minute Express Delivery hero callout
7. `trending_now`: Real-time Trending Products slider
8. `promo_strip_1`: AuraVIP Pass free delivery banner

---

## 6. Promotional Content & Coupons

Seeded coupons & promotions:
- `AURA10`: 10% Flat Discount across Marketplace
- `FLADOVIP`: Free Delivery & Fee Waiver for VIP Pass Members
- `FLASH20`: 20% Instant Discount on Flash Sale Items
- `WELCOME50`: Flat ₹50 Off on First Orders
- `BIGBILLION`: Extra 15% Cashback with HDFC Cards
- `FESTIVAL15`: Festive Sale Discount

---

## 7. Flado Quick-Commerce Darkstore Distribution

60 Flado products are distributed across active darkstores (`loc-bandra`, `loc-worli`, `loc-andheri`, `loc-juhu`):
- Fruits & Vegetables (Organic Bananas, Red Apples, Hydroponic Tomatoes)
- Dairy & Eggs (Amul Toned Milk, Amul Butter, Farm Fresh White Eggs)
- Bread & Staples (Britannia Whole Wheat Bread)
- Snacks & Beverages (Lay's Chips, Coca-Cola 750ml, Red Bull Energy Drink)
- Personal Care (Dettol Handwash, Dove Body Wash)

---

## 8. Admin CMS Controllability

Every content block, category banner, brand logo, hero slide, and product card is editable via the Admin Platform (`admin/src/app/cms`):
- Toggle section visibility (`visible: true/false`)
- Reorder homepage layout (`order`)
- Edit title, subtitle, CTA text, and CTA link
- Replace images and media assets via `CmsAssetsController` picker
- Update product IDs and brand spotlights
