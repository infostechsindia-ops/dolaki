# AuraMart Commerce OS — CMS Workflow & Audit Log Guide

## Overview
Defines governance, revision history, rollbacks, and audit logging for all CMS operations.

---

## 1. Governance Rules
- Every layout save triggers an immutable audit log entry via `AuditService.log()`.
- Supports layout versioning (`version: N+1`) with instantaneous rollback capability.
- Prevents unverified editor modifications from reaching live SDUI endpoints.
