# AuraMart Commerce OS — Commercial Business Configuration Specification

---

## 1. Taxation & Tax Classes (GST/VAT)

All financial transactions use server-authoritative calculations in `PriceEngineService` based on basis points (100 basis points = 1.00%):

| Tax Class Code | Description | Basis Points | Applicable Categories |
|----------------|-------------|--------------|-----------------------|
| `STANDARD` | Standard Rate GST | 1800 (18.00%) | Electronics, Fashion, Beauty, Appliances |
| `FOOD_ESSENTIAL` | Essential Food GST | 500 (5.00%) | Grocery, Milk, Bakery, Fresh Produce |
| `ZERO` | Zero Rated Tax | 0 (0.00%) | Educational Books, Grains |
| `EXEMPT` | Tax Exempt | 0 (0.00%) | Exempt Healthcare Supplies |

- **Tax-Inclusive Default**: Display prices are tax-inclusive. System extracts taxable subtotal authoritatively using:
  $$\text{Taxable Subtotal} = \frac{\text{Line Subtotal} \times 10000}{10000 + \text{Basis Points}}$$

---

## 2. Shipping & Delivery Fee Schedule

| Surface | Order Threshold | Standard Shipping Fee | Express SLA |
|---------|-----------------|----------------------|-------------|
| **Marketplace (Standard)** | Orders $\ge$ ₹499 | FREE | 2-Day Delivery |
| **Marketplace (Standard)** | Orders < ₹499 | ₹49 | 2-Day Delivery |
| **Flado (Quick-Commerce)** | Non-VIP Carts | ₹25 | Sub-15 Min Delivery |
| **Flado (Quick-Commerce)** | VIP Pass Holders | FREE | Sub-15 Min Delivery |

---

## 3. Merchant & Vendor Commission Structure

| Merchant Tier | Marketplace Commission | Quick-Commerce Commission | Payout Frequency |
|---------------|------------------------|---------------------------|------------------|
| **Standard Vendor** | 10.0% | 15.0% | Weekly (Mondays) |
| **Gold Partner** | 8.0% | 12.0% | Bi-Weekly |
| **Enterprise Brand** | Custom Negotiated | 10.0% | Monthly |

---

## 4. Loyalty Program & VIP Membership

- **AuraCoins Earn Rate**: 2% cashback on net eligible item spend (1 AuraCoin = ₹1.00 value).
- **Flado VIP Pass**: Subscription cost ₹99/month. Benefits: Unlimited free delivery on orders > ₹199, priority rider assignment, exclusive flash sales.

---

*Document generated for DATA-001.*
