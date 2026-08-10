# ADR-0004: Production Idempotency Key Architecture

Date: 2026-08-05
Status: ACCEPTED
Deciders: CMD-009 Implementation

## Context

In distributed commerce systems, network retries, client timeouts, and user double-taps can cause duplicate request execution. For sensitive operations such as order creation, refund approvals, credit/udhaar issuance, and wallet mutations, duplicate execution causes critical financial anomalies (double charging, duplicate orders, double refunds).

## Decision

Implement a production-grade, database-backed, DB-atomic Idempotency Key architecture for sensitive mutation routes across AuraMart & Flado APIs.

### 1. Header Standard & Key Constraints
- Header: `Idempotency-Key` (Case-insensitive; alias `X-Idempotency-Key` supported).
- Constraints:
  - Max length: 128 characters.
  - Pattern: `/^[a-zA-Z0-9_\-\.\:]{1,128}$/`.
  - Rejection: Invalid or oversized keys are rejected with `400 Bad Request` (`IDEMPOTENCY_KEY_INVALID`).
  - Enforcement: Endpoints decorated with `@Idempotent({ required: true })` reject requests missing the header with `400 Bad Request` (`IDEMPOTENCY_KEY_REQUIRED`).

### 2. Key Scoping Formula & Tenant Isolation
To prevent key collisions across actors, tenants, and distinct business operations, every idempotency key is scoped server-side as:
```text
scopedKey = `${tenantOrActorId}:${operation}:${idempotencyKey}`
```
- `tenantOrActorId`: Derived authoritatively from authenticated tenant/shop ID (`shopId`/`vendorId`) or user ID (`req.user.userId`).
- `operation`: Explicit operation string declared via `@Idempotent({ operation: '...' })` decorator (e.g., `CREATE_ORDER`, `CREATE_FLADO_ORDER`, `REPAY_CREDIT`).
- `idempotencyKey`: Alphanumeric nonce supplied by client.

### 3. Canonical Request Fingerprinting
The request fingerprint is deterministically computed from the canonicalized operation context (excluding transient credentials and tokens):
```text
requestHash = sha256(HTTP_METHOD + ":" + CANONICAL_ROUTE + ":" + SORTED_QUERY_PARAMS + ":" + SORTED_ROUTE_PARAMS + ":" + SORTED_BODY_JSON)
```

### 4. Database-Atomic Claim Strategy
Database constraints serve as the final concurrency authority:
- `IdempotencyKey` entity has `@Column({ unique: true }) scopedKey: string`.
- Claiming a key uses an atomic `INSERT INTO idempotency_keys (scopedKey, status, ...)` operation with `status = 'PROCESSING'`.
- If two concurrent duplicate requests attempt key acquisition simultaneously, one succeeds while the other hits a database unique constraint violation (`code 23505` / SQLite `UNIQUE constraint failed`).
- The losing concurrent request is immediately rejected with `409 Conflict` (`IDEMPOTENCY_CONCURRENT_REQUEST`).

### 5. Failure Classes & State Model
State Machine: `PROCESSING` → `COMPLETED` | `FAILED`
- **Pre-Mutation Validation Failures** (e.g. `ValidationPipe` 400 or Guard 401/403): Occur before key acquisition or safely delete the key so the user can fix invalid inputs.
- **Ambiguous Post-Mutation Failures** (e.g. exception after database transaction commit): Set status to `FAILED` and record error outcome. The key remains locked against re-execution to prevent duplicate side effects. Subsequent retries return `409 Conflict` (`IDEMPOTENCY_FAILED_STATE`).

### 6. Response Replay & Security Controls
- **Replay**: For `COMPLETED` keys with matching `requestHash`, the interceptor replays the stored `statusCode` and JSON envelope `responseBody`.
- **Credential Safety**: `Set-Cookie`, authorization headers, and transient tokens are NEVER cached or replayed.
- **Guard Precedence**: NestJS Guards (`JwtAuthGuard`, `RolesGuard`) execute BEFORE `IdempotencyInterceptor`. A caller who has lost authorization since the initial request is rejected with `401/403` before any cached response can be replayed.

### 7. Retention & TTL
- Default retention TTL is 24 hours (`expiresAt = Date.now() + 24h`).
- Expired keys are safely ignored and periodically purged by cleanup routines.

## Consequences

- Financial, order, and credit mutations are guaranteed DB-atomic single execution.
- Client applications can safely implement automated retries.
- Zero risk of post-commit duplicate execution.
