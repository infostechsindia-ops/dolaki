export interface PushPayload {
  tokens: string[];
  title: string;
  body: string;
  category?: string;
  badge?: number;
  sound?: string;
  isSilent?: boolean;
  deepLinkUrl?: string;
  data?: Record<string, any>;
  topic?: string;
}

export interface PushSendResult {
  success: boolean;
  sentCount: number;
  failedCount: number;
  provider: string;
  ticketIds?: string[];
  errors?: string[];
}

export interface IPushProvider {
  readonly name: string;
  sendPush(payload: PushPayload): Promise<PushSendResult>;
  subscribeToTopic?(tokens: string[], topic: string): Promise<boolean>;
  unsubscribeFromTopic?(tokens: string[], topic: string): Promise<boolean>;
}
