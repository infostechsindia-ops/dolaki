# AuraMart Commerce OS — SMS Infrastructure Guide

## 1. Overview
The SMS Infrastructure (`backend/src/notifications/sms`) manages SMS dispatches for authentication, order status updates, delivery OTPs, support updates, and vendor notifications.

---

## 2. Supported Providers
- **Sandbox**: Log-only provider for local testing (`SMS_PROVIDER=sandbox`).
- **Twilio**: Twilio Messaging API (`SMS_PROVIDER=twilio`).
- **MSG91**: MSG91 DLT-compliant SMS API (`SMS_PROVIDER=msg91`).
- **TextLocal**: TextLocal SMS Gateway (`SMS_PROVIDER=textlocal`).

---

## 3. SMS Templates
1. **OTP**: `Your AuraMart verification code is {otp}.`
2. **Order Updates**: `AuraMart Alert: Order #{orderNumber} is now {status}.`
3. **Delivery OTP**: `Flado Delivery Code for Order #{orderNumber} is {deliveryOtp}.`
4. **Support**: `AuraMart Support: Ticket #{ticketNumber} updated to {status}.`
5. **Vendor**: `AuraMart Vendor [{storeName}]: {alertText}`
