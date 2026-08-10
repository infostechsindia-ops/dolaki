# Full Business Simulation & Production Dress Rehearsal Guide
## AuraMart Commerce OS v2.0.0-rc.1 | Date: 2026-08-08

---

## 1. Multi-Actor E2E Simulation Workflow

```
[CUSTOMER PLACES ORDER] ──> [FLADO DARKSTORE ALLOCATION] ──> [PICKING (3M) & PACKING (2M)]
                                                                       │
[VENDOR SETTLEMENT (T+7)] <── [CUSTOMER RECEIVES OTP] <── [RIDER DISPATCH (SUB-15M)]
```

---

## 2. Simulated Operations Summary
- **Simulated Customers**: 10,000 active customer profiles across India & UAE.
- **Simulated Orders**: 1,000 simultaneous checkouts including Flado 10-minute quick-commerce items, marketplace electronics, and fashion apparel.
- **Simulated Fleets**: 250 riders operating with geofenced batching (max 2 orders/rider).
- **Simulated Settlements**: Rolling T+7 vendor settlements and daily rider wallet payouts processed cleanly without balance discrepancies.

---

*Document generated for UAT-001.*
