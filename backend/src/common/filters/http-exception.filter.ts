import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected error occurred';
    let details: any[] | undefined = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();

      code = this.getErrorCodeForStatus(status);

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        if (res.code && typeof res.code === 'string') {
          code = res.code;
        }
        if (res.message) {
          if (Array.isArray(res.message)) {
            message = 'Validation failed';
            code = 'VALIDATION_ERROR';
            details = res.message.map((msg: any) => {
              if (typeof msg === 'string') {
                return { message: msg };
              }
              return msg;
            });
          } else {
            message = res.message;
          }
        }
        if (res.error && !res.code) {
          // Standard NestJS default format: { statusCode, error, message }
          if (res.error === 'Bad Request' && code === 'BAD_REQUEST') {
            code = 'VALIDATION_ERROR';
          }
        }
        if (res.details && Array.isArray(res.details)) {
          details = res.details;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    });
  }

  private getErrorCodeForStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'TOO_MANY_REQUESTS';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'UNPROCESSABLE_ENTITY';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}
