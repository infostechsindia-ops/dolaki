# DECISIONS.md

## AuraMart + Flado — Architectural Decisions Log

> Any decision that changes a strategic concern (mobile stack, payment provider, database engine,
> search engine, order/fulfillment state machine, money representation, auth/token strategy,
> marketplace vs Flado boundary, API versioning, CMS schema contract) MUST be recorded here
> AND in a formal ADR under `docs/ADR/`.
>
> Never let any agent make these changes silently.

---

## Pending Decisions (require explicit approval before implementation)

| Decision | Options | Blocker | Relevant Command |
|----------|---------|---------|-----------------|
| Canonical Android customer app | `mobile/` Expo vs `app/` native Kotlin/Compose | Must not delete either until decided | CMD-059 |
| Database engine for production | PostgreSQL (configured) vs SQLite (current fallback) | `auramart.db` committed to repo | CMD-003 |
| Money representation | float (current, unsafe) vs decimal/minor-units (required) | All pricing entities use `type: 'float'` | CMD-014 |
| Auth token strategy | Access-only JWT (current) vs Access + Refresh token rotation | Proposed: ADR 0001 | CMD-005 |
| Payment provider | Unspecified (integration point only) | No provider chosen | CMD-045 |
| Search engine/provider | None configured (no abstraction layer) | Products endpoint does basic DB filtering | CMD-026 |
| Merchant Android app stack | Expo vs native (not yet started) | CMD-092 requires ADR | CMD-092 |

---

## Confirmed Decisions

_(None yet — all commands are TODO)_

---

## ADR Index

_(Empty — see `docs/ADR/` for future ADRs)_
