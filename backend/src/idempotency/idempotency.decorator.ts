import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { IdempotencyInterceptor } from './idempotency.interceptor';

export const IDEMPOTENCY_METADATA_KEY = 'IDEMPOTENCY_METADATA_KEY';

export interface IdempotentOptions {
  operation: string;
  required?: boolean; // If true, missing header returns 400 IDEMPOTENCY_KEY_REQUIRED
  ttlSeconds?: number; // Retention TTL, default 86400 (24h)
}

export const Idempotent = (options: IdempotentOptions) =>
  applyDecorators(
    SetMetadata(IDEMPOTENCY_METADATA_KEY, options),
    UseInterceptors(IdempotencyInterceptor),
  );
