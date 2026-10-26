import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module.js';

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
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
