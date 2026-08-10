# FEATURE_PARITY.md

## AuraMart + Flado — CMD-001 Feature Parity Matrix

> **Audit Command:** CMD-001
> **Type:** Read-Only Audit — No code was modified
> **Date:** 2026-08-05
> **Method:** COMMERCE_OS.md requirements → traced through UI → API → Backend → Database
>
> **Status Legend:**
> - `REAL`    — Feature is genuinely implemented end-to-end with real data
> - `PARTIAL` — Feature exists but is incomplete (missing layers, wrong data source, or degraded)
> - `MOCK`    — Feature UI exists but backed entirely by hardcoded/localStorage data, no backend integration
> - `MISSING` — Feature does not exist in any surface

---

## 1. IDENTITY & AUTHENTICATION

| Feature | Status | Surface Evidence | Gap Description |
|---------|--------|-----------------|-----------------|
| Email + Password registration | PARTIAL | Backend: `POST /api/auth/register` → `auth.controller.ts:18`. Web: `auth/register/`. Mobile: `auth.tsx:70`. | Web hits `http://localhost:5000` directly (not env var). Mobile hits `http://localhost:3000` (wrong port). On any error, mobile silently stores `mock_token_123`. |
| Email + Password login | PARTIAL | Backend: `POST /api/auth/login` → `auth.controller.ts:8`. Mobile `auth.tsx:46`. | Mobile hits `http://localhost:3000` (wrong port). On failure: `AsyncStorage.setItem('aura_token', 'mock_token_123')` — any network error bypasses auth entirely. |
| OTP login (phone-based) | REAL | Backend: `POST /api/auth/send-otp`, `POST /api/auth/verify-otp`. Entity: `otp_tokens` table with `expiresAt`, `usedAt`, `attempts`. | Enforces 60s resend cooldown, 10m expiry, 3 max validation attempts, one-time consumption, and does not leak OTP in responses or logs. |
| JWT access token issuance | REAL | Backend: `auth.service.ts` issues signed JWT with short 15m lifetime. | JWT_SECRET required. Production throws on startup or uses safe configuration check. |
| Refresh token rotation | REAL | Backend: `POST /api/auth/refresh` rotates SHA-256 token hashes. `RefreshToken` entity. | 7-day lifetime. Enforces rotation, SHA-256 hashing, 15-second grace period for concurrent requests, and global session revocation. |
| Role-based auth (12 roles + default-deny) | REAL | Entity: `User.role`. Guards: `JwtAuthGuard` (APP_GUARD), `RolesGuard`, `@Roles()` across all controllers. | CMD-006 complete. 12-role enum active. All routes default-deny. |
| Production audit logging | REAL | Entity: `AuditLog` table. Service: `AuditService` with async non-blocking logger and recursive sensitive-field redaction (`/password|token|secret|otp|cvv/i`). Controller: `GET /api/v1/admin/audit-logs` guarded by SUPER_ADMIN & OPERATIONS. | CMD-008 complete. Append-only logging wired to auth, orders, and layout mutations with e2e tests passing. |
| Vendor-specific registration | REAL | Backend: `POST /api/auth/register-vendor` → `auth.controller.ts:100`. Web: Connected to real endpoint. | Real register-vendor authentication integrated in vendor panel context. GSTIN validation and onboarding workflows scheduled for later. |
| Profile management (web) | PARTIAL | Backend: `GET /api/users/profile`. Web has `/profile` route. | Web profile reads from localStorage token. No update-profile endpoint exists. |
| Profile management (mobile) | PARTIAL | Mobile has profile tab. | Mobile profile reads from AsyncStorage — partial. |
| Address book (add/delete/default) | REAL | Backend: `GET/POST/DELETE /api/users/addresses`. `addresses` entity has `isDefault` col. | Backend functional. Web checkout bypasses it — uses hardcoded `savedAddresses` array (checkout/page.tsx:138-159). |
| Wishlist (add/remove) | REAL | Backend: `GET/POST/DELETE /api/users/wishlist`. `wishlist_items` entity. | Backend functional. Mobile may use local mockData for product IDs in wishlist display. |
| Wallet balance display | PARTIAL | Backend: `GET /api/users/wallet`. Entity: `UserWallet` with `balance` (float), `rewardPoints`. | `users.service.ts:62` — `getWalletTransactions()` returns 2 hardcoded static entries. |
| Wallet transaction history | MOCK | Backend: `GET /api/users/wallet/transactions`. | Returns 2 hardcoded static transactions — never queries the database. |

