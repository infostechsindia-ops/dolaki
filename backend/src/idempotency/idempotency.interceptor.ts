import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of, from, throwError } from 'rxjs';
import { concatMap, catchError } from 'rxjs/operators';
import {
  IDEMPOTENCY_METADATA_KEY,
  IdempotentOptions,
} from './idempotency.decorator';
import { IdempotencyService } from './idempotency.service';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly idempotencyService: IdempotencyService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const options = this.reflector.get<IdempotentOptions>(
      IDEMPOTENCY_METADATA_KEY,
      context.getHandler(),
    );

    // If endpoint is not decorated with @Idempotent(), proceed normally
    if (!options) {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    // Extract header (case-insensitive: Idempotency-Key or X-Idempotency-Key)
    const rawHeader =
      req.headers['idempotency-key'] || req.headers['x-idempotency-key'];
    const idempotencyKey = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

    // Required check
    if (!idempotencyKey || !idempotencyKey.trim()) {
      if (options.required) {
        throw new BadRequestException({
          code: 'IDEMPOTENCY_KEY_REQUIRED',
          message: "Header 'Idempotency-Key' is required for this operation.",
        });
      }
      // If optional and not provided, proceed without idempotency
      return next.handle();
    }

    // Format validation
    if (!this.idempotencyService.isValidKeyFormat(idempotencyKey)) {
      throw new BadRequestException({
        code: 'IDEMPOTENCY_KEY_INVALID',
        message:
          'Invalid Idempotency-Key format or length exceeds 128 characters.',
      });
    }

    // Determine tenant or actor identity authoritatively
    const actorOrTenantId =
      req.params?.shopId ||
      req.params?.vendorId ||
      req.user?.userId ||
      req.user?.sub ||
      'ANONYMOUS';

    const scopedKey = this.idempotencyService.buildScopedKey(
      actorOrTenantId,
      options.operation,
      idempotencyKey,
    );

    const fingerprint = this.idempotencyService.computeFingerprint(
      req.method,
      req.route?.path || req.url,
      req.query,
      req.params,
      req.body,
    );

    // Check database for existing record
    const existing = await this.idempotencyService.findByScopedKey(scopedKey);

    if (existing) {
      // Check if key is expired
      if (existing.expiresAt && new Date(existing.expiresAt) < new Date()) {
        // Key expired: remove expired entry and re-claim
        await this.idempotencyService.deleteKey(scopedKey);
      } else if (existing.status === 'PROCESSING') {
        throw new ConflictException({
          code: 'IDEMPOTENCY_CONCURRENT_REQUEST',
          message:
            'A request with this idempotency key is currently processing. Please try again shortly.',
        });
      } else if (existing.status === 'COMPLETED') {
        // Payload mismatch check
        if (existing.requestHash !== fingerprint) {
          throw new ConflictException({
            code: 'IDEMPOTENCY_PAYLOAD_MISMATCH',
            message:
              'Idempotency key was previously used with a different request payload.',
          });
        }

        // Replay cached response
        const statusCode = existing.statusCode || HttpStatus.OK;
        res.status(statusCode);

        let parsedBody: any = existing.responseBody;
        if (typeof existing.responseBody === 'string') {
          try {
            parsedBody = JSON.parse(existing.responseBody);
          } catch (e) {
            parsedBody = existing.responseBody;
          }
        }
        return of(parsedBody);
      } else if (existing.status === 'FAILED') {
        throw new ConflictException({
          code: 'IDEMPOTENCY_FAILED_STATE',
          message:
            'This idempotent request previously failed after side effects were committed and cannot be retried with the same key.',
        });
      }
    }

    // Atomic claim via DB insert with unique constraint
    const claimed = await this.idempotencyService.claimKey(
      scopedKey,
      req.user?.userId || 'ANONYMOUS',
      options.operation,
      idempotencyKey,
      fingerprint,
      options.ttlSeconds || 86400,
    );

    if (!claimed) {
      throw new ConflictException({
        code: 'IDEMPOTENCY_CONCURRENT_REQUEST',
        message:
          'A request with this idempotency key is currently processing. Please try again shortly.',
      });
    }

    // Execute business logic handler and await DB completion before returning stream
    return next.handle().pipe(
      concatMap(async (responseBody) => {
        const statusCode = res.statusCode || HttpStatus.OK;
        await this.idempotencyService.completeKey(
          scopedKey,
          statusCode,
          responseBody,
        );
        return responseBody;
      }),
      catchError((err) => {
        return from(
          (async () => {
            const isClientError =
              err instanceof HttpException &&
              err.getStatus() < 500 &&
              err.getStatus() !== 409;

            try {
              if (isClientError) {
                await this.idempotencyService.deleteKey(scopedKey);
              } else {
                const statusCode =
                  err instanceof HttpException
                    ? err.getStatus()
                    : HttpStatus.INTERNAL_SERVER_ERROR;
                const errorResponse = err.response || {
                  message: err.message || 'Internal server error',
                };
                await this.idempotencyService.failKey(
                  scopedKey,
                  statusCode,
                  errorResponse,
                );
              }
            } catch (cleanupErr) {
              // Ignore metadata persistence failures so the primary domain exception is always preserved
            }
            throw err;
          })(),
        );
      }),
    );
  }
}
