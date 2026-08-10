# Audit Logs & Compliance Guide

## Overview

The **Audit Logs & Compliance** module ([`/operations/audit`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/audit/page.tsx)) provides an immutable, cryptographically verifiable audit trail of all administrative actions, system events, financial modifications, and security events across AuraMart Commerce OS. Designed to meet SOC2 Type II, PCI-DSS v4.0, and GDPR compliance standards, the module records detailed actor attribution, event payloads, IP origins, and severity classifications.

---

## Tracked Event Types & Taxonomy

Audit events are categorized into five core operational event domains:

```
+-----------------------------------------------------------------------------------+
|                            AUDIT EVENT TAXONOMY SUITE                             |
+-------------------+-------------------+--------------------+----------------------+
| 1. Authentication | 2. Financials     | 3. Catalog & Price | 4. Vendor Governance |
| Logins & MFA      | Payouts & Refunds | Margins & Stock    | Status & Tiers       |
+-------------------+-------------------+--------------------+----------------------+
| 5. Security & System Configuration                                                |
| RBAC Mutates, API Keys, System Flags, Data Exports                                |
+-----------------------------------------------------------------------------------+
```

### Complete Event Taxonomy

| Event Code | Event Category | Description & Trigger | Severity Level |
| :--- | :--- | :--- | :--- |
| `AUTH_LOGIN_SUCCESS` | Authentication | Administrative user login verified | **LOW** |
| `AUTH_LOGIN_FAILED` | Authentication | Failed login attempt (Invalid credentials/MFA) | **MEDIUM** |
| `AUTH_MFA_CHALLENGE` | Authentication | MFA challenge issued or completed | **LOW** |
| `FINANCE_PAYOUT_INIT` | Financials | Batch vendor payout queue generated | **MEDIUM** |
| `FINANCE_PAYOUT_EXEC` | Financials | Funds transferred to vendor bank account | **HIGH** |
| `FINANCE_REFUND_OVERRIDE`| Financials | Analyst manually issued refund $> \$250$ | **HIGH** |
| `CATALOG_PRICE_MUTATE` | Catalog & Price | Product retail price or discount modified | **MEDIUM** |
| `CATALOG_STOCK_OVERRIDE`| Catalog & Stock | Inventory stock level overridden manually | **MEDIUM** |
| `VENDOR_STATUS_MUTATE` | Vendor | Vendor suspended, blacklisted, or reactivated | **HIGH** |
| `RBAC_ROLE_MUTATE` | Security | Admin user permissions or roles modified | **CRITICAL** |
| `API_KEY_GENERATE` | Security | New API key created with write scope | **HIGH** |
| `EXPLICIT_DATA_EXPORT` | Compliance | Bulk PII or financial report exported to CSV/PDF| **HIGH** |

---

## Actor Classification & Attribution

Every audit log entry mandates explicit actor attribution to guarantee accountability:

```
+-----------------------------------------------------------------------------------+
| AUDIT ENTRY: #LOG-883921                                                          |
| Timestamp: 2026-08-08T13:30:00Z  Event: [ VENDOR_STATUS_MUTATE ]                  |
| Actor Type: [ ADMIN_USER ]       Actor ID: usr_admin_9942 (sarah.jenkins)        |
| IP Address: 192.168.10.45        User Agent: Mozilla/5.0 (Macintosh; Intel...)   |
| Payload: { vendor_id: "v_881", previous_status: "ACTIVE", new_status: "SUSPENDED" }|
+-----------------------------------------------------------------------------------+
```

### Supported Actor Types
1. **`ADMIN_USER`:** Human platform administrator executing actions via the Next.js Admin Portal.
2. **`VENDOR_USER`:** External merchant acting within the Vendor Portal interface.
3. **`SYSTEM_AGENT`:** Automated background daemon, cron worker, or inventory reorder service.
4. **`API_KEY`:** Automated integration calling REST/GraphQL endpoints using scoped API tokens.

---

## Security Event Severity Classification

Events are classified into four severity levels driving alert dispatch and response SLAs:

| Severity Level | Definition & Operational Impact | Immediate System Action | Alert SLA |
| :--- | :--- | :--- | :--- |
| **LOW** | Routine operational events (e.g., standard login, product view) | Logged to database | No alert |
| **MEDIUM** | State mutations requiring accountability (e.g., price change, PO creation) | Logged + Included in Daily Digest | 24 Hours |
| **HIGH** | Sensitive financial actions or vendor status changes | Logged + Immediate Security Email | 15 Minutes |
| **CRITICAL** | Security breaches, mass PII export, or RBAC role escalations | Logged + Real-time PagerDuty / SMS | **Immediate (< 1 min)** |

---

## Immutable Log Architecture & Export Capability

To prevent log tampering or unauthorized deletion by compromised accounts:

```
[Event Generated] ---> [SHA-256 Block Hashing] ---> [Append to Immutable Audit Ledger]
                                                               |
[CSV / JSON Security Export] <--- [S3 Object Lock (WORM)] <----+
```

### Cryptographic Hashing (SHA-256)
Each log entry contains a cryptographic hash computed from its timestamp, actor ID, event payload, and the hash of the preceding record ($\text{Hash}_n = \text{SHA-256}(\text{Record}_n + \text{Hash}_{n-1})$), forming an unbroken audit chain.

### Audit Export Options
Operations team members with `AUDIT_EXPORTER` rights can export filtered logs at [`/operations/audit`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/audit/page.tsx):
- **JSON Payload Format:** Preserves nested JSON data structures for SIEM ingestion (Splunk, Datadog, Elastic Stack).
- **CSV Format:** Flat tabular structure for legal discovery and auditor review.

---

## Data Retention & Compliance Schedules

AuraMart's log retention engine satisfies international compliance standards:

- **SOC2 Type II:** 1-year active online search index retention.
- **PCI-DSS v4.0 Requirement 10:** 1-year minimum audit log retention with 3 months immediately available for analysis.
- **GDPR Article 30:** 5-year retention for administrative record-keeping of data processing activities.
