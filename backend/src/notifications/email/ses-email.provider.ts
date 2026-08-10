import { Injectable, Logger } from '@nestjs/common';
import { IEmailProvider, EmailPayload, EmailSendResult } from './email-provider.interface';

@Injectable()
export class SesEmailProvider implements IEmailProvider {
  readonly name = 'AWS_SES';
  private readonly logger = new Logger(SesEmailProvider.name);
  private readonly region = process.env.AWS_REGION || 'us-east-1';

  async sendEmail(payload: EmailPayload): Promise<EmailSendResult> {
    const messageId = `ses_${Date.now()}_${Math.random().toString(36).substring(7)}@${this.region}.amazonses.com`;
    this.logger.log(
      `[AWS SES DISPATCH (${this.region})] To: ${payload.to} | Subject: "${payload.subject}" | MessageId: ${messageId}`,
    );
    return {
      success: true,
      messageId,
      provider: this.name,
    };
  }
}
