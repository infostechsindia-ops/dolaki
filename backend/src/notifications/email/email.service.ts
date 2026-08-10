import { Injectable, Logger } from '@nestjs/common';
import { IEmailProvider, EmailPayload, EmailSendResult } from './email-provider.interface';
import { SandboxEmailProvider } from './sandbox-email.provider';
import { SmtpEmailProvider } from './smtp-email.provider';
import { SendGridEmailProvider } from './sendgrid-email.provider';
import { SesEmailProvider } from './ses-email.provider';
import { EmailTemplatesService, RenderedEmail } from './email-templates.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly providers: Map<string, IEmailProvider> = new Map();

  constructor(
    private readonly sandboxProvider: SandboxEmailProvider,
    private readonly smtpProvider: SmtpEmailProvider,
    private readonly sendgridProvider: SendGridEmailProvider,
    private readonly sesProvider: SesEmailProvider,
    public readonly templates: EmailTemplatesService,
  ) {
    this.providers.set('SANDBOX', sandboxProvider);
    this.providers.set('SMTP', smtpProvider);
    this.providers.set('SENDGRID', sendgridProvider);
    this.providers.set('AWS_SES', sesProvider);
    this.providers.set('SES', sesProvider);
  }

  private getProvider(): IEmailProvider {
    const configured = (process.env.EMAIL_PROVIDER || 'SANDBOX').toUpperCase();
    return this.providers.get(configured) || this.sandboxProvider;
  }

  async sendEmail(payload: EmailPayload): Promise<EmailSendResult> {
    const provider = this.getProvider();
    this.logger.log(`Dispatching email to ${payload.to} using provider: ${provider.name}`);
    return provider.sendEmail(payload);
  }

  async sendTemplateEmail(
    to: string,
    rendered: RenderedEmail,
    metadata?: Record<string, any>,
  ): Promise<EmailSendResult> {
    return this.sendEmail({
      to,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      metadata,
    });
  }
}
