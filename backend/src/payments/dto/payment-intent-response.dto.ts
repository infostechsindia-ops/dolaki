import { PaymentIntentStatus, PaymentAttemptStatus } from '../../database/entities';

export interface PaymentAttemptDto {
  id: string;
  provider: string;
  providerAttemptId?: string;
  status: PaymentAttemptStatus;
  failureCode?: string;
  failureMessage?: string;
  createdAt: Date;
}

export interface PaymentIntentResponseDto {
  id: string;
  customerId: string;
  cartId?: string;
  amountMinor: number;
  formattedAmount: string;
  currency: string;
  paymentMethod: string;
  provider: string;
  status: PaymentIntentStatus;
  idempotencyKey?: string;
  clientSecret?: string;
  requiresAction: boolean;
  actionType?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
  attempts?: PaymentAttemptDto[];
  createdAt: Date;
  updatedAt: Date;
}
