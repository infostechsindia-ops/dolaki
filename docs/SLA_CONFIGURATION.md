# AuraMart Master SLA Configuration Specification

---

## 1. Fulfillment SLAs Across Surfaces

| Surface | Service Level Target | Picking Timer | Packing Timer | Dispatch Timer | Delivery Radius |
|---------|----------------------|---------------|---------------|----------------|-----------------|
| **Flado Quick-Commerce** | **Sub-15 Minutes** | 3 Minutes | 2 Minutes | 2 Minutes | 3.5 km |
| **Marketplace Express** | **Same-Day / Next-Day** | 4 Hours | 2 Hours | 4 Hours | Metro City |
| **Marketplace Standard** | **2-3 Days** | 12 Hours | 6 Hours | 12 Hours | Pan-India / UAE |

---

## 2. Flado Auto-Cancellation Thresholds
- If no rider is assigned within **8 minutes** of order placement, darkstore manager is alerted.
- If unassigned at **12 minutes**, system triggers automatic order cancellation with instant wallet refund and ₹50 compensation coupon (`FLADO100`).

---

*Document generated for OPS-001.*
