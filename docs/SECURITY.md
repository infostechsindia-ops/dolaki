# AuraMart Enterprise Security & Hardening Architecture (SECURITY-001)

## 1. Executive Summary

AuraMart Commerce OS enforces a secure-by-default architecture across all 5 platform surfaces (Customer Web, Customer Mobile, Vendor Portal, Admin Platform, and Backend NestJS APIs).

---

## 2. HTTP Security Policy

- `X-Content-Type-Options: nosniff` (Prevents MIME sniffing attacks).
- `X-Frame-Options: DENY` (Prevents clickjacking).
- `X-XSS-Protection: 1; mode=block` (Browser XSS filtering).
- `Referrer-Policy: strict-origin-when-cross-origin` (Reduces referrer data exposure).
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` (Disables unauthorized device API access).
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` (Enforces HTTPS in production).
- `Content-Security-Policy: default-src 'self'` (Controls resource origin validation).

---

## 3. Authentication & RBAC Isolation

- **JWT Tokens:** Short-lived access tokens with secret rotation support.
- **Refresh Token Revocation:** `logout` and `logoutAll` flag tokens in database table `RefreshToken`.
- **IDOR Safeguards:** Customer, Vendor, Admin, Support, Orders, Wishlist, Reviews, and Returns endpoints enforce user ID and vendor ID ownership boundaries.
