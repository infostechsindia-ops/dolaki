import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BYPASS_ENVELOPE_KEY } from '../decorators/bypass-envelope.decorator';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const bypass = this.reflector.getAllAndOverride<boolean>(
      BYPASS_ENVELOPE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (bypass) {
      return next.handle();
    }

    const response = context.switchToHttp().getResponse();
    if (response.statusCode === 204) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // If data is null or undefined
        if (data === null || data === undefined) {
          return { data: null };
        }

        // If response is already an envelope (e.g. has data & meta, or data key)
        if (
          typeof data === 'object' &&
          'data' in data &&
          !Array.isArray(data)
        ) {
          return data;
        }

        // Standard wrapping into { data: ... }
        return { data };
      }),
    );
  }
}
