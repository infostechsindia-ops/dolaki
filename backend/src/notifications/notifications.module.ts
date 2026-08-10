import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken, NotificationPreference } from '../database/entities';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

// Email Providers & Services
import { SandboxEmailProvider } from './email/sandbox-email.provider';
import { SmtpEmailProvider } from './email/smtp-email.provider';
import { SendGridEmailProvider } from './email/sendgrid-email.provider';
import { SesEmailProvider } from './email/ses-email.provider';
import { EmailTemplatesService } from './email/email-templates.service';
import { EmailService } from './email/email.service';

// SMS Providers & Services
import { SandboxSmsProvider } from './sms/sandbox-sms.provider';
import { TwilioSmsProvider } from './sms/twilio-sms.provider';
import { Msg91SmsProvider } from './sms/msg91-sms.provider';
import { TextLocalSmsProvider } from './sms/textlocal-sms.provider';
import { SmsService } from './sms/sms.service';

// Push Providers & Services
import { SandboxPushProvider } from './push/sandbox-push.provider';
import { FcmpushProvider } from './push/fcm-push.provider';
import { ApnsPushProvider } from './push/apns-push.provider';
import { ExpoPushProvider } from './push/expo-push.provider';
import { PushService } from './push/push.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceToken, NotificationPreference])],
  providers: [
    NotificationsService,
    // Email
    SandboxEmailProvider,
    SmtpEmailProvider,
    SendGridEmailProvider,
    SesEmailProvider,
    EmailTemplatesService,
    EmailService,
    // SMS
    SandboxSmsProvider,
    TwilioSmsProvider,
    Msg91SmsProvider,
    TextLocalSmsProvider,
    SmsService,
    // Push
    SandboxPushProvider,
    FcmpushProvider,
    ApnsPushProvider,
    ExpoPushProvider,
    PushService,
  ],
  controllers: [NotificationsController],
  exports: [NotificationsService, EmailService, SmsService, PushService],
})
export class NotificationsModule {}
