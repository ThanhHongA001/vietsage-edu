import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  // Chuẩn hóa lỗi của mọi endpoint về cùng một định dạng JSON.
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
    const message = typeof exceptionResponse === 'string'
      ? exceptionResponse
      : (exceptionResponse as { message?: string | string[] } | null)?.message ?? 'Lỗi máy chủ nội bộ';
    if (status >= 500) this.logger.error(`${request.method} ${request.url}`, exception instanceof Error ? exception.stack : String(exception));
    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      error: status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
