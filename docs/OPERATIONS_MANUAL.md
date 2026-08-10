# AuraMart Operations Manual & Incident Response Guide

---

## 1. Daily Operations Standard Operating Procedures (SOP)

1. **06:00 UTC Morning Standup**: Operations team reviews Executive Dashboard (`/operations`), darkstore inventory levels, and pending vendor approvals.
2. **09:00 UTC Midday SLA Audit**: Monitor Darkstore SLA compliance (target $> 95\%$ on-time delivery) and customer support ticket queues.
3. **16:00 UTC Evening Reconciliation**: Review daily order totals, dispatch counts, refund requests, and rider allocation.

---

## 2. Emergency Escalation Procedures

- **P1 System Outage**: Alert DevOps lead immediately. Rollback script available: `bash scripts/rollback.sh`.
- **Payment Gateway Failover**: Switch `PAYMENT_PROVIDER` from `STRIPE` or `RAZORPAY` to `GENERIC` fallback in `.env.production` if gateway error rate $> 1\%$.

---

*Document generated for OPS-001.*
