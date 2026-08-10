# SMS Provider Verification Guide — DEPLOY-002

## Supported SMS Providers
1. **Twilio**: Uses `TWILIO_ACCOUNT_SID` for transactional SMS dispatch.
2. **MSG91**: Uses `MSG91_AUTH_KEY` and template IDs for DLT-compliant Indian SMS dispatch.
3. **TextLocal**: Uses `TEXTLOCAL_API_KEY` for transactional SMS.
4. **Sandbox Provider**: In-memory SMS provider for test environment execution.

## Supported Use Cases
- Customer OTP Verification
- Delivery OTP Verification (Rider OTP)
- Order Status Updates
- Support Ticket Notifications
- Vendor Alert SMS
