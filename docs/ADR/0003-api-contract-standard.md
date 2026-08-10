# ADR-0003: API Contract Standard

Date: 2026-08-05
Status: ACCEPTED
Deciders: CMD-007 Implementation

## Context

The AuraMart platform previously lacked a standardized API versioning scheme, response envelope format, machine-readable error codes, and strict input DTO validation. Endpoints returned raw entity objects or unstructured arrays without pagination metadata, making client-side error handling fragile and preventing consistent API contract generation.

## Decisions

### 1. Canonical API Versioning (`/api/v1`) & Legacy Deprecation Strategy
- The canonical backend API prefix is `/api/v1`.
- To preserve compatibility for existing released mobile/web consumers without breaking changes, legacy non-versioned `/api/*` routes remain supported as backward-compatible aliases or redirects to `/api/v1/*`.
- Legacy `/api/*` routes are marked as **DEPRECATED** and will be sunset in a future major platform upgrade after all clients have fully migrated.

### 2. Standardized Response Envelopes

All standard JSON HTTP responses follow explicit envelope shapes:

**Single Resource:**
```json
{
  "data": { "id": "123", "name": "Sample Product" }
}
```

**Collection (Non-paginated):**
```json
{
  "data": [
    { "id": "123", "name": "Sample Product" }
  ]
}
```

**Paginated Collection:**
```json
{
  "data": [
    { "id": "123", "name": "Sample Product" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "hasNextPage": true
  }
}
```

**Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for request body",
    "details": [
      { "field": "email", "message": "email must be an email" }
    ]
  }
}
```

### 3. Excluded Endpoints (Non-Enveloped)
Responses from the following are deliberately excluded from envelope wrapping:
- HTTP 204 No Content responses
- Binary stream or file downloads
- Health/readiness probe endpoints (`/api/health`)
- Webhook callbacks (e.g. Razorpay, third-party logistics)

### 4. Input Validation & Security (`ValidationPipe`)
- Global `ValidationPipe` is enabled with `whitelist: true`, `transform: true`, and `forbidNonWhitelisted: true` (or whitelist enforcement).
- Unexpected fields are stripped to prevent mass assignment security vulnerabilities.
- DTO validation is strictly restricted to syntactic checks. Authentication, authorization, and domain logic remain in their respective guards and service layers.

### 5. Pagination Boundaries
- Standard `PageQueryDto` enforces a default `page = 1` and `pageSize = 20`.
- Hard ceiling maximum `pageSize` is enforced (`max: 100`) to prevent client-side Denial-of-Service (DoS) via unbounded queries.

### 6. OpenAPI / Swagger Specification
- `@nestjs/swagger` is configured for API documentation and contract generation.
- Swagger UI is **disabled in production** (`NODE_ENV === 'production'`) for security hardening. OpenAPI JSON schema generation remains enabled during build/CI tasks.

### 7. Technical Debt Notice: Money Representation
- Migration of monetary fields to integer minor-units (paise) is deferred to **CMD-014 (Price Engine)** to prevent duplicated data migrations.
- Current floating-point price fields are documented as temporary technical debt and must not be expanded to new financial features.

## Consequences

- All client applications (Web, Mobile, Vendor, Admin) communicate with `/api/v1/` using predictable data envelopes and machine-readable error codes.
- API changes can be typechecked across clients using OpenAPI schema generation.
- Security against unexpected body field injection and unhandled validation errors is established across all backend endpoints.
