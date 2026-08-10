# AuraMart Commerce OS — Payment Provider Integration Guide

## 1. Overview
The Payment Framework (`backend/src/payments`) provides server-authoritative payment intent creation, customer checkout preview verification, webhook signature validation, payment confirmation, idempotency protection, and automated refund processing across multiple payment gateways.

---

## 2. Supported Providers
- **Stripe**: Configured via `PAYMENT_PROVIDER=stripe`. Simulates PaymentIntent `pi_...` IDs, 3DS authentication flows, webhook signature checks (`stripe-signature`), and `re_...` refunds.
- **Razorpay**: Configured via `PAYMENT_PROVIDER=razorpay`. Simulates Razorpay Orders `order_rzp_...`, HMAC-SHA256 signature verification (`x-razorpay-signature`), and `rfnd_rzp_...` refunds.
- **Cash on Delivery (COD)**: Configured via `PAYMENT_PROVIDER=cod`. Enforces $1,000 threshold limit and immediate status confirmation.
- **Generic Gateway**: Configured via `PAYMENT_PROVIDER=generic`.

---

## 3. Idempotency & Reconciliation
All payment operations accept `idempotencyKey` headers. Duplicate requests with matching keys return the existing active intent without re-charging the customer.

Status reconciliation can be triggered via `PaymentsService.reconcilePaymentStatus(intentId)`.
