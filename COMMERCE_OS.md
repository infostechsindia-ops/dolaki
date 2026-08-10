# COMMERCE_OS.md

## Industry-Grade Product & Antigravity Execution Standard

**Scope:** E-commerce + Quick-commerce customer website, customer
Android/iOS app, quick-commerce merchant Android app, marketplace vendor
web panel, quick-commerce merchant web panel, and super-admin web panel.

**Status:** Source of truth\
**Execution rule:** Antigravity must read this file before every
implementation task.

------------------------------------------------------------------------

# 1. PRODUCT BOUNDARY

Build one commerce platform with two fulfillment businesses:

### A. Marketplace E-commerce

Customer → Catalog → Vendor → Marketplace order → Shipment → Customer

### B. Quick-commerce

Customer → Location/serviceability → Nearby store/dark store → Live
inventory → Picking → Rider → Customer

They share identity, catalog primitives, cart/checkout infrastructure,
payment primitives, promotions, loyalty, notifications, support and
analytics where appropriate. They do **not** share a simplistic
fulfillment state machine.

## Required product surfaces

### Customer

-   Responsive customer website
-   Expo/React Native mobile application for Android + iOS
-   Both support marketplace and quick-commerce

### Marketplace vendor

-   Web panel only

### Quick-commerce merchant

-   Web operations panel
-   Dedicated merchant Android application for real-time store/order
    operations

### Platform operations

-   Super-admin web panel only

### Backend

-   One authoritative backend/domain layer
-   One database truth
-   Versioned typed API contracts
-   Event-driven side effects where appropriate

------------------------------------------------------------------------

# 2. NON-NEGOTIABLE AI/ANTIGRAVITY RULES

Every Antigravity session MUST: 1. Read `COMMERCE_OS.md`, `TASK.md`,
relevant `AGENTS.md`, `CLAUDE.md`, ADRs and current handoff. 2. Inspect
existing implementation before creating files. 3. Search all consumers
before changing an API/schema/type. 4. State the exact task and
acceptance criteria before editing. 5. Change only the named
domain/feature plus required shared contracts. 6. Reuse existing
design-system primitives. 7. Never silently remove a working feature. 8.
Never invent product behavior because a screen looks incomplete. 9.
Never use mock success in production. 10. Never hard-code localhost,
credentials, tokens, IDs, prices, stock, balances or business truth. 11.
Never calculate authoritative price, discount, tax, fee, inventory,
wallet, refund, settlement or legal order state in clients. 12. Never
authorize by UI visibility. Backend guards are mandatory. 13. Never
allow a vendor/merchant/customer to access another owner's resource by
changing an ID. 14. Never change architecture/provider/database/mobile
stack without an ADR and explicit approval. 15. Never perform unrelated
redesign/refactoring. 16. Every screen requires loading, skeleton where
useful, empty, error, offline/retry and success states. 17. Every
mutation requires pending, idempotency where needed, failure recovery
and double-submit prevention. 18. Every financial mutation must be
auditable. 19. Every user-visible time-sensitive claim (stock, ETA,
offer expiry) must come from authoritative data. 20. Do not mark DONE
until lint, typecheck, tests and affected production builds pass. 21.
Update progress/handoff after every completed task. 22. If
implementation conflicts with this file, STOP and report the conflict.

------------------------------------------------------------------------

# 3. REQUIRED ANTIGRAVITY TASK PROTOCOL

For **every** command below, Antigravity must execute:

**DISCOVER → PLAN → CONTRACT → IMPLEMENT → INTEGRATE → TEST → REVIEW →
DOCUMENT**

Before editing, output: - repository evidence - existing
implementation - gaps - files/modules affected - API/schema impact -
migration/security risks - exact acceptance tests

After editing, output: - changed files - API/schema/migration changes -
tests/build results - manual verification - remaining risks -
no-unrelated-change confirmation

Do not automatically continue to the next command.

------------------------------------------------------------------------

# 4. TARGET DOMAIN ARCHITECTURE

Backend domains:

`identity` `customers` `addresses` `catalog` `products` `variants`
`categories` `brands` `pricing` `inventory` `locations` `serviceability`
`search` `recommendations` `cart` `checkout` `orders` `fulfillment`
`shipping` `quick-delivery` `riders` `payments` `refunds` `returns`
`promotions` `wallet` `loyalty` `vendors` `merchants` `settlements`
`payouts` `reviews` `support` `notifications` `cms` `analytics` `risk`
`audit` `admin`

Recommended order model:

``` text
Checkout
  ↓
Order
  ├── Fulfillment Group: Vendor A / Marketplace
  ├── Fulfillment Group: Vendor B / Marketplace
  └── Fulfillment Group: Quick Store / Instant Delivery
```

Never make the customer understand internal complexity unnecessarily.

------------------------------------------------------------------------

# 5. PHASE 0 --- REPOSITORY CONTROL

## CMD-001 --- Feature parity matrix

