# AuraMart Cross-Platform State Management & Authority (SYNC-001)

## 1. State Management Principles

1. **Server as Single Source of Truth:** Neither Web nor Mobile apps perform autonomous financial calculations, discount evaluations, or stock reservations.
2. **Optimistic UI with Fallback:** Frontend applications render optimistic UI changes for smooth UX, but reconcile with backend server response payloads.
3. **Token Revocation & Session Isolation:** Active sessions store JWT tokens securely and query backend `/auth/profile` and `/cart` endpoints on launch.
