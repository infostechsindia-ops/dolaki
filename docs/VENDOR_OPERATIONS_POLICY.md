# Vendor Operations & Compliance Policy

---

## 1. Fulfillment & Dispatch SLAs

- **Order Acknowledgment**: Vendors must confirm orders within 2 hours of receipt.
- **Dispatch SLA**: Packaged items must be handed over to assigned courier/rider within 24 hours of order placement.
- **Out of Stock Management**: Inventory adjustments must be reflected instantly via Vendor Portal API. Serial out-of-stock cancellations trigger a ₹100 penalty fee per order.

---

## 2. Order Cancellation & State Machine Enforcement

- **Mandatory Rider Check**: Orders cannot transition to `OUT_FOR_DELIVERY` without an assigned rider ID.
- **Dispute Resolution**: Open vendor disputes must be responded to within 48 hours via Vendor Dispute Console.

---

*Document generated for OPS-001.*