---

## 2. PRODUCT CATALOGUE

| Feature | Status | Surface Evidence | Gap Description |
|---------|--------|-----------------|-----------------|
| Product listing (web) | PARTIAL | Web `page.tsx:53` tries `http://localhost:5000/api/products`. Falls back to `localProducts` from `@/data/products` (256KB static file). | Hard-coded URL not env var. Silent fallback to local products when backend is down. |
| Product listing (mobile) | PARTIAL | Mobile `api.ts:110` calls `${BASE_URL}/products`. Falls back to `MOCK_PRODUCTS + fladoProductsData` if empty. | `api.ts:102` forces `stock: 20` hardcoded for every product — backend inventory data discarded. |
| Product search (web) | PARTIAL | Web has `/search` route. Products filtered client-side against `localProducts`. | No backend search endpoint. No full-text indexing. |
| Product search (mobile) | PARTIAL | Mobile has search tab with local filtering. | Local mock data filtered — no backend search. |
| Product detail page (web) | PARTIAL | Web has `/products/[id]` page. Fetches from backend. Falls back to `products` local array. | |
| Product detail page (mobile) | PARTIAL | Mobile has `product/[id].tsx`. Uses `api.getProductById()` with mock fallback. | |
| Product variants (color/size) | PARTIAL | Backend `Product` entity: `colorsJson` / `sizesJson` TEXT columns (raw JSON). `Inventory` entity: `variantName` TEXT. | **No `ProductVariant` entity.** Variants are raw JSON. No per-variant pricing, no per-variant inventory reservation. |
| Product reviews (add/approve) | PARTIAL | Backend: `POST /api/products/:id/reviews`, `PUT /api/products/:id/reviews/:reviewId/approve`. `product_reviews` entity with `isApproved`. | Backend exists. Web/mobile calling this not confirmed. |
| Product categories (list) | REAL | Backend: `GET /api/products/categories`. `categories` entity. Seeded on bootstrap. | |
| Product inventory tracking | PARTIAL | Backend: `Inventory` entity with `stockQuantity`, `reservedQuantity`. `orders.service.ts:128` decrements on order. | Mobile discards backend stock — hardcodes `stock: 20`. Web does not display inventory info. |
| Flash sales / time-limited deals | PARTIAL | Backend: `FlashSale` entity. `GET /flash-sales/active`. `campaigns.service.ts` reads DB. | Web/mobile render flash sale from static SDUI config — not connected to live FlashSale DB rows. |
| Brand store pages | MOCK | Web/mobile show brand spotlights with hardcoded brand names/logos (Unsplash). | No `Brand` entity. No brand API. |
| Product image CDN / multiple images | PARTIAL | Entity: `Product.imageUrl` (single column). No `product_images` table. | Multi-image not in schema. |
| Product bundle / kit | MISSING | Not in any entity, controller, or UI. | |
| Barcode / SKU-based lookup | MISSING | `Product.sku` column exists but no scan endpoint or UI. | |

---

## 3. CART & CHECKOUT

