export interface SmsPayload {
  to: string;
  message: string;
  templateId?: string;
  metadata?: Record<string, any>;
}

export interface SmsSendResult {
  success: boolean;
  messageId?: string;
  provider: string;
  error?: string;
}

export interface ISmsProvider {
  readonly name: string;
  sendSms(payload: SmsPayload): Promise<SmsSendResult>;
}
