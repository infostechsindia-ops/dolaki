# AuraMart Threat Model & Risk Analysis (SECURITY-001)

## 1. Threat Vectors & Mitigations

| Threat Vector | Risk Level | Mitigation Strategy |
| --- | --- | --- |
| **Insecure Direct Object Reference (IDOR)** | HIGH | Ownership checks in `OrdersService`, `SupportService`, `CartService`, `CheckoutService`. |
| **SQL Injection** | HIGH | TypeORM parameterized queries & strict DTO validation pipes. |
| **Cross-Site Scripting (XSS)** | HIGH | React auto-escaping, CSP headers, and sanitized HTML bindings. |
| **Broken Authentication / Token Theft** | HIGH | HttpOnly SameSite cookies, JWT revocation tracking, bcrypt password hashing. |
| **File Upload Path Traversal** | MEDIUM | Filename sanitization, extension whitelist, and non-executable media storage. |
| **Rate Limit Bypassing** | MEDIUM | IP + User-Agent throttler on authentication and checkout routes. |
