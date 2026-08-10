# Warehouse Operations & Inventory Management Policy

---

## 1. Fulfillment Center Operating SLAs

| Operational Phase | Target SLA | SLA Breach Threshold | System Escalation |
|-------------------|------------|----------------------|-------------------|
| **Item Picking** | 15 Minutes | > 25 Minutes | Priority Queue Alert |
| **Order Packing** | 10 Minutes | > 15 Minutes | Supervisor Notification |
| **Stage & Handover** | 15 Minutes | > 30 Minutes | Dispatch Manager Alert |
| **Total FC Cycle** | **40 Minutes** | **> 70 Minutes** | P2 Operations Alert |

---

## 2. Inventory Audit & Cycle Counting

- **ABC Inventory Analysis**:
  - **A-Items** (Top 20% SKUs generating 80% revenue): Audited weekly.
  - **B-Items** (30% SKUs generating 15% revenue): Audited monthly.
  - **C-Items** (50% SKUs generating 5% revenue): Audited quarterly.
- **FEFO Batch Management**: Fast-expiry grocery items follow First-Expired, First-Out picking logic.
- **Damage & Stock Adjustments**: Damaged items quarantined in Bin `DAMAGED-Q1`. Requires Operations Manager approval for write-offs $> ₹5,000$.

---

*Document generated for OPS-001.*
