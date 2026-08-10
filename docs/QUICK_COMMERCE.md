# AuraMart Flado Quick-Commerce Architecture (DARKSTORE-001)

## 1. Quick-Commerce Engine Overview

The Flado Quick-Commerce Engine orchestrates 10-minute instant delivery by synchronizing hyper-local darkstore inventory availability, serviceability geofencing (3km radius), rider auto-dispatching, and picking SLA countdowns.

---

## 2. Server Authority & Financial Safety

All delivery fees, express surcharges, SLA calculations, stock reservations, and rider assignments originate strictly from backend NestJS microservices (`FladoService`, `QuickFeesService`, `DeliveryService`).
