import { Injectable, Logger } from '@nestjs/common';
import { ISmsProvider, SmsPayload, SmsSendResult } from './sms-provider.interface';

@Injectable()
export class SandboxSmsProvider implements ISmsProvider {
  readonly name = 'SANDBOX';
  private readonly logger = new Logger(SandboxSmsProvider.name);

  async sendSms(payload: SmsPayload): Promise<SmsSendResult> {
    const messageId = `sms_sbx_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.logger.log(`[SANDBOX SMS] Phone: ${payload.to} | Message: "${payload.message}" | MessageId: ${messageId}`);
    return {
      success: true,
      messageId,
      provider: this.name,
    };
  }
}
