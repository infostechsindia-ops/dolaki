# Enterprise Reporting & Data Export Guide

## Overview

The **Enterprise Reporting & Data Export** guide documents the complete reporting capabilities available within the AuraMart Operations Center at [`/operations/reports`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/reports/page.tsx). This document details all 12 operational report types, automated scheduling options, secure recipient distribution, high-performance streaming export engines, and data retention policies enforced to satisfy corporate compliance and audit standards.

---

## Enterprise Report Catalog

AuraMart provides 12 specialized report templates covering every domain of the Commerce OS:

```
+-----------------------------------------------------------------------------------+
|                           ENTERPRISE REPORT TEMPLATES                             |
+-------------------+-------------------+--------------------+----------------------+
| 01. Exec GMV      | 02. Tax Ledger    | 03. Vendor Performance| 04. Customer RFM |
| 05. Stock Aging   | 06. PO & QC       | 07. Fraud & Risk   | 08. Promo & Campaign |
| 09. Refund Ledger | 10. Darkstore SLA | 11. Audit Logs     | 12. Catalog Search   |
+-------------------+-------------------+--------------------+----------------------+
```

### Detailed Template Specification

| # | Report Title | Core Output Data Fields | Supported Formats | Primary Stakeholders |
| :-: | :--- | :--- | :--- | :--- |
| **01** | **Executive GMV & Sales Master** | Gross GMV, Net Revenue, Orders Count, AOV, Discounts, Channel Breakdown | CSV, XLSX, PDF | C-Suite, Business Leads |
| **02** | **Financial Tax & Settlement** | Output Tax (GST/VAT), Input Credit, TCS/TDS withheld, Gateway Settlement | CSV, XLSX, PDF | Finance Controllers |
| **03** | **Vendor Performance & Commission**| Vendor Gross Sales, Commission Retained, Return %, OTD %, Penalty Points | CSV, XLSX | Vendor Relations |
| **04** | **Customer RFM & Segment** | Customer ID, CLV, Recency Score, Frequency, Monetary Value, Segment Tag | CSV, XLSX | Growth & CRM Teams |
| **05** | **Inventory Valuation & Aging** | SKU, Bin Location, Stock On Hand, Inventory Value, Days in Stock, Aging Band| CSV, XLSX | Inventory Directors |
| **06** | **Procurement & QC Report** | PO ID, Supplier Name, Ordered Qty, Received Qty, QC Pass %, Rejected Qty | CSV, XLSX, PDF | Procurement Managers |
| **07** | **Fraud & Risk Summary** | Order ID, Risk Score, Risk Flags, Manual Decision, Chargeback History | CSV, XLSX | Risk & Fraud Analysts |
| **08** | **Marketing & Promo Usage** | Promo Code, Redemptions, Total Discount Value, Attributed GMV, ROI % | CSV, XLSX | Marketing Ops Team |
| **09** | **Refund & Dispute Ledger** | Refund ID, Order ID, Refund Amount, Reason Code, Source Card vs. Wallet | CSV, XLSX | Customer Support Leads |
| **10** | **Darkstore SLA & Picking** | Darkstore Hub, Pick Time (Sec), Pack Time (Sec), SLA Pass %, OTP Handshakes | CSV, XLSX, PDF | Darkstore Operations |
| **11** | **System Audit & Security** | Event ID, Timestamp, Actor ID, Event Type, IP Address, Severity Level | CSV, JSON | Security & Compliance |
| **12** | **Catalog & Search Analytics** | Query Term, Zero-Result Queries, CTR %, Top Clicked SKU, Conversion Rate | CSV, XLSX | Merchandisers & SEO |

---

## Automated Scheduling Architecture

Reports can be configured to run automatically using standard 5-field cron expressions:

```
[Cron Schedule Engine] ---> [Queries Operational DB] ---> [Generates Export Artifact]
                                                                    |
[Audit Log Recorded] <--- [Dispatches to Recipients] <--- [Applies AES-256 Encryption]
```

### Supported Schedule Frequencies

