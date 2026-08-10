# ADR 0001: Access + Refresh Token Rotation (RTR) Strategy

## Status
Proposed

## Context
The existing AuraMart authentication backend only generates access-only JWT tokens. The refresh endpoint `/api/auth/refresh` merely verifies expired access tokens and issues new access tokens, representing a security risk since access tokens cannot be revoked individually and session state is not tracked. To achieve production-grade security, we need:
- Session revocation capability (logging out of a device).
- "Logout all sessions" capability.
- Security protection against refresh token theft/reuse.

## Decision
We will implement an Access + Database-Backed Refresh Token Rotation (RTR) strategy with the following specifications:

### 1. Lifetimes
- **Access Tokens**: Short-lived JSON Web Tokens (JWT) with a lifetime of **15 minutes**.
- **Refresh Tokens**: Long-lived secure random strings with an explicit lifetime of **7 days** (604,800 seconds).

### 2. Token Storage
- **Browser Clients (Web, Admin, Vendor)**:
  - **Access Token**: Kept in memory (React context/state) to minimize XSS exposure.
  - **Refresh Token**: Stored in a `Secure` + `HttpOnly` + `SameSite=Lax` cookie.
    - **Production**: `Secure` cookie flag is mandatory.
    - **Development/Local**: Environment-aware configuration disables the `Secure` flag ONLY under non-production environments to allow testing over `http://localhost`.
  - Refresh tokens are never stored in localStorage.
- **Expo/Native Mobile Clients**:
  - **Access Token**: Stored in memory.
  - **Refresh Token**: Stored in secure hardware-backed device storage (e.g., `SecureStore` in Expo or `Keychain`/`Keystore` on iOS/Android).

### 3. Database Security (Token Hashing)
- Raw refresh tokens are never stored in the database.
- The server generates a secure random refresh token (hex encoded, 32 bytes), hashes it using **SHA-256**, and saves the hash in the `tokenHash` column of the `refresh_tokens` table.
- When validating a refresh request, the server hashes the incoming token and looks up the corresponding hash in the database.

### 4. Rotation, Reuse Detection, and Concurrency Grace Period
- **Rotation**: On every valid refresh request, a new access token and a new rotated refresh token are issued.
- **Reuse Detection**: If a request uses a refresh token that has already been rotated/revoked, the server assumes theft has occurred, invalidates all sessions/tokens for that user immediately, and throws an `UnauthorizedException`.
- **Race Condition / Concurrency grace period**:
  - To prevent race conditions (e.g., a client making concurrent API calls using the old refresh token before receiving the new one), the server allows a **15-second grace period** after a token's rotation.
  - During this grace period, if a concurrent refresh request is received for an already rotated token:
    - The server does **NOT** rotate the token again.
    - The server does **NOT** store or attempt to reconstruct the raw replacement token (which is impossible since only the hash was persisted).
    - Instead, the server generates a new **Access Token** but does **NOT** return a new refresh token or set a new refresh cookie, allowing the client to continue using the already-issued replacement refresh token.
  - If a refresh request is received for a rotated token outside the 15-second grace period, it is classified as a replay attack and triggers global session invalidation.

### 5. Expiration Cleanup (Garbage Collection)
- Expired or revoked refresh tokens will be cleaned up automatically in a garbage collection step during login/refresh requests:
  - When a user logs in or refreshes, the server deletes all expired refresh tokens for that user.

### 6. Logout and Session Management
- **Logout**: Revokes/deletes the current active refresh token session.
- **Logout-All**: Revokes all active refresh token sessions for the authenticated user.
- **Session List**: Returns metadata (creation date, expiration, IP, User-Agent) of all active sessions for the authenticated user.

## Threat / Security Rationale
- **XSS Protection**: Placing the refresh token in an HttpOnly cookie prevents browser Javascript from reading it, mitigating token theft via Cross-Site Scripting (XSS).
- **Database Leakage Protection**: Hashing the refresh token with SHA-256 ensures that if the database is compromised, the attacker cannot use the hashes to authenticate or hijack active sessions.
- **Token Hijacking Protection**: Token rotation and reuse detection guarantee that if a refresh token is somehow stolen (e.g. from mobile storage), any subsequent reuse attempt by either the legitimate user or the attacker immediately alerts the system and kills all active sessions, mitigating damage.
