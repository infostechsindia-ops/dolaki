import { Injectable } from '@nestjs/common';

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class EmailTemplatesService {
  private wrapLayout(title: string, bodyContent: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #7c3aed; color: #ffffff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
    .content { padding: 32px 24px; line-height: 1.6; }
    .footer { background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; background: #ede9fe; color: #6d28d9; font-weight: 700; font-size: 14px; }
    .button { display: inline-block; background: #7c3aed; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛒 AuraMart Commerce</h1>
    </div>
    <div class="content">
      ${bodyContent}
    </div>
    <div class="footer">
      &copy; 2026 AuraMart Commerce OS. All rights reserved.<br>
      Automated transactional email. Please do not reply directly to this email.
    </div>
  </div>
</body>
</html>`;
  }

  // 1. OTP Email
  renderOtp(otp: string, expiresInMinutes = 10): RenderedEmail {
    const subject = `[AuraMart] Your Verification Code: ${otp}`;
    const html = this.wrapLayout(
      'Security Verification',
      `<h2>Verification Code</h2>
       <p>Use the following code to complete your security verification. This code expires in <strong>${expiresInMinutes} minutes</strong>.</p>
       <div style="text-align: center; margin: 24px 0;">
         <span style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #7c3aed;">${otp}</span>
       </div>
       <p style="color: #64748b; font-size: 14px;">If you did not request this verification code, please ignore this email.</p>`,
    );
    const text = `AuraMart Verification Code: ${otp}. Valid for ${expiresInMinutes} minutes.`;
    return { subject, html, text };
  }

  // 2. Welcome Email
  renderWelcome(name: string): RenderedEmail {
    const subject = `Welcome to AuraMart, ${name}! 🎉`;
    const html = this.wrapLayout(
      'Welcome',
      `<h2>Welcome to AuraMart!</h2>
       <p>Hi ${name},</p>
       <p>Thank you for joining AuraMart Commerce OS. Discover millions of curated products, fast delivery, and exclusive AuraVIP rewards.</p>
       <a href="https://auramart.local" class="button">Start Shopping</a>`,
    );
    const text = `Welcome to AuraMart, ${name}! Discover millions of curated products and fast delivery.`;
    return { subject, html, text };
  }

  // 3. Order Confirmation
  renderOrderConfirmation(orderNumber: string, grandTotalFormatted: string, itemsCount: number): RenderedEmail {
    const subject = `Order Confirmed: #${orderNumber} (${grandTotalFormatted})`;
    const html = this.wrapLayout(
      'Order Confirmation',
      `<h2>Order Confirmed!</h2>
       <p>Thank you for your order. We are preparing your shipment now.</p>
       <p><strong>Order #:</strong> ${orderNumber}</p>
       <p><strong>Total Items:</strong> ${itemsCount}</p>
       <p><strong>Grand Total:</strong> ${grandTotalFormatted}</p>
       <a href="https://auramart.local/orders/${orderNumber}" class="button">Track Your Order</a>`,
    );
    const text = `Order #${orderNumber} confirmed. Total: ${grandTotalFormatted} (${itemsCount} items).`;
    return { subject, html, text };
  }

  // 4. Shipment Update
  renderShipment(orderNumber: string, trackingNumber: string, carrier: string): RenderedEmail {
    const subject = `Your Order #${orderNumber} Has Been Shipped! 🚚`;
    const html = this.wrapLayout(
      'Shipment Update',
      `<h2>Shipment Dispatched</h2>
       <p>Great news! Your order <strong>#${orderNumber}</strong> is on its way.</p>
       <p><strong>Carrier:</strong> ${carrier}</p>
       <p><strong>Tracking #:</strong> ${trackingNumber}</p>
       <a href="https://auramart.local/orders/${orderNumber}" class="button">View Live Tracking</a>`,
    );
    const text = `Order #${orderNumber} shipped via ${carrier} (Tracking #: ${trackingNumber}).`;
    return { subject, html, text };
  }

  // 5. Refund Notification
  renderRefund(refundNumber: string, amountFormatted: string, reason: string): RenderedEmail {
    const subject = `Refund Processed: #${refundNumber} (${amountFormatted})`;
    const html = this.wrapLayout(
      'Refund Processed',
      `<h2>Refund Issued</h2>
       <p>A refund of <strong>${amountFormatted}</strong> has been processed to your original payment method.</p>
       <p><strong>Refund ID:</strong> ${refundNumber}</p>
       <p><strong>Reason:</strong> ${reason}</p>
       <p style="color: #64748b; font-size: 14px;">Funds typically appear within 3-5 business days depending on your bank.</p>`,
    );
    const text = `Refund ${refundNumber} processed for ${amountFormatted}. Reason: ${reason}.`;
    return { subject, html, text };
  }

  // 6. Password Reset
  renderPasswordReset(resetToken: string, name: string): RenderedEmail {
    const subject = `Reset Your AuraMart Password`;
    const html = this.wrapLayout(
      'Password Reset',
      `<h2>Password Reset Request</h2>
       <p>Hi ${name},</p>
       <p>We received a request to reset your password. Click the button below to choose a new password:</p>
       <a href="https://auramart.local/auth/reset-password?token=${resetToken}" class="button">Reset Password</a>
       <p style="color: #64748b; font-size: 14px; margin-top: 24px;">This link is valid for 30 minutes. If you did not request a password reset, no action is needed.</p>`,
    );
    const text = `Password reset request for ${name}. Token: ${resetToken}`;
    return { subject, html, text };
  }

  // 7. Support Ticket Update
  renderSupportTicket(ticketNumber: string, subjectLine: string, status: string): RenderedEmail {
    const subject = `Support Ticket Update: ${ticketNumber} [${status}]`;
    const html = this.wrapLayout(
      'Support Update',
      `<h2>Ticket Update</h2>
       <p>Your support ticket <strong>${ticketNumber}</strong> (${subjectLine}) has been updated.</p>
       <p><strong>Current Status:</strong> <span class="badge">${status}</span></p>
       <a href="https://auramart.local/profile/support/${ticketNumber}" class="button">View Ticket Timeline</a>`,
    );
    const text = `Support ticket ${ticketNumber} updated to status: ${status}.`;
    return { subject, html, text };
  }

  // 8. Vendor Onboarding Approval
  renderVendorApproval(storeName: string, vendorEmail: string): RenderedEmail {
    const subject = `Vendor Onboarding Approved: Welcome ${storeName}!`;
    const html = this.wrapLayout(
      'Vendor Approval',
      `<h2>Vendor Store Approved 🎉</h2>
       <p>Congratulations! Your vendor store <strong>${storeName}</strong> has passed compliance audit and is approved to sell on AuraMart.</p>
       <a href="https://vendor.auramart.local/dashboard" class="button">Go to Vendor Portal</a>`,
    );
    const text = `Vendor store ${storeName} approved for ${vendorEmail}.`;
    return { subject, html, text };
  }

  // 9. Admin Platform Alert
  renderAdminAlert(alertType: string, messageText: string, severity: string): RenderedEmail {
    const subject = `[SYSTEM ALERT] ${severity.toUpperCase()}: ${alertType}`;
    const html = this.wrapLayout(
      'System Alert',
      `<h2>System Monitoring Alert</h2>
       <p><strong>Severity:</strong> <span class="badge" style="background:#fee2e2; color:#991b1b;">${severity}</span></p>
       <p><strong>Alert Type:</strong> ${alertType}</p>
       <div style="background:#f1f5f9; padding:16px; border-radius:8px; font-family:monospace;">${messageText}</div>`,
    );
    const text = `[SYSTEM ALERT] ${severity}: ${alertType} - ${messageText}`;
    return { subject, html, text };
  }
}
