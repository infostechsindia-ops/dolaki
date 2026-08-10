# ADR 0002: RBAC Role Expansion Strategy

## Status
ACCEPTED — 2026-08-05

## Context
The existing `User.role` column stores one of four string values: `CUSTOMER`, `VENDOR`, `ADMIN`, `DELIVERY`.

COMMERCE_OS.md §6 (CMD-006) requires 12 production roles:
`CUSTOMER`, `VENDOR_OWNER`, `VENDOR_STAFF`, `MERCHANT_OWNER`, `MERCHANT_MANAGER`, `MERCHANT_PICKER`, `RIDER`, `SUPPORT`, `OPERATIONS`, `FINANCE`, `CATALOG_ADMIN`, `SUPER_ADMIN`

The database uses TypeORM with SQLite (dev) / PostgreSQL (prod) and `synchronize: !isProd`.

## Decisions

### Decision 1: Role Column — VARCHAR (no DB-level constraint)
The `role` column is `{ type: 'varchar' }` with no DB-level CHECK constraint. We will expand the TypeScript union type to include all 12 roles. The column accepts any string, so new roles can be inserted without a schema migration on SQLite/PostgreSQL. For PostgreSQL production, no `ENUM` type is used, so no DDL migration is required.

### Decision 2: Legacy Role Migration (backward compatibility)
Existing records in the database hold legacy role values. The following mapping is applied **at application startup** via a one-time migration helper called by the auth service on bootstrap:

| Legacy Value | Migrated To |
|---|---|
| `VENDOR` | `VENDOR_OWNER` |
| `ADMIN` | `SUPER_ADMIN` |
| `DELIVERY` | `RIDER` |
| `CUSTOMER` | `CUSTOMER` (unchanged) |

This UPDATE is idempotent — it only modifies rows that still hold the old values.

### Decision 3: Merchant Roles (MERCHANT_OWNER / MERCHANT_MANAGER / MERCHANT_PICKER)
These roles map to Flado quick-commerce shop owners and staff. For CMD-006:
- `MERCHANT_OWNER` — the registered owner of a `FladoShop`. Set at shop registration.
- `MERCHANT_MANAGER` / `MERCHANT_PICKER` — future staff accounts (no `FladoShopStaff` entity yet). These roles are defined in the enum and accepted by the system, but no endpoint requires them exclusively in CMD-006; they are placeholders for CMD-073+.
- `FladoShop.ownerUserId` is made **authoritative** — populated from `req.user.userId` during `POST /flado/shops/register`. Existing shops without an owner remain nullable; ownership guards skip enforcement if `ownerUserId` is null (and log a warning).

### Decision 4: Global Guard Pattern — Opt-Out with `@Public()`
`AppModule.providers` currently has no `APP_GUARD`. We will add a global `JwtAuthGuard` that skips endpoints decorated with `@Public()`. All existing intentionally public endpoints (`GET /products`, `GET /sdui/homepage`, auth endpoints, etc.) will be decorated `@Public()`. This prevents any future endpoint from silently going unprotected.

### Decision 5: `RolesGuard` — Class + Handler metadata merging
The existing `RolesGuard` uses `reflector.get` (handler only). This misses class-level `@Roles()`. We replace with `reflector.getAllAndOverride` which correctly merges class and handler level, with handler taking precedence.

### Decision 6: Admin Role Hierarchy
The four admin-category roles (`SUPER_ADMIN`, `CATALOG_ADMIN`, `OPERATIONS`, `FINANCE`, `SUPPORT`) are not a full RBAC hierarchy for CMD-006. Instead we use an **explicit allowlist** approach: each endpoint declares the exact roles permitted. `SUPER_ADMIN` is included in every admin allowlist. Granular admin role scoping (e.g. FINANCE can only access billing) is enforced per endpoint.

## Consequences
- All existing `VENDOR` accounts in the DB become `VENDOR_OWNER` at startup.
- All existing `ADMIN` accounts become `SUPER_ADMIN`.
- All existing `DELIVERY` accounts become `RIDER`.
- Client code (vendor portal, admin panel) that reads `user.role` from JWT will receive the new string values — this is a **breaking change for clients** that compare against `'VENDOR'`, `'ADMIN'`, or `'DELIVERY'`. Client auth checks must be updated.
- Any future endpoint without `@Public()` will require a valid JWT — default-deny behavior is enforced globally.
