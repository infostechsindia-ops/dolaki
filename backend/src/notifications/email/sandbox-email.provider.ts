import { Injectable, Logger } from '@nestjs/common';
import { IEmailProvider, EmailPayload, EmailSendResult } from './email-provider.interface';

@Injectable()
export class SandboxEmailProvider implements IEmailProvider {
  readonly name = 'SANDBOX';
  private readonly logger = new Logger(SandboxEmailProvider.name);

  async sendEmail(payload: EmailPayload): Promise<EmailSendResult> {
    const messageId = `sbx_msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.logger.log(
      `[SANDBOX EMAIL] To: ${payload.to} | Subject: "${payload.subject}" | MessageId: ${messageId}`,
    );
    return {
      success: true,
      messageId,
      provider: this.name,
    };
  }
}
