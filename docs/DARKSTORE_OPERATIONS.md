# AuraMart Flado Darkstore Operations & Micro-Fulfillment Guide (DARKSTORE-001)

## 1. Executive Summary

Flado Darkstore Operations (`mobile/src/services/darkstore_service.ts`) powers sub-10 minute quick-commerce micro-fulfillment across hyper-local darkstores comparable to Blinkit, Zepto, Instamart, Noon Minutes, Talabat Mart, and Amazon Fresh while preserving **100% server authority**.

> [!IMPORTANT]
> **LIVE PRODUCTION DEPLOYMENT: PAUSED**
> All code changes, darkstore operations services, SLA monitoring calculations, replenishment queue state machines, and verification suites remain strictly repository-local.

---

## 2. Key Darkstore Subsystems

- **Darkstore Service (`mobile/src/services/darkstore_service.ts`):** Real-time picking/packing queues, SLA compliance tracking (98.4%), bin location mapping (`Bin B-04-A`), FEFO expiry rotation, and automated replenishment triggers.
- **SLA Countdown Monitors:** Real-time 3-minute picking SLA, 2-minute packing SLA, and 8.5-minute average door-to-door delivery.
- **Bin Location Management:** Cold-chain zone mapping (`Cold Zone C1`) for perishable goods.