| Feature | Status | Surface Evidence | Gap Description |
|---------|--------|-----------------|-----------------|
| Cart management (web) | MOCK | Web `CartContext.tsx`: pure React `useState` + `localStorage`. No backend cart endpoint. | Cart 100% client-side. Lost on logout. Not synced across devices. |
| Cart management (mobile) | MOCK | Mobile `CartContext.tsx`: `useState` + `AsyncStorage`. No backend cart endpoint. | Same — 100% local. No backend cart API exists anywhere. |
| Address selection at checkout (web) | MOCK | Web `checkout/page.tsx:138-159`: hardcoded `savedAddresses` array with personal name "Arif Al Nukhbah". | Not reading from `GET /api/users/addresses`. Backend address book completely bypassed. |
| Address selection at checkout (mobile) | MOCK | Mobile `CartContext.tsx:60-63`: `DEFAULT_ADDRESSES` array with hardcoded Bengaluru/Noida/Chennai. | Same — not reading from backend. |
| Coupon validation at checkout (web) | PARTIAL | Backend: `POST /api/coupons/validate`. Web reads discount from `localStorage.getItem('auramart_discount')`. | Coupon validate API exists but web reads localStorage — not calling API during checkout. |
| Coupon validation at checkout (mobile) | PARTIAL | Mobile `CartContext.tsx` has `couponDiscount` state. | Local number in state — no API call evident. |
| Order placement (web) | MOCK | Web `checkout/page.tsx:184-206`: `handlePlaceOrder` is `setTimeout(2000)` generating random `FLADO-XXXXXX` ID, writing to localStorage. **No API call made.** | Complete simulation. No order ever persisted to backend when placing from web. |
| Order placement (mobile) | PARTIAL | Mobile `CartContext.tsx:239`: calls `api.placeOrder()` → `POST ${BASE_URL}/orders`. Fallback: generates mock `ORD-XXXXXX`. | Only surface that attempts real API call. Falls back silently to mock ID if backend is down. |
| Payment processing (web) | MOCK | Web checkout shows UPI/Card/COD forms but `handlePlaceOrder` ignores them entirely — `setTimeout` simulates processing. | No Razorpay SDK, no payment gateway. |
| Payment processing (mobile) | MOCK | Mobile checkout `handlePayment()`: `setTimeout(2500)` then calls `placeOrder()`. Shows "Razorpay" label in UI. | No real Razorpay SDK. Simulates gateway with a delay. |
| COD fee calculation (backend) | PARTIAL | Backend: `GET /flado/cod-fee?amount=X`. 1% capped at ₹10. | Only for Flado. No COD fee endpoint for marketplace orders. |
| Order confirmation page | MOCK | Web: `/checkout/confirmation` reads `localStorage` for `last_order_id`, `last_order_total`, `last_order_eta`. | Reads mock localStorage values. |
| GST calculation | PARTIAL | Web/mobile both compute `Math.round(subtotal * 0.18)` client-side. | Hardcoded 18% flat. No per-product GST slab. Backend receives `totalAmount` from client — no server-side re-validation. |
| Delivery fee calculation | PARTIAL | Web `CartContext.tsx:89-90`: flat ₹40 if subtotal < ₹500, flat ₹25 Flado. Mobile: similar thresholds. | Not configurable from backend. No delivery zones, no vendor-specific rates. |

---

## 4. ORDERS & FULFILLMENT

| Feature | Status | Surface Evidence | Gap Description |
|---------|--------|-----------------|-----------------|
| Order history (web) | PARTIAL | Web `orders/page.tsx:22`: hits `http://localhost:3000/orders` (**WRONG PORT — should be 5000**). Falls back to hardcoded `mockOrders()`. | Wrong port. Will always use mock orders. Backend has correct `GET /api/orders`. |
| Order history (mobile) | PARTIAL | Mobile orders screen reads from `CartContext.orders` (local AsyncStorage) + `api.getOrders()`. | Local state is authoritative — API orders not merged properly. |
| Order detail view (web) | PARTIAL | Web `/orders/[id]` route exists. | Not confirmed it calls backend `GET /api/orders/:id`. |
| Order status tracking | PARTIAL | Backend: `Order.status` enum. `PUT /api/orders/:id/status`. | No push notification. No real-time websocket. No polling. |
| Return/Refund request | PARTIAL | Backend: `POST /api/orders/:id/return`, `PUT /api/returns/:id/approve`, `PUT /api/returns/:id/reject`. `ReturnRequest` entity. | `approveReturn()` only sets status + `refundAmount` column — no actual wallet credit or gateway refund. |
| Order cancellation | MISSING | No `POST /api/orders/:id/cancel` endpoint. Only admin/vendor/delivery can set CANCELLED via `updateStatus`. | Customer cannot cancel own order. |
| Order items per vendor | PARTIAL | Backend: `OrderItem.vendorId`. `orders.service.ts:32` finds vendor orders. | `OrderItem.vendorId` defaults to `'flagship-store-id'` fallback string when not provided (orders.service.ts:115). |
| FulfillmentGroup / split orders | MISSING | No `FulfillmentGroup` entity. One order = one shipment. | Cannot split order with items from multiple vendors. |
| Shipment tracking (AWB) | MISSING | No `Shipment` entity. No tracking number. No logistics partner. | |
| Delivery partner assignment | PARTIAL | `Order.riderId` column. `PUT /flado/orders/:id/assign-rider`. | Only for Flado. No marketplace delivery assignment API. |
| Delivery OTP verification | PARTIAL | `Order.verificationOtp` column — 4-digit OTP generated at order creation (orders.service.ts:104). | Stored in plain DB column. No endpoint for rider to verify OTP. |