**Prompt** Audit the complete repository without changing production
code. Create `docs/FEATURE_PARITY.md`. Rows: auth, onboarding, location,
home, search, categories, PLP, PDP, wishlist, cart, checkout, payment,
orders, tracking, cancellation, return, refund, addresses, wallet,
loyalty, coupons/promotions, reviews, notifications, support, vendor
catalog, vendor inventory, vendor orders, settlements, merchant store,
merchant inventory, merchant order queue, picking, rider, admin catalog,
admin operations, finance, CMS, analytics, audit. Columns: Backend,
Customer Web, Customer Mobile, Vendor Web, Merchant Web, Merchant
Android, Super Admin. Mark REAL/PARTIAL/MOCK/MISSING/N/A with exact
source evidence. Do not guess.

## CMD-002 --- Architecture map

Create `docs/ARCHITECTURE.md` from actual repository evidence. Document
clients, backend modules, DB entities, external integrations, auth
boundaries, API base paths, data flows and duplicated business logic.
Include current-state and target-state diagrams. Do not refactor code.

## CMD-003 --- Remove environment drift

Find all hard-coded hosts, localhost URLs, ports and
environment-specific values. Centralize environment configuration for
customer web, Expo customer mobile, vendor web, merchant web/app and
admin. Add safe `.env.example`. Production must fail safely when
required configuration is absent.

## CMD-004 --- Production mock eradication

Find fake JWTs, mock successful orders, fake wallet/credit transactions,
random order IDs, mock API fallback data, simulated stock/ETA/watchers
and failure-to-success code. Remove production fallback. Development
fixtures must require an explicit development-only feature flag.

------------------------------------------------------------------------

# 6. PLATFORM SECURITY & CONTRACTS

## CMD-005 --- Authentication

Implement production authentication: OTP/password/provider policy as
already selected by product; OTP expiry, resend cooldown, attempt
limits, rate limiting; refresh-token rotation/revocation;
logout-all-sessions; device/session list; secure token storage. Never
return/log OTP or token secrets.

## CMD-006 --- RBAC/ABAC

Implement centralized roles and ownership policy for CUSTOMER,
VENDOR_OWNER, VENDOR_STAFF, MERCHANT_OWNER, MERCHANT_MANAGER,
MERCHANT_PICKER, RIDER, SUPPORT, OPERATIONS, FINANCE, CATALOG_ADMIN,
SUPER_ADMIN. Protect every private endpoint. Add cross-tenant
authorization tests.

## CMD-007 --- API contract standard

Version API under `/api/v1`. Replace untyped bodies/queries with
validated DTOs. Standardize errors, pagination, filtering, sorting,
money, dates and IDs. Produce OpenAPI and generated/shared typed
clients. Update all consumers atomically when contracts change.

## CMD-008 --- Audit logging

Create immutable audit events for admin/vendor/merchant changes to
prices, stock, orders, refunds, settlements, credit, permissions,
configuration and CMS. Record actor, resource, before/after safe diff,
reason, timestamp and correlation ID.

## CMD-009 --- Idempotency

Implement idempotency keys for checkout commit, payment
creation/capture, refunds, wallet financial mutations, merchant order
acceptance and other retry-sensitive operations. Add replay/concurrency
tests.

------------------------------------------------------------------------

# 7. CATALOG & INVENTORY FOUNDATION

## CMD-010 --- Product/SKU model

Normalize Product, Variant/SKU, attributes/options, media, brand,
category, seller offer, identifiers, dimensions, tax class, status and
moderation. Preserve historical order snapshots.

## CMD-011 --- Category taxonomy

Build hierarchical categories with slug, parent, path, status, SEO
metadata, attributes/facets and category-specific filters. Prevent
circular hierarchy and orphaned active products.

## CMD-012 --- Inventory locations

Create inventory locations for vendor warehouses, merchant stores and
dark stores. Track on-hand, reserved, available, damaged and safety
stock per SKU/location.

## CMD-013 --- Atomic reservation

Implement stock reservation TTL and atomic commit/release. Checkout must
never trust client stock. Add concurrency test for two buyers attempting
the final unit.

## CMD-014 --- Price engine

Centralize base price, sale price, vendor offer, location price, taxes,
fees and effective-price calculation. Use decimal-safe/minor-unit money.
Return calculation breakdown and rule identifiers.

------------------------------------------------------------------------

# 8. CUSTOMER WEBSITE --- GLOBAL UX

## CMD-015 --- Web design system

Create/normalize design tokens and accessible primitives: typography,
spacing, semantic colors, radius, elevation, Button, Input, Search,
Select, Checkbox, Radio, Chip, Badge, Tabs, Card, ProductCard, Modal,
Drawer, Toast, Skeleton, EmptyState, ErrorState, Pagination. Preserve
brand identity; remove inconsistent one-off patterns.

## CMD-016 --- Responsive shell

Build a responsive application shell with desktop/tablet/mobile
breakpoints, accessible landmarks, consistent max widths, sticky
behavior and no horizontal overflow.

## CMD-017 --- Header

Implement location/serviceability selector, logo, prominent
search/autocomplete, categories, account, orders, wishlist and cart
count. Compact sticky state on scroll. Keyboard-accessible desktop
navigation.

## CMD-018 --- Mobile web navigation

Implement mobile header plus bottom navigation for Home,
Categories/Search, Quick, Orders and Account/Cart based on UX testing.
Avoid duplicating actions unnecessarily.

