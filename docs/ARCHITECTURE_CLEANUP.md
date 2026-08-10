# ARCHITECTURE STANDARDIZATION & FOLDER NORMALIZATION — AuraMart Commerce OS
**Audit ID:** REFACTOR-001  
**Date:** 2026-08-09  

---

## Architecture Layer Standardization

```
+-------------------------------------------------------------------------------+
|                            ARCHITECTURE LAYER PATTERN                         |
+-------------------------------------------------------------------------------+
| UI Component Layer (React Server & Client Components in web/src/components)   |
|   ↓                                                                           |
| Unified API Client Layer (web/src/lib/api.ts & fetch REST callers)            |
|   ↓                                                                           |
| NestJS Controller Layer (backend/src/*/*.controller.ts)                        |
|   ↓                                                                           |
| NestJS Business Service Layer (backend/src/*/*.service.ts)                     |
|   ↓                                                                           |
| TypeORM Entity & Repository Layer (backend/src/*/*.entity.ts)                 |
|   ↓                                                                           |
| PostgreSQL 16 Database Engine                                                 |
+-------------------------------------------------------------------------------+
```

---

## Key Architectural Rules Enforced
1. **Server-Authoritative Data:** Client components never compute pricing, tax, or discounts locally.
2. **Explicit Legal Consent:** Checkout state enforces `termsAccepted: false` initial state.
3. **Async Event Handling:** Payment intent creation bound to explicit user async click handlers.
4. **Clean Folder Boundaries:** No temporary experiment folders or leftover build artifacts in repository root.
