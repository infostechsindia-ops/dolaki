# Business Intelligence & Reporting Guide

## Overview

The **Business Intelligence & Reporting** module ([`/operations/reports`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/reports/page.tsx)) provides AuraMart enterprise decision-makers with a comprehensive data analytics and report generation suite. The module transforms transactional, inventory, financial, and customer data into actionable insights through interactive dashboards, multi-dimensional filters, scheduled reports, and export capabilities.

---

## Core Report Types

AuraMart BI categorizes analytics into seven specialized report suites:

```
+-----------------------------------------------------------------------------------+
|                        BUSINESS INTELLIGENCE REPORT SUITE                         |
+-------------------+-------------------+--------------------+----------------------+
| 1. Sales & GMV    | 2. Financials     | 3. Inventory       | 4. Customer Cohorts  |
| Gross/Net Revenue | Taxes & Payouts   | Turnover & Aging   | RFM & LTV Matrix     |
+-------------------+-------------------+--------------------+----------------------+
| 5. Vendor Performance | 6. Marketing Attribution | 7. Darkstore SLAs             |
| SLA Compliance & QC    | Promo ROI & Banners     | Picking & Delivery Velocity   |
+------------------------+-------------------------+-------------------------------+
```

### Report Type Detailed Matrix

| Report Name | Key Metrics Covered | Typical Stakeholders | Default Granularity |
| :--- | :--- | :--- | :--- |
| **Executive GMV & Revenue** | Gross Merchandise Value, Net Sales, Order Volume, AOV | C-Suite, Business Leads | Daily |
| **Financial Closing & Tax** | Tax collected (GST/VAT), TCS withholding, Vendor payouts | Finance Controllers, Auditors | Daily / Monthly |
| **Inventory Turnover & Aging**| Stock velocity, ABC classification, Dead stock value, Days of Supply | Inventory Managers | Weekly |
| **Customer RFM & LTV** | Recency, Frequency, Monetary value, Churn propensity | Growth & CRM Teams | Monthly |
| **Vendor Scorecard** | On-Time Delivery %, Quality pass rate, Return rate, Penalty points | Vendor Relations Managers | Monthly |
| **Campaign ROI & Promo** | Coupon redemption, Banner click-through, Sales lift | Marketing Ops Team | Campaign-level |
| **Darkstore Quick-Commerce**| 3-min pick SLA %, rider dispatch time, door-to-door SLA | Darkstore Operations | Hourly / Daily |

---

## Dynamic Filter Dimensions

Users can slice and dice BI report data using standardized enterprise filter dimensions:

```
+-------------------------------------------------------------------------------+
| FILTER CONSOLE                                                                |
| Date Range: [ 2026-08-01 to 2026-08-08 ]  Granularity: [ Daily v ]             |
| Sales Surface: [ All Surfaces v ]  Category: [ Consumer Electronics v ]        |
| Vendor: [ Apex Electronics v ]     Region: [ North America East v ]           |
+-------------------------------------------------------------------------------+
```

### Available Filter Dimensions
- **Temporal Granularity:** Hourly, Daily, Weekly, Monthly, Quarterly, Yearly.
- **Sales Surfaces:** B2C Storefront Web, B2C Mobile App, Quick-Commerce Darkstores, Multi-Vendor Marketplace, B2B Wholesale.
- **Product Hierarchy:** Root Category, Sub-Category, Brand, SKU ID, Variant Attribute.
- **Vendor / Supplier:** Vendor ID, Vendor Tier, Supplier Country.
- **Geographic Region:** Country, State/Province, Postal Zone, Specific Darkstore Hub.

---

## Export Formats & Data Serialization

Reports can be exported on-demand or automatically dispatched in multiple standardized formats:

### 1. CSV (Comma-Separated Values)
- **Use Case:** High-volume raw data ingestion for external Data Warehouses (Snowflake, BigQuery, Databricks).
- **Features:** Unformatted plain text, UTF-8 encoded, ISO-8601 timestamps.

### 2. XLSX (Formatted Microsoft Excel)
- **Use Case:** Financial review, pivot table manipulation, executive summary presentations.
- **Features:** Multiple formatted tabs, pre-calculated SUM/AVERAGE formulas, visual data bars, summary headers.

### 3. PDF (Executive Document Report)
- **Use Case:** C-Suite briefings, external stakeholder auditing, board meeting attachments.
- **Features:** Vector charts, corporate brand header, paginated tables, cryptographic signature checksum.

---

## Scheduled Recurring Report Engine

The automated schedule engine executes batch report generation without administrative intervention:

```
[Cron Trigger / Schedule] ---> [BI Query Execution] ---> [Data Serialization (PDF/XLSX)]
                                                                  |
[Slack / Teams Alert] <--- [S3 Storage Upload] <--- [Email Distribution List]
```

### Schedule Configuration Options
- **Frequencies:** Daily EOD (23:45 UTC), Weekly Monday Morning (06:00 UTC), Monthly 1st Day (02:00 UTC).
- **Recipient Management:** Individual admin user emails, internal team distribution lists (`finance-ops@auramart.com`), or external audit groups.
- **Automated Webhooks:** Direct delivery to AWS S3 buckets, Google Cloud Storage, or Slack notification channels.

---

## Data Governance & Access Control Scoping

BI reporting strictly enforces role-based column-level data masking:

- **Finance Managers:** Full visibility into cost prices, vendor margin cuts, and net profits.
- **Marketing Managers:** Masked customer PII (emails replaced with hashes `j***e@domain.com`), full campaign performance access.
- **Store Managers:** Scoped strictly to inventory and order data for their assigned darkstore facility.