## CMD-019 --- Footer

Create useful footer: help, policies, account links, categories,
seller/merchant links, app links, payment/trust information, social
links if configured and crawlable internal links. CMS-manage appropriate
content.

------------------------------------------------------------------------

# 9. CUSTOMER WEBSITE --- HOME

## CMD-020 --- Home composition

Implement CMS/SDUI-controlled home ordering with: 1
serviceability/announcement strip, 2 search/location header, 3 campaign
hero, 4 Quick-commerce entry, 5 category grid, 6 personalized/recent
module, 7 flash deals, 8 best sellers, 9 recommendations, 10 brand
spotlight, 11 value/price collections, 12 new launches, 13 trending, 14
trust benefits, 15 recently viewed, 16 loyalty/referral/app promotion,
17 editorial/SEO content. Every section needs loading/empty behavior,
impression/click analytics and visibility/scheduling.

## CMD-021 --- Hero campaigns

Create responsive hero/banner component with CMS scheduling, deep links,
audience/location targeting, image variants, accessibility, safe text
overlay and analytics. Do not rotate too quickly or create CLS.

## CMD-022 --- Category discovery

Build visually consistent category tiles with responsive density,
image/icon, name, hover/press feedback, tracking and CMS ordering.

## CMD-023 --- Deal sections

Build deal rows/grids backed by real campaign eligibility and
authoritative end time. Never fabricate urgency, viewers, stock or
countdowns.

## CMD-024 --- Personalized home

Create API-driven recently viewed, continue shopping, reorder and
recommendations with safe fallbacks to non-personalized real catalog
content. Never block home when personalization is unavailable.

## CMD-025 --- Home performance

Optimize server/client boundaries, image sizing, lazy loading, caching
and below-fold code. Establish LCP/INP/CLS budgets and measure
before/after.

------------------------------------------------------------------------

# 10. SEARCH & DISCOVERY

## CMD-026 --- Search backend

Create search abstraction supporting autocomplete, typo tolerance,
prefix matching, product/category/brand suggestions, facets, sorting,
pagination and ranking. Instrument query/result/click/conversion
analytics.

## CMD-027 --- Search UI

Implement debounced autosuggest, recent searches, trending searches,
query suggestions, keyboard navigation, clear history, loading and
failure states.

## CMD-028 --- Search results

Create production PLP search results with facets, active chips, sort,
result count, pagination/infinite strategy, zero-result recovery and
query persistence in URL.

## CMD-029 --- Zero results

Suggest spelling, categories, popular searches and relevant alternatives
based on real data. Never show unrelated fake products disguised as
results.

------------------------------------------------------------------------

# 11. CATEGORY / PLP

## CMD-030 --- Category landing

Build category title, breadcrumb, SEO description, subcategory
navigation, editorial/CMS hero and curated modules while catalog
products remain search/catalog driven.

## CMD-031 --- Faceted PLP

Implement backend-generated filters such as brand, price, rating,
availability, attributes, seller and delivery type. Persist filter/sort
state in URL. Mobile uses accessible filter drawer/sheet.

## CMD-032 --- Product card

Standardize card across home/category/search: media, brand/title,
rating, current/previous price, discount, unit price, stock/delivery
badge, seller/store context, wishlist and quick-add. Support marketplace
and Quick modes without duplicating component logic.

## CMD-033 --- PLP quick add

Allow safe quick-add for simple products; require variant selection when
necessary. Validate current stock/price server-side and show recoverable
errors.

------------------------------------------------------------------------

# 12. PRODUCT DETAIL PAGE

## CMD-034 --- PDP information architecture

Implement media gallery/video, brand/title, rating, pricing, variants,
stock, delivery/serviceability, seller/store, offers, quantity, Add to
Cart/Buy Now, wishlist/share, highlights, specifications, description,
warranty, return policy, reviews, Q&A, related and recently viewed.

## CMD-035 --- Variant experience

Update image, price, stock, SKU and delivery when variant changes.
Disable impossible combinations. Revalidate before cart mutation.

## CMD-036 --- Delivery promise

Use address/location + fulfillment source to show truthful delivery
range, shipping cost/free threshold and availability. Quick-commerce
uses store serviceability and ETA service.

## CMD-037 --- Reviews

Implement verified-purchase reviews, media, helpful votes,
moderation/reporting, rating aggregation and vendor response.

## CMD-038 --- PDP mobile web

Create sticky mobile purchase bar, touch-friendly media/variants and
progressive disclosure for long content without hiding critical
policies.

------------------------------------------------------------------------

# 13. CART & CHECKOUT

## CMD-039 --- Authoritative cart

Authenticated cart lives server-side; guest cart may live locally and
merges on login. Cart item references SKU + fulfillment source.
Revalidate price/stock/promotions whenever necessary.

## CMD-040 --- Cart UX

Group by fulfillment/seller/store, show quantity, variant, stock issues,
save/remove, delivery estimate, promotion result, subtotal, fees,
savings and clear checkout CTA.

## CMD-041 --- Quick cart

Add minimum basket, delivery fee, ETA, store availability, substitution
preferences and unavailable-item resolution.

## CMD-042 --- Checkout preview

