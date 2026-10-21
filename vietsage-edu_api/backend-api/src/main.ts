import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppLogger } from './common/logger/app-logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);
  const logger = app.get(AppLogger);

  app.useLogger(logger);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // Cho phép CORS cho frontend web Vite (5173, 4173) và client dev
  app.enableCors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (như curl, mobile apps, Postman) hoặc bất kỳ origin localhost/web nào
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const apiPrefix = config.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  const port = config.get<number>('PORT', 3000);
  const devTunnel = config.get<string>('DEV_TUNNEL_URL');
  await app.listen(port, '0.0.0.0');
  logger.log(
    `Vietsage Education Backend API đang chạy tại: http://localhost:${port}/${apiPrefix}${devTunnel ? ` | Dev Tunnel: ${devTunnel}/${apiPrefix}` : ''}`,
    'Bootstrap',
  );
}
void bootstrap();
