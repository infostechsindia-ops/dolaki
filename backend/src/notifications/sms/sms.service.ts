import { Injectable, Logger } from '@nestjs/common';
import { ISmsProvider, SmsPayload, SmsSendResult } from './sms-provider.interface';
import { SandboxSmsProvider } from './sandbox-sms.provider';
import { TwilioSmsProvider } from './twilio-sms.provider';
import { Msg91SmsProvider } from './msg91-sms.provider';
import { TextLocalSmsProvider } from './textlocal-sms.provider';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly providers: Map<string, ISmsProvider> = new Map();

  constructor(
    private readonly sandboxProvider: SandboxSmsProvider,
    private readonly twilioProvider: TwilioSmsProvider,
    private readonly msg91Provider: Msg91SmsProvider,
    private readonly textlocalProvider: TextLocalSmsProvider,
  ) {
    this.providers.set('SANDBOX', sandboxProvider);
    this.providers.set('TWILIO', twilioProvider);
    this.providers.set('MSG91', msg91Provider);
    this.providers.set('TEXTLOCAL', textlocalProvider);
  }

  private getProvider(): ISmsProvider {
    const configured = (process.env.SMS_PROVIDER || 'SANDBOX').toUpperCase();
    return this.providers.get(configured) || this.sandboxProvider;
  }

  async sendSms(payload: SmsPayload): Promise<SmsSendResult> {
    const provider = this.getProvider();
    this.logger.log(`Dispatching SMS to ${payload.to} via ${provider.name}`);
    return provider.sendSms(payload);
  }

  // 1. OTP SMS
  async sendOtpSms(phone: string, otp: string): Promise<SmsSendResult> {
    const message = `Your AuraMart verification code is ${otp}. Valid for 10 mins. Do not share code with anyone.`;
    return this.sendSms({ to: phone, message, templateId: 'tpl_otp_ver' });
  }

  // 2. Order Updates SMS
  async sendOrderUpdateSms(phone: string, orderNumber: string, status: string): Promise<SmsSendResult> {
    const message = `AuraMart Alert: Order #${orderNumber} is now ${status.replace(/_/g, ' ')}. Track at auramart.local/orders/${orderNumber}`;
    return this.sendSms({ to: phone, message, templateId: 'tpl_order_update' });
  }

  // 3. Delivery OTP SMS
  async sendDeliveryOtpSms(phone: string, orderNumber: string, deliveryOtp: string): Promise<SmsSendResult> {
    const message = `Flado Delivery Code for Order #${orderNumber} is ${deliveryOtp}. Share code ONLY with rider at doorstep.`;
    return this.sendSms({ to: phone, message, templateId: 'tpl_delivery_otp' });
  }

  // 4. Support Ticket SMS
  async sendSupportSms(phone: string, ticketNumber: string, status: string): Promise<SmsSendResult> {
    const message = `AuraMart Support: Ticket #${ticketNumber} updated to ${status}. Details: auramart.local/profile/support`;
    return this.sendSms({ to: phone, message, templateId: 'tpl_support' });
  }

  // 5. Vendor Alert SMS
  async sendVendorAlertSms(phone: string, storeName: string, alertText: string): Promise<SmsSendResult> {
    const message = `AuraMart Vendor [${storeName}]: ${alertText}`;
    return this.sendSms({ to: phone, message, templateId: 'tpl_vendor_alert' });
  }
}