Create backend preview that calculates inventory, price, promotions,
tax, fees, fulfillment, delivery options and payable amount. Return
explainable breakdown and blocking issues.

## CMD-043 --- Checkout UX

Progressive checkout: address → delivery → payment → review/place order.
Preserve data after recoverable failure. Prevent duplicate submission.

## CMD-044 --- Address UX

Support saved addresses, labels, default, validation and map
pin/coordinates where quick-commerce requires precision. Do not assume
coordinates from text alone.

------------------------------------------------------------------------

# 14. PAYMENT, ORDER, RETURN & REFUND

## CMD-045 --- Payment orchestration

Create provider-neutral payment intent/attempt layer, COD eligibility,
secure provider SDK integration, webhook signature validation,
reconciliation, timeout/retry and state machine. Never store raw
CVV/card data.

## CMD-046 --- Order creation

Server creates order IDs and immutable order-item commercial snapshots.
One checkout can create multiple fulfillment groups. Purchase event
fires exactly once.

## CMD-047 --- Order history

Create filters/search, status summary, product thumbnails, reorder,
invoice, support and fulfillment-aware status.

## CMD-048 --- Tracking

Marketplace timeline uses shipment events. Quick timeline uses accepted
→ picking → packed → rider assigned → picked up → near customer →
delivered. Never simulate state.

## CMD-049 --- Cancellation

Policy engine decides cancellable items/quantities and refund
consequences based on fulfillment/payment state. Customer sees reason
and expected refund.

## CMD-050 --- Return/replacement

Implement item-level reasons, evidence, pickup/dropoff, QC,
replacement/refund choice, status timeline and policy window.

## CMD-051 --- Refund

Create Refund/RefundItem/RefundAttempt records with amount calculation,
destination, provider reference, reconciliation and customer timeline.

------------------------------------------------------------------------

# 15. QUICK-COMMERCE CUSTOMER EXPERIENCE

## CMD-052 --- Serviceability

Use customer coordinates/address against approved/open store/dark-store
service areas, inventory, capacity and policy. Return reason when
unavailable and next opening where known.

## CMD-053 --- Quick home

Build location-first Quick home: delivery promise, search, categories,
frequently bought/reorder, offers, popular nearby, essentials, brands
and personalized modules. Only show serviceable assortment.

## CMD-054 --- Quick catalog

Rank by availability, proximity/fulfillment suitability, relevance and
merchandising rules. Never show unavailable store inventory as
immediately deliverable.

## CMD-055 --- ETA engine

Compute ETA range from picking queue, preparation, rider
supply/assignment, travel estimate and buffer. Recalculate at milestones
and expose confidence/source internally.

## CMD-056 --- Substitution

Support per-order/item: no substitution, best match, contact me.
Merchant can propose substitute; price difference/refund/payment
adjustment is auditable.

## CMD-057 --- Quick fees

Centralize delivery, surge/capacity, small-order, handling and
promotional fee policy. Show fees before final place-order step and
explain them.

## CMD-058 --- Quick reorder

Implement previous-basket reorder by re-resolving current serviceable
store, inventory, price and substitutes; never blindly recreate old
items.

------------------------------------------------------------------------

# 16. CUSTOMER MOBILE APP --- EXPO ANDROID + IOS

## CMD-059 --- Canonical customer mobile

Make Expo/React Native the canonical customer mobile app unless an
approved ADR states otherwise. Freeze duplicate native Android customer
feature development. Produce migration inventory before removing any
existing native capability.

## CMD-060 --- Mobile foundation

Implement typed API layer, auth/session, secure token storage,
server-state/query caching, retry policy, connectivity state, error
boundary, deep-link router, analytics and environment configuration.
Remove production mock fallbacks.

## CMD-061 --- Mobile app shell

Build splash/session restoration, onboarding only when needed, location
permission flow, authenticated/guest navigation and bottom tabs. Avoid
blocking users with unnecessary permissions.

## CMD-062 --- Mobile home

Implement performant native home with location/search, hero, Quick
entry, categories, deals, personalized modules, brands, recommendations
and recently viewed. Use virtualized lists and image caching.

## CMD-063 --- Mobile search

Implement autocomplete, recent/trending searches, keyboard behavior,
voice-search integration point if supported, results, filter sheet and
sort sheet.

## CMD-064 --- Mobile PLP

Implement virtualized product list/grid, filter/sort, quick-add,
wishlist, pagination, retry and persistent cart affordance.

## CMD-065 --- Mobile PDP

Implement swipe gallery, variants, price, serviceability, offers,
seller/store, reviews and sticky Add to Cart/Buy Now.

## CMD-066 --- Mobile cart

Implement marketplace/Quick grouping, quantity, save/remove, stock
recovery, promotions, fees, substitution and checkout CTA.

## CMD-067 --- Mobile checkout

Implement address/map, delivery option/instructions, payment, review,
authoritative preview/commit and failure recovery.

## CMD-068 --- Mobile orders

Implement order list/detail, marketplace shipment timeline, Quick live
status, cancel/return/refund/support and reorder.

## CMD-069 --- Mobile push

Register devices securely, preferences, push token lifecycle and deep
links for product, category, order, refund, promotion and Quick
delivery.

