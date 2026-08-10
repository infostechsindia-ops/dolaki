# AuraMart Order Lifecycle & Vendor Fulfillment Architecture (CONTENT-005)

## 1. Overview

The Order Fulfillment Engine orchestrates order state transitions across Customer Web, Customer Mobile, Rider App, and Vendor Fulfillment Portals.

---

## 2. Order State Machine Transitions

```
PLACED ➔ CONFIRMED ➔ PROCESSING ➔ PACKED ➔ READY_FOR_PICKUP ➔ RIDER_ASSIGNED ➔ OUT_FOR_DELIVERY ➔ DELIVERED
                                                                                        └➔ CANCELLED / REFUNDED
```

### Transition Guards & Validation:
- `CONFIRMED`: Lock inventory balances across darkstore database records.
- `RIDER_ASSIGNED`: Verify rider active state & darkstore radius.
- `DELIVERED`: Verify 4-digit OTP delivery PIN for Flado Quick-Commerce orders.

---

## 3. Vendor Kanban Queues (`GET /api/v1/orders/vendor/queue`)

1. **New Orders:** `PENDING` / `CONFIRMED`.
2. **Picking Queue:** `PROCESSING`.
3. **Packing Queue:** `PACKED`.
4. **Ready Queue:** `READY_FOR_PICKUP`.
5. **Dispatched Queue:** `SHIPPED` / `OUT_FOR_DELIVERY`.
6. **Completed Queue:** `DELIVERED`.
