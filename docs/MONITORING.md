# AuraMart Commerce OS — Monitoring, Health & Structured Logging Guide

## 1. Overview
The Monitoring and Logging Framework (`backend/src/common/monitoring`, `backend/src/common/logging`, `backend/src/common/health`) provides application error tracking, distributed tracing, structured JSON logging, and Kubernetes health probes.

---

## 2. Structured JSON Logging
`StructuredLoggerService` formats log entries as JSON objects when `STRUCTURED_LOGGING=true` or in production environments:
```json
{
  "timestamp": "2026-08-08T12:00:00.000Z",
  "level": "error",
  "context": "PaymentsService",
  "message": "Payment intent confirmation failed",
  "service": "auramart-backend",
  "environment": "production"
}
```

---

## 3. Health & Readiness Probes
The `HealthController` exposes standard HTTP health endpoints:
- `GET /api/v1/health`: Returns overall system health, database connection state, memory usage, and uptime.
- `GET /api/v1/health/readiness`: Kubernetes readiness probe (returns 200 OK if database pool is ready to serve traffic).
- `GET /api/v1/health/liveness`: Kubernetes liveness probe (returns 200 OK if process event loop is responsive).

---

## 4. Monitoring Adapters
- **Sentry**: Application error capturing (`MONITORING_PROVIDER=sentry`).
- **OpenTelemetry**: Distributed tracing exporter (`MONITORING_PROVIDER=opentelemetry`).
