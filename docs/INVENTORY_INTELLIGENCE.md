# Inventory Intelligence & Analytics Guide

## Overview

The **Inventory Intelligence & Analytics** module ([`/operations/inventory`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/inventory/page.tsx)) powers demand forecasting, inventory optimization, stock aging analysis, automated reorders, and quick-commerce darkstore replenishment SLAs across AuraMart's fulfillment network.

---

## ABC Analysis Methodology

AuraMart categorizes catalog SKUs using the **Pareto Principle (80/20 Rule)** based on 90-day cumulative revenue generation:

```
+-----------------------------------------------------------------------------------+
|                            ABC INVENTORY DISTRIBUTION                             |
+---------------------+-----------------------+-------------------------------------+
| Category            | Revenue Contribution  | Catalog SKU Volume Percentage       |
+---------------------+-----------------------+-------------------------------------+
| Class A (High Value)| 80% of total revenue  | ~20% of catalog SKUs                |
| Class B (Med Value) | 15% of total revenue  | ~30% of catalog SKUs                |
| Class C (Low Value) | 5% of total revenue   | ~50% of catalog SKUs                |
+---------------------+-----------------------+-------------------------------------+
```

```
       Cumulative Revenue %
       100% |                                      +---------------- Class C
            |                            +---------+
        90% |                  +---------+
            |        +---------+                    Class B
        80% |  +-----+
            | /                                     Class A
          0 +-----------------------------------------------------
            0%        20%                       50%              100%
                               SKU Volume %
```

### Operational Management Policies by Class
- **Class A SKUs:** Daily stock audits, tight safety stock margins, priority supplier SLA enforcement, zero stockout tolerance.
- **Class B SKUs:** Weekly cycle counts, standard safety stock calculations, bi-weekly reorder reviews.
- **Class C SKUs:** Monthly cycle counts, higher safety stock buffers to minimize ordering overhead, candidate for marketplace-only fulfillment.

---

## Aging Inventory Bands & Holding Risk

To prevent capital lockup, inventory on hand is continuously bucketed into four aging bands measured from Goods Receipt Note (GRN) timestamp:

| Aging Band | Holding Duration | Operational Risk Level | Recommended Action Plan |
| :--- | :--- | :--- | :--- |
| **Band 1** | **0 - 30 Days** | Optimal Fresh Stock | Standard prime slot merchandising |
| **Band 2** | **31 - 60 Days** | Normal Turnover | Monitor sales velocity against forecast |
| **Band 3** | **61 - 90 Days** | Slow-Moving Warning | Inject into personalized promo recommendations |
| **Band 4** | **90+ Days** | High Dead Stock Risk | Automatic clearance discount markdown trigger |

---

## Dead Stock Detection & Clearance Automation

A SKU is classified as **Dead Stock** if zero units are sold within 45 consecutive days while maintaining active inventory stock.

### Automated Markdown Markdown Escalation
When dead stock is identified, the platform initiates an automated price markdown schedule:

1. **Stage 1 (Day 60 in stock with 0 velocity):** 15% clearance discount badge applied; featured in search suggestions.
2. **Stage 2 (Day 90 in stock):** 35% markdown applied; bundled into flash sale events.
3. **Stage 3 (Day 120+ in stock):** 60% liquidation markdown or vendor buyback request issued automatically via [`/operations/procurement`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/procurement/page.tsx).

---

## Dynamic Reorder Queue Engine

The Reorder Queue calculates optimal stock replenishment points in real-time using historical burn velocity, supplier lead time, and safety stock buffers:

$$\text{ROP} = (d_{\text{daily}} \times L) + \text{SS}$$

Where:
- $\text{ROP}$: Reorder Point (units).
- $d_{\text{daily}}$: Average daily sales velocity over the past 30 days.
- $L$: Supplier lead time in days.
- $\text{SS}$: Safety Stock buffer units.

### Safety Stock Calculation Formula
$$\text{SS} = Z \times \sqrt{L \times (\sigma_d)^2 + (d_{\text{daily}})^2 \times (\sigma_L)^2}$$

- $Z$: Service factor (e.g., $Z = 1.65$ for 95% service level confidence).
- $\sigma_d$: Standard deviation of daily demand.
- $\sigma_L$: Standard deviation of supplier lead time.

---

## Darkstore Replenishment SLAs & Micro-Fulfillment

Quick-commerce darkstores require high-frequency stock replenishment from central distribution centers to maintain 10-minute delivery promises.

```
+------------------+         Nightly Batch Transfer         +-------------------+
| Central Warehouse| -------------------------------------> | Darkstore Hub 01  |
| Distribution (CWC)|                                       | (Bin B-04-A)      |
+------------------+                                       +-------------------+
         |                                                           |
         |             Emergency Replenishment SLA (< 2 Hours)       |
         +-----------------------------------------------------------+
```

### Replenishment Service Level Agreements (SLAs)

| Replenishment Type | Trigger Threshold | Max Execution SLA | Transport Method |
| :--- | :--- | :--- | :--- |
| **Nightly Scheduled Transfer**| Stock $< 40\%$ of daily darkstore cap | Delivered by 05:00 AM local time | Dedicated regional delivery truck |
| **Emergency SLA Transfer** | Stock $< \text{Safety Stock}$ during active hours | Delivered within **120 minutes** | Express intra-city courier van |
| **FEFO Rotation SLA** | Product expiry $< 30$ days remaining | Rotate to front bin within **6 hours** | Internal darkstore bin audit |

### FEFO (First-Expired, First-Out) Enforcement
For quick-commerce groceries and perishable items, darkstore bin picking lists strictly enforce FEFO sequence. Riders and pickers are directed to pick batches with the nearest expiration date, avoiding inventory write-offs.
