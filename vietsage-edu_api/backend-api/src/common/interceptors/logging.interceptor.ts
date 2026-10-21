import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { AppLogger } from '../logger/app-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '-';
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - now;
          const statusCode = res.statusCode;
          this.logger.log(
            `HTTP ${method} ${originalUrl} ${statusCode} - ${duration}ms | IP: ${ip} | UA: ${userAgent}`,
            'HTTP',
          );
        },
        error: (err: Error & { status?: number; statusCode?: number }) => {
          const duration = Date.now() - now;
          const status = err.status || err.statusCode || 500;
          this.logger.error(
            `HTTP ${method} ${originalUrl} ${status} - ${duration}ms | IP: ${ip} | Error: ${err.message}`,
            err.stack,
            'HTTP',
          );
        },
      }),
    );
  }
}
