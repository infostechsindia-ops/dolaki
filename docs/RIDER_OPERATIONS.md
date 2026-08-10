# AuraMart Last-Mile Rider Operations Guide (RIDER-001)

## 1. Overview

Rider Operations governs task dispatching, darkstore pickup validation, route navigation, customer contact, OTP handoff, and cash on delivery (COD) reconciliations.

---

## 2. Delivery Task Lifecycle

1. **`ASSIGNED`:** Automated algorithm assigns order to nearest active rider.
2. **`ACCEPTED`:** Rider accepts task within 30 seconds.
3. **`PICKED_UP`:** Barcode/QR scan of package at merchant darkstore.
4. **`ON_THE_WAY`:** Rider en route to customer destination; live telemetry broadcasted to customer app.
5. **`ARRIVED`:** Rider arrives at customer doorstep.
6. **`DELIVERED`:** Customer provides 6-digit OTP code (`801252`); delivery confirmed by backend.
