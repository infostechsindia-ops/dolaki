import { Injectable, Logger } from '@nestjs/common';
import { ISmsProvider, SmsPayload, SmsSendResult } from './sms-provider.interface';

@Injectable()
export class TextLocalSmsProvider implements ISmsProvider {
  readonly name = 'TEXTLOCAL';
  private readonly logger = new Logger(TextLocalSmsProvider.name);
  private readonly apiKey = process.env.TEXTLOCAL_API_KEY || 'textlocal_sandbox_key';

  async sendSms(payload: SmsPayload): Promise<SmsSendResult> {
    const messageId = `tl_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.logger.log(
      `[TEXTLOCAL DISPATCH] Phone: ${payload.to} | Message: "${payload.message}" | MessageId: ${messageId}`,
    );
    return {
      success: true,
      messageId,
      provider: this.name,
    };
  }
}