- **Hourly Hot-Report:** Executed every hour at `:00` (e.g., Quick-Commerce Darkstore SLA reports).
- **Daily End-Of-Day (EOD):** Executed daily at 23:45 UTC (Financial ledgers and daily GMV reports).
- **Weekly Summary:** Executed every Monday at 06:00 UTC (Vendor scorecards and inventory aging).
- **Monthly Closing:** Executed on the 1st of every month at 02:00 UTC (Tax ledgers and executive reports).

---

## High-Performance Streaming & Export Optimization

To handle datasets exceeding 1,000,000 rows without memory overflow or application timeouts, AuraMart employs a chunked streaming export architecture:

```
+-----------------------------------------------------------------------------------+
| STREAMING EXPORT PIPELINE                                                         |
+---------------------+-----------------------+-------------------------------------+
| DB Cursor Fetch     | Row Chunk Buffering   | Stream Compression (gzip)           |
| 5,000 Rows / Batch  | Memory Cap: 50 MB     | Direct S3 Multipart Upload          |
+---------------------+-----------------------+-------------------------------------+
```

1. **Database Cursor Fetching:** Data is fetched from backend ledgers in chunks of 5,000 records.
2. **Backpressure Buffering:** Memory usage is capped at 50 MB per active export job.
3. **On-the-Fly Compression:** CSV and JSON streams are gzip-compressed in transit to reduce network transfer latency by up to 80%.

---

## Recipient Management & Security Controls

Distribution of generated reports is governed by strict encryption and recipient access policies:

### 1. Internal Recipient Routing
- Reports are dispatched to verified user email addresses or internal team distribution lists.
- Download links embedded in email notifications require active SSO / Admin session authentication.

### 2. External Webhook & Cloud Storage Integration
- **AWS S3 Bucket Export:** Direct encrypted upload to `s3://auramart-reports-prod/` using KMS key encryption.
- **SFTP Secure Server:** Automated push to corporate accounting server via SSH key pair.
- **Webhook Endpoint:** JSON payload notification dispatched to enterprise ERP systems (SAP, Oracle, NetSuite).

### 3. File Security & Encryption Standards
- **Encryption at Rest:** All generated report files stored in artifact storage are encrypted using AES-256.
- **Encryption in Transit:** Transport enforced strictly via TLS 1.3.

---

## Role-Based PII Anonymization Matrix

Before exporting, the system automatically applies PII masking based on the requesting user's RBAC role:

| RBAC Role | Email Masking | Phone Masking | Financial Cost Price | Audit Action Logged |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Full Unmasked | Full Unmasked | Visible | Yes (`EXPLICIT_DATA_EXPORT`) |
| **Finance Controller** | `j***e@domain.com`| `+1 *** *** 4920` | Visible | Yes (`EXPLICIT_DATA_EXPORT`) |
| **Support Lead** | Full Unmasked | Full Unmasked | Hidden | Yes (`EXPLICIT_DATA_EXPORT`) |
| **External Vendor** | `N/A (Customer)` | `N/A` | Vendor SKU Cost Only| Yes (`EXPLICIT_DATA_EXPORT`) |

---

## Enterprise Data Retention Policies

AuraMart enforces automated data lifecycle management to satisfy regulatory compliance requirements:

| Data Classification | Hot Storage Period | Cold Storage Archival | Purge / Destruction Schedule |
| :--- | :--- | :--- | :--- |
| **Operational Raw Logs** | 90 Days | 1 Year (AWS S3 Glacier) | Purged after 365 days |
| **Financial & Tax Reports**| 2 Years | 7 Years (WORM Compliance) | Retained for 7 years minimum |
| **Customer RFM Snapshots** | 180 Days | 2 Years | Anonymized after 2 years |
| **Audit Logs (HIGH/CRITICAL)**| 1 Year | 5 Years | Retained for 5 years minimum |

> [!NOTE]
> All automated purge operations generate a signed cryptographic audit entry in [`/operations/audit`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/audit/page.tsx).
