# SURFACE API PROTOCOL SPECIFICATION — AuraMart Commerce OS
**Audit ID:** ENTERPRISE-PRECISION-001  
**Date:** 2026-08-18  

---

## REST Protocol Specification

```
+---------------------------------------------------------------------------------------+
| Protocol Endpoint             | Access  | Response Envelope Shape                      |
+-------------------------------+---------+----------------------------------------------+
| GET /api/v1/products          | Public  | `{ data: Product[], meta: PaginationMeta }`  |
| GET /api/v1/categories/tree   | Public  | `[ CategoryTreeNode ]`                       |
| GET /api/v1/sdui/homepage     | Public  | `{ surface: "MARKETPLACE", sections: [] }`   |
| POST /api/v1/orders           | Bearer  | `{ id: string, status: "Pending", ... }`     |
| GET /api/v1/vendors           | Admin   | `{ data: Vendor[], meta: PaginationMeta }`   |
+---------------------------------------------------------------------------------------+
```

---

## Surface Isolation Rules
- **Marketplace Surface:** Optimized for rich discovery, long-tail search, detailed product specifications, and seller store comparison.
- **Quick Commerce (Flado) Surface:** Optimized for sub-15 minute local darkstore dispatch, real-time rider tracking, and location-gated inventory availability.
