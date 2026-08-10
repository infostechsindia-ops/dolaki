# Marketplace Business Rules & Vendor Governance Policy

---

## 1. Marketplace Commission Schedule

AuraMart operates a tier-based merchant commission structure calculated authoritatively on net product subtotals:

| Merchant Category | Standard Marketplace Rate | Express / Quick-Commerce Rate | Settlement Schedule |
|-------------------|---------------------------|-------------------------------|---------------------|
| **Electronics & Gadgets** | 8.0% | 12.0% | Weekly (Mondays) |
| **Fashion & Apparel** | 12.0% | 15.0% | Weekly (Mondays) |
| **Beauty & Personal Care** | 10.0% | 14.0% | Weekly (Mondays) |
| **Fresh Grocery & FMCG** | 6.0% | 15.0% | Bi-Weekly |
| **Home & Appliances** | 9.0% | 13.0% | Weekly (Mondays) |

---

## 2. Vendor Onboarding & Approval Lifecycle

```
[VENDOR REGISTRATION] ──> [DOCUMENT VERIFICATION] ──> [CATALOG AUDIT] ──> [APPROVAL / REJECTION]
```

1. **Registration**: Vendor submits GSTIN / Tax ID, Bank Account, Business License, and Signatory Details. Initial state: `PENDING_VERIFICATION`.
2. **Document Audit**: Operations team verifies tax and banking details within 24 hours.
3. **Approval (`APPROVED`)**: Enables catalog listing creation and inventory updates.
4. **Rejection (`REJECTED`)**: Triggers automatic deactivation (`isActive: false`) of all associated seller listings across the marketplace.

---

## 3. Product Catalog Approval & Quality Scoring

- **Product Rejection Reasons Taxonomy**:
  1. `INVALID_BARCODE`: EAN/UPC barcode missing or unresolvable.
  2. `INSUFFICIENT_IMAGES`: Fewer than 2 high-resolution product images.
  3. `MISLEADING_SPECIFICATION`: Inaccurate dimensions, weight, or tax class.
  4. `PROHIBITED_ITEM`: Category restriction or prohibited trade item.
- **Seller Quality Score (0–100 Rating)**:
  - Calculated as: $100 - (\text{Return Rate} \times 2) - (\text{Late Shipment Rate} \times 1.5) - (\text{Dispute Rate} \times 3)$.
  - **Suspension Threshold**: Quality Score $< 50$ or Return Rate $> 5.0\%$ triggers automatic vendor account suspension (`SUSPENDED`).

---

*Document generated for OPS-001.*