---

## 5. PAYMENTS & WALLET

| Feature | Status | Surface Evidence | Gap Description |
|---------|--------|-----------------|-----------------|
| Payment record creation | PARTIAL | Backend `orders.service.ts:157-165` creates `Payment` entity on order placement. | `transactionId` is `'TXN-' + random` — not from gateway. |
| Payment gateway (Razorpay) | MISSING | Mobile labels "Razorpay" in UI. Web shows UPI/Card forms. | No Razorpay SDK in any package.json. No gateway callback. No signature verification. |
| UPI payment | MISSING | UI only — no payment provider integration. | |
| Card payment | MISSING | UI only — Web checkout has card inputs but `handlePlaceOrder` ignores them entirely. | |
| Cash on Delivery | PARTIAL | Backend `Payment.method` can store COD. COD fee for Flado. | No COD fee for marketplace. No COD confirmation workflow. |
| Aura Wallet payments | PARTIAL | Backend: `orders.service.ts:66-92` deducts `wallet.balance` on wallet payment. `UserWallet.balance` entity. | **CRITICAL:** `wallet.balance -= totalAmount` directly mutates balance. No `WalletTransaction` ledger entity. No immutable audit trail. |
| AuraCoins (loyalty points) | PARTIAL | Backend: earns `Math.floor(totalAmount * 0.01)` points. Burns via `BURN` transaction. `LoyaltyTransaction` entity. | Exchange rate hardcoded at `points / 10`. Web wallet shows hardcoded mock transactions. |
| Refund disbursement | MISSING | `approveReturn()` sets `refundAmount` column only — no wallet credit, no gateway refund. | |
| Settlement to vendor | MISSING | No `VendorSettlement` entity. No payout calculation. No payout schedule. | |
| Payment idempotency | MISSING | No `IdempotencyKey` entity. Duplicate order creation is possible. | |

---

## 6. CMS / MERCHANDISING (MERCHANDISING_CMS_EXTENSION.md)