## CMD-070 --- Mobile location

Implement permission rationale, current-location option, map pin
correction, saved addresses, background-location avoidance unless truly
required and serviceability refresh on material location change.

## CMD-071 --- Mobile offline behavior

Cache safe read data, clearly mark stale content, queue only safe
non-financial actions if policy permits, and never fake
checkout/payment/order success offline.

## CMD-072 --- Mobile performance

Measure cold/warm startup, JS bundle, list FPS, memory, image cache,
navigation latency and API waterfalls. Fix measurable bottlenecks before
cosmetic micro-optimization.

------------------------------------------------------------------------

# 17. MARKETPLACE VENDOR WEB PANEL

## CMD-073 --- Vendor dashboard

Build actionable dashboard: sales, orders requiring action, low stock,
returns, settlement due, top products and policy/account alerts. Metrics
must have defined time ranges.

## CMD-074 --- Vendor onboarding

Implement business profile, KYC/tax/bank information as applicable,
agreements, verification states, rejection reasons and resubmission.
Sensitive documents require secure storage/access.

## CMD-075 --- Vendor catalog

Create product list, draft/create/edit, variants, media, attributes,
category requirements, moderation status and bulk import/export.

## CMD-076 --- Vendor inventory

Manage SKU/location stock, low-stock threshold, bulk update, inventory
history and reservation visibility without permitting direct
manipulation of reserved quantities.

## CMD-077 --- Vendor pricing

Manage offers/prices within marketplace rules, scheduled sale price and
promotion participation. Server validates impossible/unsafe values.

## CMD-078 --- Vendor orders

Provide new/confirmed/processing/ready/shipped/delivered/cancelled
flows, item detail, packing/invoice/label integration point and SLA
alerts. Enforce legal transitions server-side.

## CMD-079 --- Vendor returns

Show return request, evidence, policy, logistics/QC result,
dispute/escalation and financial impact.

## CMD-080 --- Vendor settlements

Show order earnings, commissions, taxes/fees, refunds, adjustments,
settlement periods, payout status and downloadable statements. Ledger
must reconcile to backend finance truth.

## CMD-081 --- Vendor analytics

Provide sales, conversion where data is legitimately available, product
performance, returns, cancellations, stockouts and fulfillment SLA.
Avoid vanity metrics without definitions.

## CMD-082 --- Vendor staff

Add owner-managed staff roles/permissions and audit history. Least
privilege by default.

------------------------------------------------------------------------

# 18. QUICK-COMMERCE MERCHANT WEB PANEL

## CMD-083 --- Merchant operations dashboard

Create real-time dashboard: store open/closed, new orders, picking
queue, SLA risk, rider status, stockouts, cancellations, daily sales and
operational alerts.

## CMD-084 --- Store configuration

Manage approved store profile, hours, holiday hours, service area, order
capacity, minimum basket, prep settings and contact data. Critical
changes may require admin approval.

## CMD-085 --- Merchant assortment

Manage allowed catalog assortment, local price/availability, SKU mapping
and store-specific status while preserving platform catalog governance.

## CMD-086 --- Merchant inventory

Provide fast stock update, bulk update, low stock, stockout,
receiving/adjustment reasons and history. Inventory adjustments require
actor/reason audit.

## CMD-087 --- Merchant order board

Build real-time columns/queues: New → Accepted → Picking → Packed →
Rider Assigned → Handed Over → Completed, plus exceptions. Backend
controls legal transitions and SLA timers.

## CMD-088 --- Picking workflow

Generate optimized pick list by aisle/category where data exists;
support found/not found, quantity adjustment, substitution and pack
confirmation.

## CMD-089 --- Rider handoff

Verify rider/order at pickup, record handoff time, package count and
exception. Merchant must not manually fake delivered state.

## CMD-090 --- Merchant reports

Daily/weekly sales, fill rate, stockout rate, substitution rate,
cancellation reasons, average pick time, SLA breaches and settlement
view.

## CMD-091 --- Merchant staff

Roles for owner, manager, picker and finance/read-only as needed. Store
ownership and staff scope enforced server-side.

------------------------------------------------------------------------

# 19. QUICK-COMMERCE MERCHANT ANDROID APP

## CMD-092 --- Merchant Android architecture

Create a dedicated merchant operations Android application. Prefer
Expo/React Native only if required scanner/background/real-time
capabilities are validated; otherwise document native requirement in
ADR. It must be a separate app identity/navigation from customer app.

## CMD-093 --- Merchant authentication

Implement merchant/staff login, store assignment, role-scoped
navigation, secure token storage, session expiry and device
registration.

## CMD-094 --- Merchant live order queue

Create high-visibility New/At Risk/Picking/Packed queues with real-time
update transport, sound/vibration policy, acknowledgement and reconnect
behavior.

## CMD-095 --- Merchant accept/reject

Implement idempotent accept/reject with server SLA, capacity/inventory
validation and mandatory reason for rejection. Prevent duplicate
actions.

## CMD-096 --- Merchant picking

Create touch-optimized pick workflow, item image/name/SKU/quantity,
found/not-found, substitution, scan hook, progress and pack completion.

