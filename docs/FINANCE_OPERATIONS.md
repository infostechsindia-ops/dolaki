# Finance Operations, Revenue & Settlement Guide

---

## 1. Settlement Cycles & Payout Schedules

- **Vendor Settlements**: Rolling T+7 settlement cycle processed automatically every Monday at 04:00 UTC via NEFT / IMPS / UPI batch transfers.
- **Rider Payouts**: Daily automated wallet settlements to rider accounts.
- **Refund Ledger**: Customer refunds credited to AuraPay Wallet instantly or bank account within 3-5 business days.

---

## 2. Revenue Accounting & Tax Reporting

- **Marketplace Commission Netting**: Server calculates commission during settlement batching:
  $$\text{Net Vendor Payout} = \text{Order Amount} - \text{Commission} - \text{GST on Commission} - \text{TDS (1\%)}$$
- **AuraCoins Accounting**: AuraCoins liability tracked in `wallet_transactions` table. 1 AuraCoin = ₹1.00 store credit.

---

*Document generated for OPS-001.*