| Feature | Status | Surface Evidence | Gap Description |
|---------|--------|-----------------|-----------------|
| SDUI homepage config (backend) | PARTIAL | Backend: `GET/POST /api/sdui/homepage`. `sdui.service.ts` reads/writes `sdui_homepage.json` flat file on disk. | CMS config stored as a disk file — **not in database**. No versioning, no publish/draft, no rollback. Lost on container restart. |
| SDUI homepage (web) | PARTIAL | Web `page.tsx:76` fetches from `http://localhost:5000/api/sdui/homepage`. Falls back to `getCMSConfig()` from `@/data/cmsConfig.ts`. | Hard-coded URL. Client-side fallback has all sections statically defined. |
| SDUI homepage (mobile) | PARTIAL | Mobile index.tsx: `DEFAULT_MOBILE_CMS` constant (200+ lines hardcoded). `api.getSduiLayout()` fetches backend but rendering reads from hardcoded default when API fails. | |
| SDUI Flado layout | PARTIAL | Backend: `GET/POST /api/sdui/flado` → `sdui_flado.json` file. | Same flat-file problems as homepage. |
| SDUI category page layout | PARTIAL | Backend: `GET /api/sdui/category/:slug`. | Minimal stub implementation. |
| Admin CMS composer (web) | PARTIAL | Admin has `cms/` route group. Uses `AdminContext` (pure in-memory mock). | **Admin CMS changes never persisted.** `POST /api/sdui/homepage` never called from admin. |
| Home page announcement bar | PARTIAL | Web/mobile render `top_announcement` from CMS config. Backend has it in default SDUI. | Works from static config, not live from DB. |
| Hero banner carousel (admin-controlled) | PARTIAL | All three surfaces render hero banners from CMS JSON. Admin `cms/` has banner management. | Admin changes don't reach backend — in-memory context only. |
| Flash sale section | PARTIAL | Backend has `FlashSale` entity + endpoints. Web renders `flash_sale` section from SDUI config. | **Disconnect:** backend flash sales (DB) not connected to SDUI flash_sale section renderer. SDUI uses hardcoded productIds. |
| Category grid (quick navigation) | PARTIAL | Web/mobile render category grid from static SDUI config. Backend has `/api/products/categories`. | Web/mobile do not call backend categories API for home category grid — use static list from CMS config. |
| Brand spotlight | MOCK | Web/mobile render brand spotlight with hardcoded Unsplash logos. | No Brand entity, no brand API. |
| New launches section | MOCK | Web/mobile have `new_launches` section. productIds are hardcoded strings like `'toy-1'`, `'spo-2'`. | No backend "new launches" concept. |
| Promotional strips / ad banners | PARTIAL | `campaigns.service.ts` has `Banner` entity with `position`, `city` filters. `GET /banners` endpoint. | Web may fetch banners from backend. Mobile renders banners from static SDUI config — no API call. |
| Deals / campaign spotlight | PARTIAL | Backend has `Campaign` entity. `GET /api/flash-sales/active` works. | Web home renders deals as static `promoPagesRegistry` from `@/data/promoLayouts.ts`. |
| Spin wheel gamification | PARTIAL | Web: `SpinWheel` component with localStorage cooldown `auramart_last_spin`. Auto-triggers after 3s. | Spin result is client-side random — no backend API, no persistence, no fraud prevention. |
| AuraLive (live deals) | MOCK | Web home has `AuraLive` section with fake `liveWatchers` counter (Math.random() incrementing). | No video streaming. No real-time watchers. Fully simulated. |
| Promotional collections / lookbooks | MOCK | Web/mobile render lookbooks from static SDUI config with Unsplash images. | No backend, no admin tooling to manage. |

---

## 7. FLADO QUICK-COMMERCE

