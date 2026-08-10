# AuraMart Commerce OS — Architecture Index
## RELEASE-002 | 2026-08-08

This document serves as the master index of all architecture documentation
for AuraMart Commerce OS v2.0.0.

---

## Core Architecture

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Complete system architecture overview — backend, frontend, mobile, infrastructure |
| [COMMERCE_OS.md](../COMMERCE_OS.md) | Commerce OS specification and design principles |
| [DECISIONS.md](./DECISIONS.md) | Architecture Decision Records (ADRs) |
| [FEATURE_PARITY.md](./FEATURE_PARITY.md) | Feature comparison vs. Amazon, Flipkart, Myntra, Noon, Blinkit |

---

## Backend Architecture

| Document | Description |
|----------|-------------|
| [CHECKOUT_ARCHITECTURE.md](./CHECKOUT_ARCHITECTURE.md) | Checkout flow, tax calculation, coupon application |
| [PDP_ARCHITECTURE.md](./PDP_ARCHITECTURE.md) | Product Detail Page data architecture |
| [PAYMENT_FLOW.md](./PAYMENT_FLOW.md) | Payment processing and refund flow |
| [TAX_ENGINE.md](./TAX_ENGINE.md) | GST/VAT tax calculation engine |
| [INVENTORY_INTELLIGENCE.md](./INVENTORY_INTELLIGENCE.md) | Inventory management and intelligence |
| [ORDER_FULFILLMENT.md](./ORDER_FULFILLMENT.md) | Order lifecycle and fulfillment state machine |
| [AUDIT_LOGS.md](./AUDIT_LOGS.md) | Audit log system design |
| [SYNC_ARCHITECTURE.md](./SYNC_ARCHITECTURE.md) | Cart/wishlist/profile sync architecture |
| [IDEMPOTENCY.md](./IDEMPOTENCY.md) | (see backend src/idempotency/) |
| [SEARCH_ENGINE.md](./SEARCH_ENGINE.md) | Search indexing and query architecture |

---

## Frontend Architecture

| Document | Description |
|----------|-------------|
| [HOMEPAGE_CMS.md](./HOMEPAGE_CMS.md) | SDUI-driven homepage CMS architecture |
| [CMS_PLATFORM.md](./CMS_PLATFORM.md) | CMS content management system |
| [CMS_PAGE_BUILDER.md](./CMS_PAGE_BUILDER.md) | Visual page builder |
| [CMS_WORKFLOW.md](./CMS_WORKFLOW.md) | Content workflow and publishing |
| [NAVIGATION_MANAGER.md](./NAVIGATION_MANAGER.md) | Navigation management system |
| [SEO_MANAGER.md](./SEO_MANAGER.md) | SEO metadata management |
| [REDIRECT_MANAGER.md](./REDIRECT_MANAGER.md) | URL redirect management |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | UI design system and tokens |
| [MOTION_SYSTEM.md](./MOTION_SYSTEM.md) | Animation and motion system |
| [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) | Client-side state management |

---

## Mobile Architecture

| Document | Description |
|----------|-------------|
| [MOBILE_ARCHITECTURE.md](./MOBILE_ARCHITECTURE.md) | React Native / Expo architecture |
| [MOBILE_DESIGN_SYSTEM.md](./MOBILE_DESIGN_SYSTEM.md) | Mobile design system |
| [MOBILE_MIGRATION_INVENTORY.md](./MOBILE_MIGRATION_INVENTORY.md) | Screen migration inventory |
| [RIDER_APP.md](./RIDER_APP.md) | Rider delivery app architecture |
| [RIDER_ARCHITECTURE.md](./RIDER_ARCHITECTURE.md) | Rider system overview |
| [WAREHOUSE_APP.md](./WAREHOUSE_APP.md) | Warehouse worker app |
| [WAREHOUSE_ARCHITECTURE.md](./WAREHOUSE_ARCHITECTURE.md) | Warehouse system overview |
| [VENDOR_APP_ARCHITECTURE.md](./VENDOR_APP_ARCHITECTURE.md) | Vendor mobile app |
| [VENDOR_MOBILE.md](./VENDOR_MOBILE.md) | Vendor mobile features |

---

## Commerce Features

