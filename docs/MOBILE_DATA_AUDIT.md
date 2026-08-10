# Mobile API Connectivity & Data Consumption Audit

---

## 1. Mobile Screen Service Integration Matrix

| Mobile Screen | Target Endpoint | Service Class | Status |
|---------------|-----------------|---------------|--------|
| **Home Screen** | `GET /api/v1/sdui/homepage` | `ApiService` | ✅ Connected |
| **Category List** | `GET /api/v1/categories` | `ApiService` | ✅ Connected |
| **Product Detail** | `GET /api/v1/products/:id` | `ApiService` | ✅ Connected |
| **Cart & Checkout** | `GET /api/v1/cart`, `POST /api/v1/checkout` | `ApiService` | ✅ Connected |
| **Flado Store** | `GET /api/v1/flado/products` | `DarkstoreService` | ✅ Connected |
| **Rider Fleet** | `GET /api/v1/delivery/assignments` | `RiderService` | ✅ Connected |
| **Warehouse** | `GET /api/v1/inventory/picking` | `WarehouseService` | ✅ Connected |

---

*Document generated for DATAFLOW-001.*