## CMD-097 --- Merchant barcode scan

Add barcode/QR scanning only against authoritative SKU/order data.
Handle unknown/duplicate scan and permission denial safely.

## CMD-098 --- Merchant inventory quick update

Provide search/scan SKU, in-stock/out-of-stock, quantity adjustment and
reason. Sync conflict must be surfaced, not silently overwritten.

## CMD-099 --- Merchant notifications

Implement reliable push/local notification behavior for new order, SLA
risk, cancellation, rider arrival and operational alerts. Respect
role/store scope.

## CMD-100 --- Merchant offline/reconnect

Allow safe read cache and draft picking progress where conflict
resolution is defined. Never finalize financial/order state without
server acknowledgement.

------------------------------------------------------------------------

# 20. SUPER ADMIN WEB PANEL

## CMD-101 --- Admin information architecture

Navigation: Command Center, Orders, Quick Operations, Catalog, Vendors,
Merchants, Customers, Delivery/Riders, Marketing, Finance, Support, CMS,
Analytics, Risk/Audit, Configuration.

## CMD-102 --- Admin command center

Show actionable operational KPIs and alerts: GMV/orders, payment
failures, Quick SLA breaches, stock incidents, vendor/merchant
approvals, return/refund backlog and system/provider health. Each widget
deep-links to filtered work queue.

## CMD-103 --- Admin catalog governance

Manage categories, brands, attributes, products, moderation, duplicates
and bulk actions. Keep seller offer/inventory separate from canonical
product identity.

## CMD-104 --- Vendor management

Onboard/approve/suspend vendors, review KYC, commissions, policy
violations, performance, staff and settlement holds with reason/audit.

## CMD-105 --- Merchant management

Approve/suspend stores, service areas, operating status, capacity,
assortment policy, SLA performance and settlement controls.

## CMD-106 --- Global order operations

Search/filter all orders and fulfillment groups; inspect timeline,
payment, shipment, Quick delivery, support and audit. Admin override
requires permission + reason and cannot violate financial invariants.

## CMD-107 --- Refund console

Work queue for pending/manual refunds, evidence, provider status,
retries, partial refunds and reconciliation. Prevent duplicate refund.

## CMD-108 --- Finance

Provide payment reconciliation, commissions, vendor/merchant
settlements, payouts, refunds, wallet/loyalty liabilities, adjustments
and downloadable statements.

## CMD-109 --- Promotion manager

Create automatic/coupon promotions with eligibility, funding, stacking,
budgets, limits, schedule, location/channel and preview/test simulator
before publish.

## CMD-110 --- CMS

Draft/preview/publish/schedule/rollback home/category/editorial blocks
with schema validation, audience/location targeting and web/mobile
compatibility status.

## CMD-111 --- Customer support

Unified ticket/order/customer context, internal notes, assignment, SLA,
macros, attachments and escalation. Sensitive actions permission-gated
and audited.

## CMD-112 --- Risk & fraud

Surface coupon abuse, COD risk, suspicious refunds, payment failures,
account/device anomalies and merchant/vendor anomalies as explainable
risk signals. Avoid automatic irreversible action without explicit
policy.

## CMD-113 --- Audit viewer

Search audit logs by actor, resource, action, date and correlation ID.
Logs are read-only.

## CMD-114 --- Admin roles

Create least-privilege permission sets for support, operations, catalog,
marketing, finance and super-admin. Test privilege escalation paths.

------------------------------------------------------------------------

# 21. PROMOTIONS, LOYALTY & RETENTION

## CMD-115 --- Promotion engine

Support percentage/fixed, BOGO, bundle, category/brand/SKU, new user,
minimum basket, max discount, user/global limits, vendor/merchant
funding, channel/location, payment method and deterministic stacking.

## CMD-116 --- Loyalty

Separate loyalty points from real-money wallet. Implement earn, pending,
available, redeemed, expired and reversed ledger states.

## CMD-117 --- Wallet

If real-money wallet exists, use immutable ledger, balance derivation,
provider/legal requirements, idempotent credit/debit/reversal and
finance reconciliation.

## CMD-118 --- Referral

Implement anti-abuse referral lifecycle, qualification event, reward
pending/approved/reversed and transparent terms.

## CMD-119 --- Reorder

Create intelligent reorder from previous order while revalidating
current SKU, variant, seller/store, price, stock and serviceability.

------------------------------------------------------------------------

# 22. NOTIFICATIONS & COMMUNICATION

## CMD-120 --- Notification platform

Backend event-driven templates for in-app, push, email, SMS/WhatsApp
adapters where configured. Add preferences, localization, deduplication
and delivery status.

## CMD-121 --- Transactional events

Define canonical events for auth/security, order, payment, shipment,
Quick delivery, cancellation, return, refund, settlement and support.
Clients never independently invent transactional status.

## CMD-122 --- In-app inbox

Create paginated inbox, read/unread, category, deep link and retention
policy across web/mobile where applicable.

------------------------------------------------------------------------

# 23. ANALYTICS & EXPERIMENTATION

## CMD-123 --- Event taxonomy