| Document | Description |
|----------|-------------|
| [CAMPAIGN_ENGINE.md](./CAMPAIGN_ENGINE.md) | Marketing campaign engine |
| [PERSONALIZATION_ENGINE.md](./PERSONALIZATION_ENGINE.md) | ML-powered personalization |
| [RECOMMENDATION_ENGINE.md](./RECOMMENDATION_ENGINE.md) | Product recommendations |
| [MERCHANDISING_ENGINE.md](./MERCHANDISING_ENGINE.md) | Merchandising and curation |
| [NOTIFICATION_ENGINE.md](./NOTIFICATION_ENGINE.md) | Multi-channel notifications |
| [AURACOINS.md](./AURACOINS.md) | Loyalty coin system |
| [MULTI_CURRENCY.md](./MULTI_CURRENCY.md) | Multi-currency support (INR/AED) |
| [REGIONAL_COMMERCE.md](./REGIONAL_COMMERCE.md) | India and UAE commerce specifics |
| [SOCIAL_COMMERCE.md](./SOCIAL_COMMERCE.md) | Social shopping features |
| [QUICK_COMMERCE.md](./QUICK_COMMERCE.md) | Flado 10-minute delivery |
| [DARKSTORE_ARCHITECTURE.md](./DARKSTORE_ARCHITECTURE.md) | Darkstore system |
| [LAST_MILE_LOGISTICS.md](./LAST_MILE_LOGISTICS.md) | Last-mile delivery |
| [MICRO_FULFILLMENT.md](./MICRO_FULFILLMENT.md) | Micro-fulfillment centers |
| [FILTER_ENGINE.md](./FILTER_ENGINE.md) | Product filter engine |

---

## Operations & Business Intelligence

| Document | Description |
|----------|-------------|
| [OPERATIONS_CENTER.md](./OPERATIONS_CENTER.md) | Operations Center overview |
| [CRM.md](./CRM.md) | Customer 360 CRM |
| [FINANCE_CENTER.md](./FINANCE_CENTER.md) | Finance and settlement center |
| [FRAUD_DETECTION.md](./FRAUD_DETECTION.md) | Fraud & risk detection |
| [BUSINESS_INTELLIGENCE.md](./BUSINESS_INTELLIGENCE.md) | BI & reporting platform |
| [PROCUREMENT.md](./PROCUREMENT.md) | Vendor procurement management |
| [REPORTING.md](./REPORTING.md) | Reporting and analytics |
| [ENTERPRISE_OPERATIONS.md](./ENTERPRISE_OPERATIONS.md) | Enterprise ops overview |
| [VENDOR_OPERATIONS.md](./VENDOR_OPERATIONS.md) | Vendor operations |
| [DARKSTORE_OPERATIONS.md](./DARKSTORE_OPERATIONS.md) | Darkstore operations |
| [RIDER_OPERATIONS.md](./RIDER_OPERATIONS.md) | Rider operations |
| [WAREHOUSE_OPERATIONS.md](./WAREHOUSE_OPERATIONS.md) | Warehouse operations |
| [INVENTORY_OPERATIONS.md](./INVENTORY_OPERATIONS.md) | Inventory operations |

---

## Content & Information Architecture

| Document | Description |
|----------|-------------|
| [CONTENT_PLAN.md](./CONTENT_PLAN.md) | Content strategy and page inventory |
| [CONTENT_MODEL.md](./CONTENT_MODEL.md) | CMS content model |
| [CONTENT_PLATFORM.md](./CONTENT_PLATFORM.md) | Content platform architecture |
| [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) | Site information architecture |
| [FOOTER_ARCHITECTURE.md](./FOOTER_ARCHITECTURE.md) | Footer navigation structure |
| [HELP_CENTER.md](./HELP_CENTER.md) | Help center architecture |
| [BLOG_PLATFORM.md](./BLOG_PLATFORM.md) | Blog and editorial platform |
| [BUYING_GUIDES.md](./BUYING_GUIDES.md) | Buying guide system |
| [COMPANY_PLATFORM.md](./COMPANY_PLATFORM.md) | Company pages |
| [SEO_CONTENT.md](./SEO_CONTENT.md) | SEO content strategy |
| [BRAND_STOREFRONT.md](./BRAND_STOREFRONT.md) | Brand storefront architecture |

---

## Security & Compliance

| Document | Description |
|----------|-------------|
| [SECURITY.md](./SECURITY.md) | Security architecture overview |
| [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) | Security implementation checklist |
| [SECURITY_VALIDATION.md](./SECURITY_VALIDATION.md) | TEST-001 security validation report |
| [THREAT_MODEL.md](./THREAT_MODEL.md) | Threat model and risk assessment |
| [PRODUCTION_SECURITY.md](./PRODUCTION_SECURITY.md) | Production security hardening |

---

## Infrastructure & Deployment

