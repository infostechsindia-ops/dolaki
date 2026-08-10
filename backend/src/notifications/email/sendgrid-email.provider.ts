import { Injectable, Logger } from '@nestjs/common';
import { IEmailProvider, EmailPayload, EmailSendResult } from './email-provider.interface';

@Injectable()
export class SendGridEmailProvider implements IEmailProvider {
  readonly name = 'SENDGRID';
  private readonly logger = new Logger(SendGridEmailProvider.name);
  private readonly apiKey = process.env.SENDGRID_API_KEY || 'SG.sandbox_mock_key';

  async sendEmail(payload: EmailPayload): Promise<EmailSendResult> {
    const messageId = `sg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.logger.log(
      `[SENDGRID DISPATCH (API Key: ${this.apiKey.substring(0, 5)}...)] To: ${payload.to} | Subject: "${payload.subject}" | MessageId: ${messageId}`,
    );
    return {
      success: true,
      messageId,
      provider: this.name,
    };
  }
}
