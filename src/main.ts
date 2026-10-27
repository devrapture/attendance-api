import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module.js';
import { APP_CONFIG, AppConfig } from './config/app-config.js';

const ONE_MEGABYTE = 1_048_576;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: ONE_MEGABYTE,
      trustProxy: false,
    }),
    {
      bufferLogs: true,
      rawBody: true,
      routeConflictPolicy: { duplicate: 'error', shadow: 'warn' },
      routeResolutionStrategy: 'specificity',
    },
  );
  app.setGlobalPrefix('api', {
    exclude: ['/healthz', '/readyz'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableShutdownHooks();
  const config = app.get<AppConfig>(APP_CONFIG);
  await app.listen(config.port, '0.0.0.0');
}
await bootstrap();
