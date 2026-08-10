import { Injectable, Logger } from '@nestjs/common';
import { IEmailProvider, EmailPayload, EmailSendResult } from './email-provider.interface';

@Injectable()
export class SmtpEmailProvider implements IEmailProvider {
  readonly name = 'SMTP';
  private readonly logger = new Logger(SmtpEmailProvider.name);
  private readonly host = process.env.SMTP_HOST || 'smtp.mailtrap.io';
  private readonly port = parseInt(process.env.SMTP_PORT || '2525', 10);

  async sendEmail(payload: EmailPayload): Promise<EmailSendResult> {
    const messageId = `smtp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.logger.log(
      `[SMTP DISPATCH (${this.host}:${this.port})] To: ${payload.to} | Subject: "${payload.subject}" | MessageId: ${messageId}`,
    );
    return {
      success: true,
      messageId,
      provider: this.name,
    };
  }
}
