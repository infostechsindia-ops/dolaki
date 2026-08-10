# Payment Providers Verification & Integration Guide — DEPLOY-002

## Supported Payment Gateways
1. **Stripe (Sandbox Mode)**: Uses `pi_sandbox_*` intent reference and `ch_sandbox_*` transaction IDs. Verifies HMAC-SHA256 signatures for webhook events `payment_intent.succeeded` and `payment_intent.payment_failed`.
2. **Razorpay (Test Mode)**: Uses `order_rzp_*` order IDs and `pay_rzp_*` transaction IDs. Validates HMAC signatures using `order_id|payment_id`.
3. **Cash on Delivery (COD)**: Bypasses online gateway authorization. Enforces maximum cart threshold of $1,000 (100,000 minor units).
4. **Generic Gateway**: Supports tokenized card payments, UPI redirect flows, simulated failure flags (`simulateFailure: true`), and webhook verification.

## Idempotency & Duplicate Webhook Protection
- Backend checks idempotency keys passed in headers (`x-idempotency-key`) on `/api/v1/payments/intents` and `/api/v1/checkout`.
- Duplicate webhooks check existing transaction IDs in `payment_intents` table to prevent double-crediting or duplicate status transitions.
