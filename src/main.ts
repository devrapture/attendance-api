import {
  RequestMethod,
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { RawRequestDefaultExpression, RawServerBase } from 'fastify';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module.js';
import { APP_CONFIG, AppConfig } from './config/app-config.js';
import {
  REQUEST_ID_HEADER,
  resolveRequestId,
} from './common/http/request-id.js';
import { GlobalExceptionFilter } from './common/error/http-exception.filter.js';
// import fastifyCookie from '@fastify/cookie';

const ONE_MEGABYTE = 1_048_576;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: ONE_MEGABYTE,
      trustProxy: false,
      genReqId: (request: RawRequestDefaultExpression<RawServerBase>) =>
        resolveRequestId(request.headers[REQUEST_ID_HEADER]),
    }),
    {
      bufferLogs: true,
      rawBody: true,
      routeConflictPolicy: { duplicate: 'error', shadow: 'warn' },
      routeResolutionStrategy: 'specificity',
    },
  );
  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: '/healthz',
        method: RequestMethod.GET,
        version: VERSION_NEUTRAL,
      },
      {
        path: '/readyz',
        method: RequestMethod.GET,
        version: VERSION_NEUTRAL,
      },
    ],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableShutdownHooks();
  const logger = app.get(Logger);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  // await app.register(fastifyCookie);

  app.useLogger(logger);
  const config = app.get<AppConfig>(APP_CONFIG);
  await app.listen(config.port, '0.0.0.0');
  logger.log(
    `Attendance API listening on port ${config.port} ${config.environment}`,
  );
}
await bootstrap();
