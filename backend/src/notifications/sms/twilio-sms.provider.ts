import { Injectable, Logger } from '@nestjs/common';
import { ISmsProvider, SmsPayload, SmsSendResult } from './sms-provider.interface';

@Injectable()
export class TwilioSmsProvider implements ISmsProvider {
  readonly name = 'TWILIO';
  private readonly logger = new Logger(TwilioSmsProvider.name);
  private readonly accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC_sandbox_mock_sid';

  async sendSms(payload: SmsPayload): Promise<SmsSendResult> {
    const messageId = `SM_tw_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.logger.log(
      `[TWILIO DISPATCH (SID: ${this.accountSid.substring(0, 6)}...)] Phone: ${payload.to} | Message: "${payload.message}" | MessageId: ${messageId}`,
    );
    return {
      success: true,
      messageId,
      provider: this.name,
    };
  }
}
