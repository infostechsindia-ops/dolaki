# Email Provider Verification Guide — DEPLOY-002

## Supported Email Providers
1. **SMTP**: Generic SMTP integration (tested with Mailtrap/local relay).
2. **SendGrid**: API key based email dispatch (`SG.*`).
3. **Amazon SES**: AWS region based email service (`@*.amazonses.com`).
4. **Sandbox Provider**: In-memory logger provider for test mode.

## Supported Templates (HTML & Plain Text)
- OTP Verification (`renderOtp`)
- Welcome Email (`renderWelcome`)
- Order Confirmation (`renderOrderConfirmation`)
- Shipment Dispatch (`renderShipment`)
- Refund Confirmation (`renderRefund`)
- Password Reset (`renderPasswordReset`)
- Support Ticket Update (`renderSupportTicket`)
- Vendor Approval Notification (`renderVendorApproval`)
- Admin System Alert (`renderAdminAlert`)
