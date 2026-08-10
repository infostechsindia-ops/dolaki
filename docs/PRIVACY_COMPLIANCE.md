# Privacy & Regulatory Compliance Document
## AuraMart Commerce OS v2.0.0-rc.1 | Date: 2026-08-08

---

## 1. Compliance URLs
- **Privacy Policy**: `https://auramart.com/policies/privacy-policy`
- **Terms of Service**: `https://auramart.com/policies/terms-of-service`
- **Account Deletion Request**: `https://auramart.com/help/delete-account`

---

## 2. Apple Privacy Nutrition Labels

| Data Category | Data Type | Linked to User | Used for Tracking | Justification |
|---------------|-----------|----------------|-------------------|---------------|
| **Location** | Precise Location | Yes | No | Quick Commerce darkstore assignment & rider routing |
| **Contact Info** | Name, Email, Phone | Yes | No | Account management, OTP, & order status updates |
| **Financial Info** | Payment Info | Yes | No | Server-authoritative checkout processing |
| **Identifiers** | User ID, Device ID | Yes | No | Push notifications & fraud prevention |
| **Usage Data** | App Interaction | No | No | Analytics & app performance optimization |

---

## 3. GDPR & Data Safety Summary
- **Data Encryption**: All data transmitted over HTTPS (TLS 1.3) with HSTS. Sensitive mobile data stored using `expo-secure-store`.
- **Right to be Forgotten**: Account deletion workflow purges personal identification data while retaining financial transaction records for audit compliance.
- **Children’s Policy**: App is not directed at children under 13 years of age.

---

*Document generated for STORE-001.*
