import { Injectable, LoggerService } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class AppLogger implements LoggerService {
  private readonly appLogger: winston.Logger;
  private readonly hn212Logger: winston.Logger;

  constructor() {
    // Ưu tiên đọc từ biến môi trường LOG_DIR; mặc định trỏ ra thư mục backend-logs cùng cấp với backend-api
    const defaultLogDir = path.resolve(process.cwd(), '../backend-logs');
    const logDir = process.env.LOG_DIR || (fs.existsSync(defaultLogDir) ? defaultLogDir : path.resolve(process.cwd(), 'logs'));
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      winston.format.printf(({ timestamp, level, message, context, stack }) => {
        const ctx = context ? `[${context}] ` : '';
        const stk = stack ? `\n${stack}` : '';
        return `${timestamp} [${level.toUpperCase()}] ${ctx}${message}${stk}`;
      }),
    );

    // Logger chính của toàn bộ ứng dụng
    this.appLogger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      transports: [
        // Ghi ra màn hình console
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message, context }) => {
              const ctx = context ? `[${context}] ` : '';
              return `${timestamp} ${level}: ${ctx}${message}`;
            }),
          ),
        }),
        // Ghi file xoay vòng hằng ngày cho toàn bộ log
        new winston.transports.DailyRotateFile({
          dirname: logDir,
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
        // Ghi riêng các log cảnh báo và lỗi hệ thống
        new winston.transports.DailyRotateFile({
          level: 'error',
          dirname: logDir,
          filename: 'error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
        }),
      ],
    });

    // Logger chuyên dụng riêng cho các sự kiện tiếp nhận từ thiết bị HN212
    this.hn212Logger = winston.createLogger({
      level: 'info',
      format: logFormat,
      transports: [
        new winston.transports.DailyRotateFile({
          dirname: logDir,
          filename: 'hn212-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.appLogger.info(message, { context });
  }

  error(message: string, stack?: string, context?: string) {
    this.appLogger.error(message, { stack, context });
  }

  warn(message: string, context?: string) {
    this.appLogger.warn(message, { context });
  }

  debug?(message: string, context?: string) {
    this.appLogger.debug(message, { context });
  }

  verbose?(message: string, context?: string) {
    this.appLogger.verbose(message, { context });
  }

  /**
   * Ghi log chuyên biệt cho sự kiện thiết bị HN212
   */
  logHn212Event(eventInfo: { eventId: string; deviceCode?: string; method: string; direction: string; duplicate: boolean; raw?: unknown }) {
    const status = eventInfo.duplicate ? 'TRÙNG LẶP' : 'GHI NHẬN MỚI';
    const msg = `[HN212] ${status} - EventID: ${eventInfo.eventId} | Thiết bị: ${eventInfo.deviceCode || 'N/A'} | Hình thức: ${eventInfo.method} | Chiều: ${eventInfo.direction}`;
    this.hn212Logger.info(msg);
    this.appLogger.info(msg, { context: 'HN212' });
  }
}
