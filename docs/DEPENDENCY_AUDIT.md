# DEPENDENCY GRAPH & PACKAGE.JSON AUDIT — AuraMart Commerce OS
**Audit ID:** REFACTOR-001  
**Date:** 2026-08-09  

---

## 1. Package Dependency Audit Matrix

```
+-------------------------------------------------------------------------------+
| Project Workspace | Package Manager | Core Framework         | Audit Status   |
+-------------------+-----------------+------------------------+----------------+
| backend/          | npm             | NestJS 10, TypeORM 0.3 | Clean / Valid  |
| web/              | npm             | Next.js 14 App Router  | Clean / Valid  |
| admin/            | npm             | Next.js 14 App Router  | Clean / Valid  |
| vendor/           | npm             | Next.js 14 App Router  | Clean / Valid  |
| mobile/           | npm             | Expo SDK 56            | Clean / Valid  |
+-------------------------------------------------------------------------------+
```

---

## 2. Dependency Health Checklist
- **NestJS Throttler:** `@nestjs/throttler` (v6) registered globally in `backend/package.json` & `app.module.ts`.
- **Database ORM:** `typeorm` v0.3 & `pg` v8 for PostgreSQL 16 driver compatibility.
- **Testing Libraries:** `@testing-library/react` and `jest` pinned across frontend applications.
- **Zero Unused Heavy Assets:** Removed `web/src/data.zip` archive.
