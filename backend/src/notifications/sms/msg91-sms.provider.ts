import { Injectable, Logger } from '@nestjs/common';
import { ISmsProvider, SmsPayload, SmsSendResult } from './sms-provider.interface';

@Injectable()
export class Msg91SmsProvider implements ISmsProvider {
  readonly name = 'MSG91';
  private readonly logger = new Logger(Msg91SmsProvider.name);
  private readonly authKey = process.env.MSG91_AUTH_KEY || 'msg91_sandbox_key';

  async sendSms(payload: SmsPayload): Promise<SmsSendResult> {
    const messageId = `msg91_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.logger.log(
      `[MSG91 DISPATCH (AuthKey: ${this.authKey.substring(0, 6)}...)] Phone: ${payload.to} | Template: ${payload.templateId || 'N/A'} | MessageId: ${messageId}`,
    );
    return {
      success: true,
      messageId,
      provider: this.name,
    };
  }
}