| Feature | Status | Surface Evidence | Gap Description |
|---------|--------|-----------------|-----------------|
| Shop registration (merchant) | PARTIAL | Backend: `POST /flado/shops/register` → `FladoShop` entity with `status: PENDING`. | No guard — any unauthenticated user can register a shop. |
| Shop approval workflow (admin) | PARTIAL | Backend: `GET /flado/admin/shops/pending`, `POST /flado/admin/shops/:id/approve`, `POST /flado/admin/shops/:id/reject`. Admin-guarded. | Admin panel `flado-ops/` reads from `AdminContext` (mock hubs/riders) — not connected to `/flado/admin/shops` backend. |
| Shop profile management | PARTIAL | Backend: `GET/PUT /flado/shops/:shopId`. | Open — no `@UseGuards`. Any user can view/edit any shop profile. |
| Shop open/close toggle | PARTIAL | Backend: `PUT /flado/shops/:shopId/toggle`. | Unguarded. |
| Shop inventory (add/update/delete products) | PARTIAL | Backend: `POST/PUT/DELETE /flado/shops/:shopId/products`. | Unguarded. |
| Shop orders view & status update | PARTIAL | Backend: `GET /flado/shops/:shopId/orders`, `PUT /flado/shops/:shopId/orders/:orderId/status`. | Unguarded. |
| Flado order placement (customer) | PARTIAL | Backend: `POST /flado/orders`. Mobile `api.ts:155` calls `POST /api/orders` (not `/flado/orders`). | **API URL mismatch:** mobile places Flado orders via marketplace endpoint. |
| Customer order tracking (phone) | PARTIAL | Backend: `GET /flado/orders/customer/:phone`. | Phone-based — no auth. Security gap. |
| ETA calculation | MOCK | Backend: `GET /flado/eta`. `fladoService.calculateEta()` returns hardcoded `{ minutes: 20, confidence: 0.85 }`. | No polygon engine. No real-time traffic. |
| Nearby stores (serviceability) | PARTIAL | Backend: `GET /flado/stores/nearby?lat&lng`. Returns stores within radius using hardcoded `fladoDarkstores` list. | No true polygon serviceability. Euclidean distance, not routing. |
| Rider management | PARTIAL | Backend: `POST/GET /flado/shops/:shopId/riders`, `PUT /flado/riders/:id/availability`. Rider entity exists. | Unguarded. No rider app. No GPS tracking. |
| Rider assignment to order | PARTIAL | Backend: `PUT /flado/orders/:id/assign-rider`. | Unguarded. Manual assignment only — no smart dispatch. |
| Shop hours management | PARTIAL | Backend: `GET/PUT /flado/shops/:shopId/hours`. `ShopHours` entity. | Unguarded. |
| COD fee (Flado) | PARTIAL | Backend: `GET /flado/cod-fee?amount=X`. 1% capped at ₹10. | Works for Flado only. |
| Udhaar (credit ledger) | PARTIAL | Backend: full credit ledger endpoints. `FladoCredit`, `FladoCreditTransaction` entities. | Unguarded. No mobile UI for credit repayment. |
| Shop subscription management | PARTIAL | Backend: `GET /flado/shops/:shopId/subscription`. `ShopSubscription` entity. | No payment integration for subscription fees. |
| Substitution workflow | MISSING | No substitution entity, no substitution API, no UI. | |
| Picking state machine | MISSING | No picking/packing state machine. Order goes from PLACED to any status directly. | |
| Dedicated Flado merchant app | MISSING | No separate app. Mobile flado.tsx has embedded merchant section. `app/` (Kotlin) has no clear purpose. | |
| Rider delivery app | MISSING | No rider-facing interface in any surface. | |

---

## 8. MARKETPLACE VENDOR

| Feature | Status | Surface Evidence | Gap Description |
|---------|--------|-----------------|-----------------|
| Vendor portal login | PARTIAL | Vendor app has `/login` route. Hits backend `POST /api/auth/login`. | No vendor-specific registration flow separate from user registration. |
| Vendor portal dashboard | MOCK | `vendor/src/app/dashboard/page.tsx` reads from `VendorContext`. Context initialized with `INITIAL_PRODUCTS`, `INITIAL_ORDERS` hardcoded arrays (`VendorContext.tsx:102-173`). | **ALL vendor data is hardcoded mock.** No backend API calls for any CRUD. |
| Vendor product management | MOCK | Vendor portal `dashboard/inventory/` route. Uses `VendorContext.addProduct()`. | All in-memory. Changes do not reach `POST /api/products`. |
| Vendor order management | MOCK | Vendor portal `dashboard/orders/` route. Uses `VendorContext.updateOrderStatus()`. | All in-memory. Does not call `PUT /api/orders/:id/status`. |
| Vendor payout/settlement view | MOCK | Vendor `dashboard/payouts/` route. `VendorContext` has `INITIAL_PAYOUTS` hardcoded. | No backend payout entities or endpoints. |
| Vendor profile (GSTIN, bank) | MOCK | Vendor `dashboard/profile/` route. Edits `VendorContext.profile`. | In-memory only. No backend profile update API. |
| Backend vendor product CRUD | PARTIAL | Backend: `POST/PUT/DELETE /api/products` guarded by VENDOR/ADMIN roles. `products.service.ts` creates/updates/deletes from DB. | Functional on backend but vendor portal never calls it. |
| Vendor performance score | PARTIAL | `Vendor.performanceScore` column. `ProductsService.getAuditLogs()` exists. | Not surfaced in vendor portal. |
| Vendor settlement calculation | MISSING | No `VendorSettlement` entity. No payout calculation logic. | |
| Vendor KYC / document upload | MISSING | No document upload entity. No verification workflow. | |

