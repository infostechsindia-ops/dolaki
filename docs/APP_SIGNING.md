# Mobile Application Signing & Credentials Security Specification

---

## 1. Android Release Signing Keystore

- **Upload Keystore Alias**: `auramart-release-key`
- **Algorithm**: RSA 4096-bit with SHA256withRSA signature.
- **Storage**: Keystore stored securely in encrypted secrets vault (`ANDROID_KEYSTORE_BASE64`).

---

## 2. iOS Provisioning & Distribution Certificates

- **Distribution Certificate**: Apple Distribution (`AURA123456`).
- **Provisioning Profile**: App Store Profile supporting Push Notifications, Universal Links, and Secure Storage.

---

*Document generated for STORE-001.*
