# Customer 360 CRM Guide

## Overview

The **Customer 360 CRM** module ([`/operations/crm`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/crm/page.tsx)) provides AuraMart enterprise administrators with a unified 360-degree view of every registered customer. By combining transactional histories, financial balances, support interaction logs, and predictive behavioral metrics into a single interface, operations teams can optimize customer retention, personalize service levels, and protect platform margins against return or coupon abuse.

---

## Customer 360 Profile Tabs

Each customer record in the CRM is divided into five dedicated functional tabs:

```
+-------------------------------------------------------------------------------+
|  CUSTOMER PROFILE: Jane Doe (ID: CUST-88392)  [VIP SEGMENT] [RISK SCORE: 12]  |
+--------------+---------------+----------------+---------------+---------------+
|  1. Overview | 2. Orders     | 3. Financials  | 4. Support    | 5. Analytics  |
+--------------+---------------+----------------+---------------+---------------+
```

### 1. Overview Tab
- **Core Identity:** Full name, verified email, phone number, default shipping/billing addresses, account creation timestamp.
- **Account Status:** Active, Suspended, Flagged for Review, or Pending Verification.
- **Key Metrics Summary:** Total orders count, total spent, average order value (AOV), and customer segment tag.

### 2. Order History Tab
- **Transactional Ledger:** Complete list of all historical orders across B2C storefront, darkstores, and mobile app channels.
- **Fulfillment Status Tracking:** Real-time visibility into `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, and `RETURNED` orders.
- **Itemized Breakdown:** Product SKUs, quantity, unit price, discounts applied, vendor assignment, and tracking numbers.

### 3. Financials & Wallet Tab
- **Store Credit & AuraCoins Balance:** Active wallet credit, loyalty point balances, and expiration schedules.
- **Refund History:** Itemized refunds processed to original payment methods vs. store credit.
- **Payment Profiles:** Saved tokenized payment cards (PCI-DSS compliant, truncated masks only) and preferred payment methods.

### 4. Support & Communications Tab
- **Omnichannel Ticket History:** Log of all support tickets, live chat transcripts, and email inquiries handled by customer service agents.
- **CSAT Scores:** Post-interaction satisfaction scores and customer feedback notes.
- **Communication Log:** Automated transaction notification history (SMS, email, push notifications).

### 5. Behavioral Analytics Tab
- **Category Preferences:** Top purchased categories (e.g., Electronics, Fashion, Quick-Commerce Grocery).
- **Session Patterns:** Preferred platform (iOS, Android, Web), browse time, and abandoned cart frequency.
- **Churn Propensity:** Machine learning predicted churn risk index (0% to 100%).

---

## Customer Lifetime Value (CLV) Calculation

AuraMart calculates CLV using both historical and predictive algorithms to drive segmentation and VIP care policies.

### 1. Historical CLV Formula
$$\text{CLV}_{\text{hist}} = \sum_{i=1}^{N} (\text{Order Value}_i - \text{Refunds}_i - \text{Fulfillment Cost}_i)$$

### 2. Predictive CLV Engine
Predictive CLV factors in order frequency, historical AOV, category margin, and retention probability over a 24-month horizon:

$$\text{CLV}_{\text{pred}} = \overline{\text{AOV}} \times f_{\text{annual}} \times t_{\text{retention}} \times \overline{\text{Gross Margin \%}}$$

- $\overline{\text{AOV}}$: Average Order Value over past 12 months.
- $f_{\text{annual}}$: Annual purchase frequency.
- $t_{\text{retention}}$: Estimated retention period (years) based on RFM decay curve.
- $\overline{\text{Gross Margin \%}}$: Weighted average gross margin of purchased categories.

---

## Customer Segment Definitions

Customers are automatically categorized into dynamic segments based on purchase frequency, total spend, and engagement velocity:

| Segment Name | Criteria & Thresholds | Dedicated Operational SLAs |
| :--- | :--- | :--- |
| **VIP Customer** | Total Spend $> \$5,000$ OR Orders $> 25$ in 12 months | 15-minute Support SLA, Free Express Shipping, Dedicated Support Manager |
| **Premium Customer** | Total Spend $> \$2,000$ OR Orders $> 10$ in 12 months | 1-hour Support SLA, Priority Darkstore Packing |
| **Regular Customer** | Total Spend $\le \$2,000$, Active purchase within 90 days | Standard 2-hour Support SLA |
| **At-Risk Customer** | No purchase in $90+$ days OR Churn Index $> 70\%$ | Automated Re-engagement Promo Trigger, Proactive CS Check-in |

---

## Risk Flagging & Fraud Methodology

The CRM continuously evaluates customer behavior against risk vectors to protect platform profitability:

```
                  +-----------------------------------+
                  |      CUSTOMER RISK EVALUATOR      |
                  +-----------------+-----------------+
                                    |
     +------------------------------+------------------------------+
     |                              |                              |
+----+--------------------+ +-------+------------------+ +---------+----------------+
|  Return Abuse Vector    | | Promo Exploitation Vector| | Payment Risk Vector      |
|  * Return Ratio > 30%   | | * > 3 Promos / 7 Days    | | * > 2 Chargebacks / Year |
|  * Serial Item Wardrobing| | * Linked Device Hash    | | * Failed Payment Velocity|
+-------------------------+ +--------------------------+ +--------------------------+
```

### Risk Level Scoring Matrix
- **Low Risk (Score 0 - 25):** Standard customer. Full access to instant wallet refunds and COD payment options.
- **Medium Risk (Score 26 - 60):** Requires physical QC verification prior to refund credit issuance. Cash-On-Delivery (COD) disabled.
- **High Risk (Score 61 - 100):** Account automatically restricted. Orders sent to [`/operations/fraud`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/fraud/page.tsx) manual review queue.

---

## Support Ticket Integration

The CRM directly links customer support tickets with order fulfillment and financial refund controls:

1. **Auto-Triage Matrix:** Tickets tagged with high urgency for VIP customers or orders delayed past darkstore delivery SLAs.
2. **Escalation Rules:**
   - Level 1: Frontline AI Assistant & Customer Support Agent (General inquiries).
   - Level 2: Operations Lead (Refund approvals up to $250, damaged item claims).
   - Level 3: Finance Controller (Refunds exceeding $250, fraud disputes).
3. **In-Context Action Buttons:** Support staff can trigger instant wallet credit, reshipments, or issue delivery courier compensation vouchers directly from the CRM support tab.