---

## 9. SUPER ADMIN

| Feature | Status | Surface Evidence | Gap Description |
|---------|--------|-----------------|-----------------|
| Admin login | PARTIAL | Admin app has `/login` page. Uses `AdminContext.login()`. | **Admin login does not call backend** — `AdminContext` has in-memory `isLoggedIn` flag only. No JWT. |
| Admin dashboard metrics | MOCK | `admin/page.tsx` computes metrics from `AdminContext` (in-memory mock data). | Revenue, orders, products, vendors — all computed from hardcoded mock arrays. Not from backend. |
| Admin product CRUD | MOCK | Admin `products/` route. Uses `AdminContext.addProduct()`. | In-memory only. Does not call backend product APIs. |
| Admin category management | MOCK | Admin `products/` (categories tab). Uses `AdminContext.addCategory()`. | In-memory. |
| Admin coupon management | MOCK | Admin `marketing/` route. Uses `AdminContext.addCoupon()`. | In-memory. Coupons do not reach `POST /api/coupons`. |
| Admin flash sale management | MOCK | Admin `marketing/` route flash sales. Uses `AdminContext.addFlashSale()`. | In-memory only. Does not reach `POST /api/admin/flash-sales`. |
| Admin order management | MOCK | Admin `orders/` route. Uses `AdminContext.updateOrderStatus()`. | In-memory. Does not call `PUT /api/orders/:id/status`. |
| Admin vendor management | MOCK | Admin `vendors/` route. Uses `AdminContext.updateVendorStatus()`. | In-memory. Does not call backend. |
| Admin user management | MOCK | Admin `users/` route. Uses `AdminContext.users` (hardcoded). | In-memory. Does not call `GET /api/users`. |
| Admin CMS management | PARTIAL | Admin `cms/` route has banner/layout management UI. | UI exists and has section ordering controls. Does not call `POST /api/sdui/homepage`. |
| Admin analytics | MOCK | Admin `analytics/` route shows charts. Uses `DashboardCharts` component. | Charts are SVG with hardcoded data points. |
| Admin Flado ops | MOCK | Admin `flado-ops/` route. Uses `AdminContext.hubs`, `riders` (hardcoded). | Does not call `/flado/admin/` endpoints. |
| Admin RBAC (granular) | MISSING | Only one ADMIN role. No granular permissions. | |
| Admin audit log viewer | PARTIAL | Backend: `AuditLog` entity, `GET /api/admin/audit-log`. | Not surfaced in admin panel UI. |
| Admin finance / refund console | MISSING | No route. No backend finance endpoints. | |
| Admin risk / fraud management | MISSING | Not in any surface. | |
| Admin support ticket management | MISSING | Not in any surface. | |
| Admin promotion rule builder | MISSING | Coupons exist but no rule-based promotion engine. | |

---

## 10. PLATFORM SECURITY & INFRASTRUCTURE

| Feature | Status | Surface Evidence | Gap Description |
|---------|--------|-----------------|-----------------|
| HTTPS enforcement | MISSING | Backend runs plain HTTP. No TLS middleware. | |
| CORS policy | PARTIAL | `main.ts`: `origin: true` — allows all origins. | Too permissive. Should whitelist known domains. |
| API versioning (/api/v1) | MISSING | Backend prefix is `/api` only. No version segment. | COMMERCE_OS.md requires versioned API from the start. |
| Request validation (class-validator) | PARTIAL | `class-validator` in package.json. Some modules use DTOs. Most controllers use `@Body() body: any` — no DTO validation. | Mixed — most controllers accept raw `body: any` with no validation. |
| Rate limiting | MISSING | `@nestjs/throttler` not in package.json. No rate limit middleware. | |
| Database migrations | MISSING | `TypeORM synchronize: true` in development. No `migrations/` folder. | Schema changes in production will be destructive. |
| Environment config validation | MISSING | No `@nestjs/config` schema validation. Secrets fall back silently instead of failing. | |
| Idempotency keys | MISSING | No `IdempotencyKey` entity. Duplicate order submissions possible. | |
| Audit logging | PARTIAL | `AuditLog` entity and `getAuditLogs()` method. | Not populated for most operations. |
| Money precision (decimal) | MISSING | All monetary columns are `type: 'float'` — `Order.totalAmount`, `Payment.amount`, `UserWallet.balance`. | Float is unsafe for money. Requires `decimal/numeric` with precision. |
| Redis integration | MISSING | Redis in `docker-compose.yml`. No Redis usage found in any service file. | |
| Background jobs / queues | MISSING | No `@nestjs/bull`, `nestjs-schedule`, or similar. | |
| File uploads (product images) | MISSING | No Multer, no S3 integration. Products reference external Unsplash URLs. | |

