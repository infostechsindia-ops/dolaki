# AuraMart Pre-Production Security Hardening Checklist (SECURITY-001)

- [x] HTTP Security Headers configured (`nosniff`, `DENY`, `HSTS`, `Permissions-Policy`, `CSP`)
- [x] CORS origin whitelist enforced via `CORS_ORIGINS` environment variable
- [x] Authentication & JWT revocation (`logout`, `logoutAll`, session tracking)
- [x] Role-Based Access Control (`@Roles(Role.CUSTOMER, Role.VENDOR_OWNER, Role.SUPER_ADMIN)`)
- [x] Parameterized SQL Queries via TypeORM QueryBuilder & Repositories
- [x] Rate limiting via NestJS `@nestjs/throttler` (Login, Register, OTP, Checkout, Search)
- [x] File upload MIME type validation, extension whitelist, and path traversal prevention
- [x] Audit logging for authentication, admin actions, vendor changes, orders, and refunds
- [x] Fail-Fast production secret checks (`JWT_SECRET`, `DATABASE_URL`)
