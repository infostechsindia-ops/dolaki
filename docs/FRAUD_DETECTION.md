# Fraud & Risk Detection Center Guide

## Overview

The **Fraud & Risk Detection Center** module ([`/operations/fraud`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/fraud/page.tsx)) protects AuraMart from transactional fraud, account takeovers, coupon exploitation, return abuse, and payment chargebacks. The engine evaluates incoming transactions in real-time, assigning a composite risk score (0-100) and routing suspicious orders to automated hold or manual review queues.

---

## Risk Scoring Methodology

Every order placed across B2C storefronts, mobile apps, or quick-commerce surfaces triggers a real-time risk assessment prior to payment authorization or darkstore picking release:

$$\text{Composite Risk Score} = \min\left(100, \sum_{i=1}^{K} w_i \times S_i\right)$$

Where $S_i$ represents individual risk feature scores and $w_i$ represents vector weighting parameters.

```
+-----------------------------------------------------------------------------------+
|                            RISK SCORE DECISION BANDS                              |
+---------------------+---------------------+---------------------------------------+
| Score Range         | Action Triggered    | Automated System Behavior             |
+---------------------+---------------------+---------------------------------------+
| **0 - 29** (Low)    | AUTO-APPROVE        | Released instantly to picking queue   |
| **30 - 69** (Medium)| STEP-UP VERIFICATION| 3DS challenge or SMS OTP step-up      |
| **70 - 100** (High) | AUTOMATED HOLD      | Frozen; routed to Analyst Queue       |
+---------------------+---------------------+---------------------------------------+
```

---

## Suspicious Order Detection Vectors

The risk engine evaluates multiple fraud vectors simultaneously:

```
                  +-----------------------------------+
                  |    REAL-TIME FRAUD EVALUATOR      |
                  +-----------------+-----------------+
                                    |
     +-------------------+----------+----------+-------------------+
     |                   |                     |                   |
+----+-------------+ +---+----------------+ +--+----------------+ +----+-------------+
| Network Anomaly  | | Device Fingerprint | | Order Velocity    | | Geo-Distance     |
| VPN / Proxy / TOR| | Multi-Account Link | | Rapid Orders      | | Bill/Ship Mismatch|
+------------------+ +--------------------+ +-------------------+ +------------------+
```

### Vector Definitions

1. **Proxy / VPN / Anonymizer Flags:** Identifies requests originating from commercial VPN providers, residential proxy networks, or TOR exit nodes.
2. **Device Fingerprint Matching:** Uses browser/device hashes to detect multiple user accounts sharing identical canvas fingerprints, MAC hashes, or hardware IDs.
3. **Rapid Velocity Anomalies:** Triggers when a single account or credit card places $> 3$ orders within a 5-minute window or attempts $> 2$ distinct shipping addresses in 24 hours.
4. **Geo-Location Mismatch:** Flags orders where the IP geolocation distance exceeds $500$ miles from the credit card BIN issuing country or billing address ZIP code.

---

## Refund Abuse Detection Engine

To combat return fraud, serial wardrobing, and claims of "item missing from package," the system maintains historical refund profiles:

### Risk Rules & Indicators
- **High Return Velocity:** Customers returning $> 35\%$ of total ordered items over a rolling 60-day period.
- **Serial Empty-Box Claims:** Accounts logging $> 2$ non-receipt / empty box claims within 12 months.
- **High-Value Item Return Ratio:** Returns involving luxury electronics or designer apparel exceeding $\$500$ unit value trigger mandatory serial number verification upon return receipt.

---

## Coupon & Promotion Abuse Patterns

The marketing risk layer monitors for unauthorized discount exploitation:

### Abuse Patterns & Countermeasures

| Pattern Name | Exploitation Mechanism | Countermeasure Action |
| :--- | :--- | :--- |
| **Referral Farming** | Creating dummy accounts to harvest new-user referral credits | Block referral payout if referee shares device hash with referrer |
| **Promo Code Stacking** | Exploiting API payloads to combine non-stackable promo codes | Server-authoritative checkout validation rejects invalid cart combinations |
| **Disposable Mail Abuse** | Generating transient email domains (`@tempmail.org`) for single promos | Domain MX record check blocks non-reputable email providers |

---

## Manual Review Queue Operations & SLAs

High-risk orders (Score 70+) are immediately frozen and assigned to the manual analyst review queue at [`/operations/fraud`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/fraud/page.tsx).

```
+-----------------------------------------------------------------------------------+
| ANALYST MANUAL REVIEW QUEUE                                                       |
| Order: #ORD-99120  Customer: John Smith  Risk Score: [ 84 / 100 ] HIGH RISK       |
| Flags: [ VPN Detected ] [ Multi-Account Link (3 Accounts) ] [ High AOV ($1,290) ] |
+-----------------------------------------------------------------------------------+
| [ APPROVE ORDER ]    [ REJECT & CANCEL ]    [ REQUEST ID VERIFICATION ]          |
+-----------------------------------------------------------------------------------+
```

### Analyst Queue Service Level Agreements (SLAs)

- **Quick-Commerce Orders (Flado Darkstore):** **15-Minute Max Review SLA** (to preserve 10-min delivery promise windows).
- **B2C Standard Express Shipping Orders:** **1-Hour Review SLA**.
- **B2B Bulk Orders:** **4-Hour Review SLA**.

### Analyst Actions & Resolution Outcomes
- **APPROVE ORDER:** Overrides risk hold; releases order to fulfillment.
- **REJECT & CANCEL:** Cancels order, releases inventory, voids authorization hold on card.
- **REQUEST VERIFICATION:** Sends automated SMS link requesting photo ID or card ownership proof.
- **BLACKLIST ACCOUNT & DEVICE:** Suspends account, blocks billing credit card, and adds device hash to permanent blocklist.
