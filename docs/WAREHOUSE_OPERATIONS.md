# AuraMart Warehouse Operations & Fulfillment Workflow Guide (WAREHOUSE-001)

## 1. Overview

Warehouse Operations standardizes picking, packing, dispatching, and return processing across central distribution centers and quick-commerce darkstores.

---

## 2. Order Fulfillment Stages

1. **Picking (`PICKING_QUEUE`):** Staff scan shelf location (`Zone A-12-04`) and item barcode (`8901234567890`).
2. **Packing (`PACKING_QUEUE`):** Verification of package weight, dimensions, and invoice slip.
3. **Dispatch (`DISPATCH_QUEUE`):** Dispatch manifest generated; handed over to delivery rider.
4. **Returns Inspection (`RETURNS_WAITING`):** Returned goods inspected and graded as `RESTOCK`, `DAMAGED`, `REPAIR`, or `DISPOSE`.