Create `docs/ANALYTICS.md` defining view_item_list, select_item,
view_item, search, add/remove cart, begin_checkout, payment, purchase,
refund, wishlist, promotion impression/click, serviceability, Quick
store, substitution and fulfillment events. Define required properties
and PII restrictions.

## CMD-124 --- Funnel dashboards

Define measurable funnels: Home→PLP→PDP→Cart→Checkout→Purchase;
Search→Purchase; Quick serviceability→Purchase; vendor fulfillment;
merchant pick SLA. Ensure event semantics are consistent across
web/mobile.

## CMD-125 --- Experiment framework

Add controlled feature/experiment assignment with stable IDs, exposure
events, guardrail metrics and kill switch. Never ship visual A/B tests
without measurement.

------------------------------------------------------------------------

# 24. PERFORMANCE, RELIABILITY & OBSERVABILITY

## CMD-126 --- Web performance budget

Define LCP/INP/CLS, JS, image and API budgets. Add bundle analysis and
route measurements. Fix high-impact bottlenecks first.

## CMD-127 --- Mobile performance budget

Measure startup, navigation, list FPS, memory, image loading and network
waterfalls on representative low/mid devices.

## CMD-128 --- Backend observability

Structured logs, correlation/request IDs, traces/metrics where stack
permits, latency, error rate, queue/provider health and domain failure
metrics. Never log secrets.

## CMD-129 --- Health/readiness

Create liveness/readiness and dependency health for
DB/cache/queues/providers with safe public/internal exposure.

## CMD-130 --- Graceful degradation

Define behavior for search outage, recommendation outage, notification
outage, payment-provider issue and map/ETA issue. Checkout/payment
integrity takes precedence over fake availability.

------------------------------------------------------------------------

# 25. SEO, ACCESSIBILITY & QUALITY

## CMD-131 --- SEO

Metadata templates, canonical URLs, sitemap, robots,
Product/Breadcrumb/Organization structured data, crawlable
categories/brands, internal links and filter canonical policy.

## CMD-132 --- Accessibility

Audit WCAG 2.2 AA fundamentals on web and mobile equivalents: semantics,
keyboard, focus, labels, contrast, reduced motion, touch targets and
validation errors.

## CMD-133 --- Localization

Make strings localizable, use locale-safe date/number/currency
formatting and support RTL architecture if target markets require it.
Never concatenate translatable sentences from fragments.

## CMD-134 --- Error language

Create consistent human-readable errors with recovery actions. Do not
expose stack traces/database/provider internals.

------------------------------------------------------------------------

# 26. TESTING & RELEASE ENGINEERING

## CMD-135 --- Unit tests

Test pricing, promotions, inventory reservations, state machines, fee
policy, refund calculations and authorization helpers.

## CMD-136 --- API integration tests

Test auth, tenant isolation, cart, checkout, payment webhook, order,
cancellation, return/refund, vendor operations and merchant operations
against test DB.

## CMD-137 --- Contract tests

Ensure generated/shared contracts match backend and critical clients do
not silently drift.

## CMD-138 --- Customer E2E

Automate
login/browse/search/PDP/cart/checkout/order/tracking/cancel/return for
customer web and canonical mobile critical paths.

## CMD-139 --- Quick E2E

Automate location/serviceability → Quick catalog → cart → checkout →
merchant acceptance → picking → rider/handoff states → delivered/refund
exception.

## CMD-140 --- Vendor/admin E2E

Automate vendor product/inventory/order and admin
approval/refund/settlement critical workflows.

## CMD-141 --- CI

Locked install, format check, lint, typecheck, unit/integration tests,
migrations and production builds. No merge on failed quality gates.

## CMD-142 --- Release environments

Formalize local/dev/staging/production, environment secrets, migration
procedure, feature flags, rollback and smoke tests. Never test risky
migrations first in production.

------------------------------------------------------------------------

# 27. INDUSTRY-LEVEL UX TECHNIQUES

These are principles, not decorative requests:

1.  **Progressive disclosure:** show the decision needed now; secondary
    detail later.
2.  **Recognition over recall:** recent search, saved address, reorder,
    persistent filters.
3.  **Optimistic UI only when reversible:** wishlist is suitable;
    payment/order success is not.
4.  **Skeletons for predictable layouts:** avoid spinner-only screens
    for catalog.
5.  **Stable layout:** reserve image/content dimensions to prevent
    visual jumps.
6.  **Clear price hierarchy:** payable price \> previous price \>
    discount/savings.
7.  **Truthful urgency:** only real stock/campaign/ETA data.
8.  **Error recovery:** tell user what failed and what can be done next.
9.  **Preserve work:** failed checkout must not wipe
    address/cart/instructions.
10. **One primary CTA per decision area.**
11. **Touch target discipline:** mobile actions must be comfortably
    tappable.
12. **Fast perceived response:** immediate pressed/loading feedback;
    cache safe reads.
13. **Contextual support:** support entry from the affected
    order/payment/refund.
14. **Operational UX:** admin/vendor/merchant screens optimize speed,
    scanning and exception handling---not marketing aesthetics.
15. **Exception-first operations:** surface SLA risk, stockout, payment
    failure and blocked tasks above vanity charts.
16. **Consistent state language:** same status names and meanings across
    backend and clients.
