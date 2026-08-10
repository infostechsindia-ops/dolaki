# Finance Center & Revenue Operations Guide

## Overview

The **Finance Center & Revenue Operations** module ([`/operations/finance`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/finance/page.tsx)) manages enterprise monetary flows across AuraMart Commerce OS. It provides real-time oversight of multi-channel gross revenue, multi-vendor marketplace commissions, tax withholding (GST/VAT/TCS), automated vendor payout queues, and daily end-of-day (EOD) financial closing ledgers.

---

## Revenue Tracking by Surface

AuraMart segregates gross merchandise value (GMV) and net recognized revenue across four core sales surfaces:

```
                  +-----------------------------------+
                  |   FINANCE CENTER REVENUE ENGINE   |
                  +-----------------+-----------------+
                                    |
     +-------------------+----------+----------+-------------------+
     |                   |                     |                   |
+----+-------------+ +---+----------------+ +--+----------------+ +----+-------------+
| B2C Storefront   | | Quick-Commerce     | | Multi-Vendor MP   | | B2B Wholesale    |
| (Direct Commerce)| | (Flado Darkstores) | | (3P Sellers)      | | (Corporate Bulk) |
+------------------+ +--------------------+ +-------------------+ +------------------+
```

### Surface Revenue Breakdown Table

| Sales Surface | Revenue Recognition Trigger | Pricing & Margin Structure | Primary Ledger Account |
| :--- | :--- | :--- | :--- |
| **B2C Storefront** | Item Delivery Confirmation | Full retail value less discounts | `REV_B2C_DIRECT` |
| **Quick-Commerce** | Rider OTP Handshake | Retail price + surge/picking fee | `REV_DARKSTORE_QC` |
| **Multi-Vendor MP**| Delivery + 14-day return window expiry | Marketplace commission percentage | `REV_MARKETPLACE_COMM` |
| **B2B Wholesale** | Invoice Issue / Goods Dispatch | Tiered contract price net of tax | `REV_B2B_WHOLESALE` |

---

## Multi-Vendor Commission Model

For third-party vendor sales, AuraMart enforces a automated commission calculation model configured by product category and vendor performance tier:

$$\text{Net Platform Commission} = (\text{Item Gross Total} \times \text{Commission Rate \%}) + \text{Fixed Fee} - \text{Vendor Promo Subsidy}$$

### Category Commission Tiers

| Product Category | Standard Commission Rate | Tier-1 Premium Vendor Rate | Fixed Order Handling Fee |
| :--- | :--- | :--- | :--- |
| **Apparel & Fashion** | 15.0% | 12.0% | $0.50 |
| **Consumer Electronics**| 8.0% | 6.5% | $1.00 |
| **Beauty & Personal Care**| 12.5% | 10.0% | $0.35 |
| **Groceries & Fresh** | 6.0% | 4.5% | $0.25 |
| **Home & Furniture** | 10.0% | 8.5% | $1.50 |

---

## GST / VAT Tax Compliance & Handling

The tax engine ensures compliant tax calculation, reporting, and withholding across regional tax jurisdictions:

### 1. Sales Tax / VAT Calculation
- Prices displayed are inclusive or exclusive of VAT/GST based on local jurisdiction settings.
- Line-item tax rate applied based on product HSN/SAC codes (e.g., 5%, 12%, 18%, 28%).

### 2. Tax Deducted at Source (TDS) & Tax Collected at Source (TCS)
- **TCS Withholding:** Platform automatically deducts 1.0% TCS (0.5% CGST + 0.5% SGST or 1.0% IGST) on net marketplace seller sales before payout release.
- **TDS Deduction:** Applicable section TDS (e.g., Sec 194O) is deducted and credited to the government tax portal quarterly.

---

## Financial Settlement Ledger Architecture

AuraMart utilizes a strict double-entry ledger architecture to ensure balanced account auditing:

```
[Customer Payment Received]  ---> Debit:  CASH_ESCROW_GATEWAY     ($100.00)
                              ---> Credit: CUSTOMER_LIABILITY_UNFULFILLED ($100.00)

[Order Delivered]            ---> Debit:  CUSTOMER_LIABILITY_UNFULFILLED ($100.00)
                              ---> Credit: VENDOR_PAYABLE_GROSS   ($88.00)
                              ---> Credit: PLATFORM_COMMISSION_REV ($10.00)
                              ---> Credit: TAX_PAYABLE_TCS        ($2.00)

[Vendor Payout Executed]    ---> Debit:  VENDOR_PAYABLE_GROSS   ($88.00)
                              ---> Credit: BANK_OUTFLOW_ACCOUNT   ($88.00)
```

---

## Vendor Payout Queue Management

The Payout Queue ([`/operations/finance`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/finance/page.tsx)) automates seller disbursements subject to risk checks and holdback reserves:

### 1. Reserve Holdback Policy
- **Standard Reserve:** 5.0% of weekly gross sales retained in rolling escrow for 14 days to cover return/refund claims.
- **High-Risk Reserve:** Up to 20.0% holdback for vendors with return rates exceeding 15% or active quality disputes.

### 2. Payout Execution Workflow
1. **Automated Queue Generation:** Weekly on Mondays at 00:00 UTC.
2. **Pre-Payout Audit Pass:** Verification of seller bank account tokens, tax compliance certificates, and open disputes.
3. **Batch Settlement Execution:** Direct integration with banking APIS / Stripe Connect / ACH payment rails.

---

## Refund Ledger & Debit Notes

When returns or order cancellations occur:

- **Customer Refund:** Issued back to source payment card (3-5 business days) or instantly credited to AuraMart Wallet.
- **Vendor Debit Note:** Generated automatically to reverse the `VENDOR_PAYABLE_GROSS` entry.
- **Commission Refund Policy:** If an order is cancelled prior to shipment or returned due to seller fault, platform commission is refunded to the vendor. If returned due to buyer remorse, handling fees remain non-refundable.

---

## Daily Closing & Reconciliation Report

At the conclusion of each financial day (23:59:59 UTC), the system generates an automated **Daily Closing Ledger Report**:

1. **Gateway Reconciliation:** Matches gateway settlement batch files (Stripe, PayPal, Razorpay) against platform order receipts. Variance threshold set to $\pm \$0.01$.
2. **Unmet Liability Calculation:** Tracks open unfulfilled orders held in escrow.
3. **Closing Sign-Off:** Automated notification dispatched to the Finance Controller with audit hashes attached.
