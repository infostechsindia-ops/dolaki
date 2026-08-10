# Google Play Console Submission & Release Guide
## AuraMart Commerce OS v2.0.0-rc.1 | Date: 2026-08-08

---

## Target Android Applications & Package Names

| Application | App Name | Package Name | Version Code | Target Track |
|-------------|----------|--------------|--------------|--------------|
| **Customer App** | AuraMart Commerce | `com.auramart.customer` | `200001` | Production / Internal |
| **Vendor App** | AuraMart Partner | `com.auramart.vendor` | `200001` | Internal Track |
| **Rider App** | Flado Express Rider | `com.auramart.rider` | `200001` | Internal Track |
| **Warehouse App** | AuraMart Ops | `com.auramart.warehouse` | `200001` | Internal Track |

---

## Google Play Console Submission Checklist

### 1. Android App Bundle (.aab) Requirements
- **Target SDK**: Android 14 (API Level 34).
- **Minimum SDK**: Android 7.0 (API Level 24).
- **Build Format**: Android App Bundle (`.aab`) signed with production upload keystore.

### 2. Android Manifest & Intent Filters
- Deep Link Domain Verification (`autoVerify="true"`):
  - Scheme: `https`, Host: `auramart.com`, Path Prefix: `/products`
  - Scheme: `auramart`, Host: `orders`

### 3. Google Play Data Safety Form
- **Data Collected**: Approximate location, precise location, name, email address, phone number, purchase history, crash logs, device IDs.
- **Security Practices**: Data encrypted in transit (HTTPS/TLS 1.3), user account deletion request option supported.

---

*Document generated for STORE-001.*
