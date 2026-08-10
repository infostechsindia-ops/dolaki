# Apple App Store Submission & Release Guide
## AuraMart Commerce OS v2.0.0-rc.1 | Date: 2026-08-08

---

## Target iOS Applications & Bundle Identifiers

| Application | App Name | Bundle Identifier | SKU / App ID | Target Audience |
|-------------|----------|-------------------|--------------|-----------------|
| **Customer App** | AuraMart Commerce | `com.auramart.customer` | `AM-IOS-CUST` | End Consumers |
| **Vendor App** | AuraMart Partner | `com.auramart.vendor` | `AM-IOS-VEND` | Marketplace Sellers |
| **Rider App** | Flado Express Rider | `com.auramart.rider` | `AM-IOS-RIDE` | Delivery Fleet |
| **Warehouse App** | AuraMart Ops | `com.auramart.warehouse` | `AM-IOS-WHSE` | Warehouse & Darkstore Ops |

---

## App Store Connect Submission Checklist

### 1. Account Credentials & Certificates
- **Team ID**: `AURA123456`
- **Provisioning Profile**: App Store Distribution Profile with Push Notifications, Associated Domains, and Keychain Access capabilities.
- **Signing Certificate**: Apple Distribution Certificate valid through 2027.

### 2. App Capabilities & Entitlements
- `push-notifications`: APNs push notification entitlement.
- `associated-domains`: Associated domains configured for `applinks:auramart.com` and `applinks:www.auramart.com`.
- `background-modes`: Remote notifications, background fetch, and location updates.

### 3. Info.plist Privacy Justifications (`NS...UsageDescription`)
- **Location**: *"AuraMart uses your location to evaluate 10-minute Quick Commerce serviceability and locate darkstores near you."*
- **Camera**: *"AuraMart requires camera access for barcode scanning, order verification, and proof-of-delivery photos."*
- **Photo Library**: *"AuraMart uses your photo library to allow uploading profile photos and product review images."*

---

*Document generated for STORE-001.*
