# MULTI-TIER CASCHING & INVALIDATION STRATEGY REPORT — AuraMart Commerce OS
**Audit ID:** REFACTOR-002  
**Date:** 2026-08-09  

---

## Multi-Tier Cache Topology

```
+-------------------------------------------------------------------------------+
| Layer 1: Client Edge ISR (Incremental Static Regeneration 60s)                |
|   └─ Pages: Homepage, Categories, Deals, Brands                               |
+-------------------------------------------------------------------------------+
| Layer 2: API Memory Cache (web/src/lib/api.ts TTL 60,000ms)                  |
|   └─ In-memory Map query cache for fast component navigation                  |
+-------------------------------------------------------------------------------+
| Layer 3: Redis v7 Distributed Cache (backend/src/common/throttling)           |
|   └─ Rate Limiting Counters & Session Tokens                                  |
+-------------------------------------------------------------------------------+
| Layer 4: PostgreSQL Shared Buffers (postgres:16-alpine)                       |
|   └─ Buffer pool tuning for high-frequency catalog reads                      |
+-------------------------------------------------------------------------------+
```

---

## Cache Invalidation Rules
1. **Product Mutation:** Updating a product via Admin API invalidates `/api/v1/products/:id` and triggers ISR revalidation on Next.js edge.
2. **Cart Invalidation:** Cart updates bypass static cache to guarantee server-authoritative stock accuracy.