| Document | Description |
|----------|-------------|
| [DOCKER.md](./DOCKER.md) | Docker configuration guide |
| [DEVOPS.md](./DEVOPS.md) | DevOps practices and pipelines |
| [CI_CD.md](./CI_CD.md) | CI/CD pipeline architecture |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Pre-deployment checklist |
| [DEPLOYMENT_MANIFEST.md](./DEPLOYMENT_MANIFEST.md) | Deployment manifest |
| [DEPLOYMENT_PIPELINE.md](./DEPLOYMENT_PIPELINE.md) | Pipeline configuration |
| [BACKEND_DEPLOYMENT.md](./BACKEND_DEPLOYMENT.md) | Backend deployment guide |
| [PRODUCTION_ENVIRONMENT.md](./PRODUCTION_ENVIRONMENT.md) | Production environment setup |
| [PRODUCTION_INFRASTRUCTURE.md](./PRODUCTION_INFRASTRUCTURE.md) | Infrastructure specifications |
| [PRODUCTION_PROVISIONING_GUIDE.md](./PRODUCTION_PROVISIONING_GUIDE.md) | Provisioning guide |
| [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) | All environment variables |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Development environment setup |
| [BACKUP_RECOVERY.md](./BACKUP_RECOVERY.md) | Backup and recovery procedures |
| [MONITORING.md](./MONITORING.md) | Monitoring and alerting |
| [MONITORING_STACK.md](./MONITORING_STACK.md) | Monitoring stack configuration |

---

## Release Documentation

| Document | Description |
|----------|-------------|
| [RELEASE_NOTES.md](./RELEASE_NOTES.md) | v2.0.0 release notes |
| [RELEASE_CANDIDATE.md](./RELEASE_CANDIDATE.md) | RC declaration and validation matrix |
| [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) | Operator go-live checklist |
| [FINAL_AUDIT.md](./FINAL_AUDIT.md) | RELEASE-002 complete audit report |
| [CHANGELOG.md](./CHANGELOG.md) | All changes across all versions |
| [VERSION_MANIFEST.md](./VERSION_MANIFEST.md) | Dependency version manifest |
| [ARCHITECTURE_INDEX.md](./ARCHITECTURE_INDEX.md) | This document |
| [RELEASE_MANIFEST.md](./RELEASE_MANIFEST.md) | Release manifest |
| [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) | Release gate checklist |
| [RELEASE_QUALIFICATION.md](./RELEASE_QUALIFICATION.md) | TEST-001 qualification report |

---

## Quality & Testing

| Document | Description |
|----------|-------------|
| [E2E_TEST_REPORT.md](./E2E_TEST_REPORT.md) | End-to-end test report |
| [PERFORMANCE_REPORT.md](./PERFORMANCE_REPORT.md) | Performance test report |
| [ACCESSIBILITY_REPORT.md](./ACCESSIBILITY_REPORT.md) | Accessibility audit report |
| [API_CONTRACT_REPORT.md](./API_CONTRACT_REPORT.md) | API contract validation report |
| [UAT_REPORT.md](./UAT_REPORT.md) | User acceptance testing report |
| [RESPONSIVE_AUDIT.md](./RESPONSIVE_AUDIT.md) | Responsive design audit |
| [ACCESSIBILITY.md](./ACCESSIBILITY.md) | Accessibility standards |
| [CORE_WEB_VITALS.md](./CORE_WEB_VITALS.md) | Core Web Vitals targets |

---

## Integration & Provider Configuration

| Document | Description |
|----------|-------------|
| [PAYMENT_PROVIDER.md](./PAYMENT_PROVIDER.md) | Razorpay/Stripe configuration |
| [SEARCH_PROVIDER.md](./SEARCH_PROVIDER.md) | Search provider configuration |
| [EMAIL_PROVIDER.md](./EMAIL_PROVIDER.md) | Email provider configuration |
| [SMS_PROVIDER.md](./SMS_PROVIDER.md) | SMS provider configuration |
| [PUSH_PROVIDER.md](./PUSH_PROVIDER.md) | Push notification provider |
| [STORAGE_PROVIDER.md](./STORAGE_PROVIDER.md) | Cloud storage configuration |
| [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) | Third-party integration guide |

---

## Handoff & Progress

| Document | Description |
|----------|-------------|
| [HANDOFF.md](./HANDOFF.md) | Complete engineering handoff document (72KB) |
| [PROGRESS.md](./PROGRESS.md) | Development progress tracker (96KB) |
| [PRELAUNCH_ROADMAP.md](./PRELAUNCH_ROADMAP.md) | Pre-launch roadmap |

---

**Total documented architecture files**: 143 documents

*AuraMart Commerce OS v2.0.0-rc.1 | RELEASE-002 | 2026-08-08*