---

## 11. NATIVE ANDROID APP (`app/`)

| Feature | Status | Surface Evidence | Gap Description |
|---------|--------|-----------------|-----------------|
| Android client exists | PARTIAL | `app/` is a Kotlin/Jetpack Compose project. | Coexists with `mobile/` (Expo). No ADR decision on canonical mobile client. |
| Connectivity to backend | UNKNOWN | Not traced in this audit. | Requires separate inspection. |

---

## Summary: Status Counts

| Status | Count |
|--------|-------|
| REAL | 4 |
| PARTIAL | 57 |
| MOCK | 28 |
| MISSING | 22 |

**Total features audited: 111**

---

## Top 15 Most Critical Findings (Priority Order)

1. **[SECURITY] Web checkout is a complete simulation** — `handlePlaceOrder` in `checkout/page.tsx:184-206` is `setTimeout(2000)` generating a random ID. No order is ever sent to the backend. No payment is processed.

2. **[SECURITY] Admin portal has no authentication** — `AdminContext` login sets an in-memory flag. Admin panel accepts any credentials with no backend verification. All admin data is hardcoded mock.

3. **[SECURITY] Vendor portal is entirely mock** — `VendorContext` initializes from hardcoded product/order arrays. No backend call made from vendor portal for any CRUD operation.

4. **[SECURITY] OTP returned in API response** — `auth.service.ts` returns `{ otp }` plaintext in `POST /api/auth/send-otp` response.

5. **[SECURITY] Mobile auth silently falls back to `mock_token_123`** — Any network failure during login bypasses authentication and stores a fake token (`auth.tsx:62`).

6. **[SECURITY] 30+ Flado endpoints have no authentication guards** — shop profile, inventory, orders, credit ledger, rider availability — all open to unauthenticated access.

7. **[DATA] Cart is 100% client-side on both web and mobile** — No backend cart entity. Cart lost on logout, not synced across devices.

8. **[DATA] Orders page hits wrong port `localhost:3000` on both web and mobile** — Backend is on port 5000. Always falls back to hardcoded mock orders.

9. **[FINANCIAL] Wallet balance is a mutable float with no ledger** — `wallet.balance -= totalAmount` with no `WalletTransaction` entity. No double-entry, no audit trail, float precision issues.

10. **[FINANCIAL] Refund approval does not disburse funds** — `approveReturn()` sets a column; no wallet credit or gateway refund initiated.

11. **[FINANCIAL] No payment gateway integration** — No Razorpay, no UPI gateway, no card processing. All payments are simulated with `setTimeout()`.

12. **[DATA] SDUI CMS config stored in flat JSON file on disk** — Lost on container restart. No versioning, no publish/draft workflow, no DB persistence.

13. **[DATA] Wallet transaction history is 2 hardcoded rows** — `users.service.ts:62-67` returns static hardcoded array — never queries the database.

14. **[ARCHITECTURE] No `ProductVariant` entity** — Variants stored as raw JSON strings. No per-variant inventory, pricing, or reservation.

15. **[ARCHITECTURE] Products seeded from hardcoded arrays in `onApplicationBootstrap()`** — `products.service.ts:27` seeds 50+ products from in-code arrays on every cold start if count < 15. No admin seeding mechanism.

---

*CMD-001 complete. No production code was modified. Awaiting assignment of CMD-002.*
