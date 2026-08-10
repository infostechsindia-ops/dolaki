# Enterprise Operations Center Guide

## Overview

The **AuraMart Enterprise Operations Center** serves as the unified operational control plane for the AuraMart Commerce OS. Designed for enterprise merchants, operations managers, vendor managers, financial controllers, and risk analysts, the Operations Center provides real-time visibility and administrative controls across 12 dedicated operational modules.

The control plane aggregates multi-channel commerce streams—spanning primary B2C digital storefronts, quick-commerce darkstore networks, multi-vendor marketplaces, and B2B wholesale channels—into a cohesive administrative workflow.

---

## Central Operations Architecture

The Operations Hub is built on Next.js App Router architecture (`'use client'`) integrated with `AdminContext` state management, ensuring synchronized real-time operational state across orders, catalog products, vendors, inventory positions, and financial ledgers.

```
                  +-----------------------------------+
                  |   AURA MART OPERATIONS CENTER     |
                  |           (/operations)           |
                  +-----------------+-----------------+
                                    |
     +------------------------------+------------------------------+
     |                              |                              |
+----+--------------------+ +-------+------------------+ +---------+----------------+
| Customer & Merchandising| | Revenue & Supply Chain   | | Governance & Analytics   |
+-------------------------+ +--------------------------+ +--------------------------+
| * Customer 360 CRM      | | * Finance Center         | | * Fraud & Risk Detection |
| * Vendor CRM            | | * Refunds Engine         | | * Business Intelligence  |
| * Marketing Ops         | | * Procurement Center     | | * Audit & Compliance    |
|                         | | * Inventory Intelligence | | * Operations Search     |
+-------------------------+ +--------------------------+ +--------------------------+
```

---

## Operations Modules Breakdown

### 1. Executive Operations Hub
- **Route:** [`/operations`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/page.tsx)
- **Purpose:** Central executive dashboard delivering real-time enterprise metrics, active operational alerts, cross-module health indicators, and high-level GMV tracking.
- **Key Capabilities:** Total GMV tracking, active fulfillment SLA compliance, high-risk flag counters, vendor payout readiness indicators, and automated system alert dispatch.

### 2. Customer 360 CRM
- **Route:** [`/operations/crm`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/crm/page.tsx)
- **Purpose:** Full customer lifecycle intelligence, customer lifetime value (CLV) scoring, RFM behavioral segmentation, and integrated support ticket management.
- **Key Capabilities:** Customer 360 unified profiles, automated segment classification (VIP, Premium, Regular, At-Risk), churn risk flags, ticket escalation triggers.

### 3. Vendor Lifecycle CRM
- **Route:** [`/operations/vendor-crm`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/vendor-crm/page.tsx)
- **Purpose:** Comprehensive seller management, onboarding pipelines, performance scorecards, SLA tracking, and tier management.
- **Key Capabilities:** Vendor onboarding workflow, Commission tier assignment, SLA fulfillment compliance monitoring, performance penalty automated calculations.

### 4. Finance & Revenue Hub
- **Route:** [`/operations/finance`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/finance/page.tsx)
- **Purpose:** Multi-surface revenue management, commission calculation engines, tax compliance (GST/VAT), vendor payout queues, and daily closing ledgers.
- **Key Capabilities:** Gross vs. Net revenue breakdown, automated Marketplace commission distribution, tax withholding logs, batch payout queue management.

### 5. Refunds & Disputes Engine
- **Route:** [`/operations/refunds`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/refunds/page.tsx)
- **Purpose:** Enterprise return request processing, dispute arbitration, automated refund ledgers, and return fraud verification.
- **Key Capabilities:** Automated return policy eligibility validation, wallet vs. source card credit routing, merchant dispute arbitration, refund velocity limits.

### 6. Procurement & Supplier Center
- **Route:** [`/operations/procurement`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/procurement/page.tsx)
- **Purpose:** B2B supplier relationship management, Purchase Order (PO) lifecycle execution, Goods Received Notes (GRN), and Quality Control (QC) inspection flows.
- **Key Capabilities:** PO creation and approval workflows, multi-stage goods receipt validation, QC failure item quarantine, supplier fulfillment scoring.

### 7. Inventory Intelligence
- **Route:** [`/operations/inventory`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/inventory/page.tsx)
- **Purpose:** Advanced inventory optimization using ABC classification, aging stock detection, automated reorder triggers, and darkstore replenishment SLAs.
- **Key Capabilities:** ABC product classification (A: 80% value, B: 15%, C: 5%), aging stock bands (0-30, 31-60, 61-90, 90+ days), darkstore auto-replenishment requests.

### 8. Marketing Operations & Campaigns
- **Route:** [`/operations/marketing-ops`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/marketing-ops/page.tsx)
- **Purpose:** Multi-channel promotion management, coupon lifecycle enforcement, banner campaign orchestration, and attribution analytics.
- **Key Capabilities:** Flash sale event scheduling, promo code velocity limits, campaign ROI calculation, hero banner merchandising synchronization.

### 9. Fraud & Risk Detection
- **Route:** [`/operations/fraud`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/fraud/page.tsx)
- **Purpose:** Heuristic and algorithmic risk scoring for orders, account takeovers, coupon exploitation, and return fraud.
- **Key Capabilities:** Real-time risk scoring (0-100), automated order hold rules, proxy/VPN anomaly flags, manual analyst review queue with strict SLAs.

### 10. Business Intelligence & Reporting
- **Route:** [`/operations/reports`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/reports/page.tsx)
- **Purpose:** Dynamic analytics suite for sales, inventory turnover, vendor metrics, and customer acquisition report generation.
- **Key Capabilities:** Custom date range aggregations, export capabilities (CSV, XLSX, PDF), scheduled recurring reports, dimension filtering.

### 11. Audit Logs & Security Compliance
- **Route:** [`/operations/audit`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/audit/page.tsx)
- **Purpose:** System-wide immutable activity logs for security auditing, compliance verification (SOC2/PCI-DSS), and administrative accountability.
- **Key Capabilities:** Severity classification (LOW, MEDIUM, HIGH, CRITICAL), actor attribution (User, Vendor, System Agent, API Key), immutable audit trail export.

### 12. Global Operations Search
- **Route:** [`/operations/search`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/src/app/operations/search/page.tsx)
- **Purpose:** Unified indexed search engine across orders, products, customers, vendors, purchase orders, and audit events.
- **Key Capabilities:** Sub-100ms cross-entity indexing, deep linking to operational records, wildcard and attribute matching filters.

---

## Operational Security & RBAC Scoping

Access to the Operations Center modules is controlled via strict Role-Based Access Control (RBAC):

| Role | Accessible Modules | Key Restrictions |
| :--- | :--- | :--- |
| **Super Admin** | All 12 Modules | Full Administrative Rights |
| **Finance Controller** | Finance, Refunds, Reports, Audit | No PO creation or campaign edits |
| **Supply Chain Director** | Procurement, Inventory, Vendor CRM, Search | Read-only finance access |
| **Customer Support Lead**| CRM, Refunds, Search, Audit | No access to payout queues or POs |
| **Risk Analyst** | Fraud, CRM, Audit, Search | Cannot modify vendor commission tiers |

---

## System Deployment State

> [!IMPORTANT]
> **LIVE PRODUCTION DEPLOYMENT: PAUSED**
> All backend API integrations are fully specified and mocked client-side using `AdminContext` and operational state management services. Local simulation mode is active for UI/UX validation.