17. **No dead ends:** empty search/cart/orders/wishlist includes a
    relevant next action.
18. **Explain fees and restrictions before commitment.**
19. **Accessibility is a release criterion.**
20. **Measure behavior:** important UX changes need analytics events and
    success metrics.

------------------------------------------------------------------------

# 28. DEFINITION OF DONE

A command is DONE only when: - repository evidence was inspected
first; - acceptance behavior works with real API/data; -
authorization/ownership is enforced; -
loading/empty/error/offline/success states are handled where relevant; -
money/stock/order truth is server-authoritative; - API changes update
all affected consumers; - migrations are safe and documented; -
analytics are added for important user behavior; - accessibility is
checked; - lint/typecheck/tests/build pass; - no unrelated feature was
changed; - documentation/handoff/progress is updated.

------------------------------------------------------------------------

# 29. MASTER START PROMPT FOR ANTIGRAVITY

Paste this once at the start of a session:

Read `COMMERCE_OS.md`, `TASK.md`, all relevant `AGENTS.md`, `CLAUDE.md`,
ADRs, `docs/FEATURE_PARITY.md` and `docs/HANDOFF.md` before editing.
Treat `COMMERCE_OS.md` as the product and engineering constitution. Work
only on the command I name. First inspect the existing implementation
and report repository evidence, current behavior, exact gap, affected
files/modules, API/schema impact, security/migration risks and
acceptance tests. Then implement the smallest coherent production-grade
change. Do not redesign unrelated areas, introduce mock success,
hard-code environment values, duplicate backend business rules in
clients, weaken authorization, or change strategic architecture without
an approved ADR. Run verification for every affected package. Stop after
this command, update progress/handoff, and wait for my approval before
starting another command.

------------------------------------------------------------------------

# 30. STRICT SINGLE-FEATURE PROMPT WRAPPER

Use this before any command:

Execute **\[COMMAND ID AND NAME\]** from `COMMERCE_OS.md`.

Strict boundaries: - Read current code before editing. - Do not
implement future commands. - Do not redesign unrelated screens. -
Preserve compatible existing behavior. - Backend is authoritative for
business/financial state. - Update every affected API consumer in the
same task. - Add/modify tests for the behavior. - Verify lint +
typecheck + tests + affected production build. - Report any conflict
instead of inventing a workaround. - Stop when this command's acceptance
criteria are met.

------------------------------------------------------------------------

# 31. DRIFT RECOVERY PROMPT

Stop coding. Re-read `COMMERCE_OS.md` and the exact command being
executed. Compare every uncommitted change to that command's acceptance
criteria. Identify unrelated changes and revert/exclude them. Identify
duplicated architecture, mock behavior, client-side business truth,
weakened authorization or undocumented strategic decisions. Continue
only after the diff is reduced to changes necessary for the current
command.

------------------------------------------------------------------------

# 32. BUG-FIX PROMPT

Investigate **\[BUG\]** without immediately rewriting the feature.
Reproduce or trace it, identify root cause, affected surfaces and
regression risk. Fix the smallest correct layer---prefer backend/domain
correction when multiple clients share the failure. Add a regression
test. Do not mask the bug with fake fallback data or catch-and-ignore
behavior. Verify all consumers affected by the root cause.

------------------------------------------------------------------------

# 33. UI/UX REVIEW PROMPT

Audit **\[SCREEN/SECTION\]** using existing design system and real
product behavior. Evaluate hierarchy, primary task, information density,
responsiveness, accessibility, loading/empty/error states, trust,
conversion friction, touch/keyboard behavior, performance and analytics.
Cite exact existing components/files. Propose only changes tied to
measurable user/operations outcomes. Implement approved changes without
altering business rules.

------------------------------------------------------------------------

# 34. API CHANGE PROMPT

Before changing **\[API\]**, find every web/mobile/vendor/merchant/admin
consumer and all tests. Define old contract, new contract,
compatibility/migration strategy and authorization. Implement backend
DTO/domain changes first, then update generated/shared types and every
affected consumer. Do not leave parallel response shapes or temporary
`any` mappings. Run contract and affected integration tests.

------------------------------------------------------------------------

# 35. HANDOFF PROMPT

Do not start another feature. Summarize the current command, completed
acceptance criteria, exact changed files, API/schema/migration changes,
test/build results, manual verification, known risks and next
recommended command. Update `docs/HANDOFF.md` and the progress ledger so
another Antigravity session can continue without rediscovery.

------------------------------------------------------------------------

# 36. RECOMMENDED EXECUTION ORDER

### P0 --- Integrity and architecture

CMD-001 → 014

### P1 --- Customer purchase journey

CMD-015 → 051

### P2 --- Quick-commerce customer

CMD-052 → 058

### P3 --- Customer Android/iOS

CMD-059 → 072

### P4 --- Marketplace vendor web

CMD-073 → 082

### P5 --- Quick merchant web + Android

CMD-083 → 100

### P6 --- Super admin

CMD-101 → 114

### P7 --- Growth

CMD-115 → 125

### P8 --- Scale, accessibility, tests, release

CMD-126 → 142

**Do not execute 142 prompts in one session. One command = one
controlled unit of work.**
