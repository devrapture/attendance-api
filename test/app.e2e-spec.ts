import { RequestMethod, VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';

describe('Health endpoints (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
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

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /healthz reports the process as live', async () => {
    const response = await request(app.getHttpServer())
      .get('/healthz')
      .expect(200);

    expect(response.body).toMatchObject({
      status: 'ok',
      service: 'attendance-api',
      checks: {
        process: 'up',
      },
    });
    expect(typeof response.body.checked_at).toBe('string');
    expect(typeof response.body.uptime_seconds).toBe('number');
  });

  it('GET /readyz reports the database as ready', async () => {
    const response = await request(app.getHttpServer())
      .get('/readyz')
      .expect(200);

    expect(response.body).toMatchObject({
      status: 'ok',
      service: 'attendance-api',
      checks: {
        process: 'up',
        database: 'up',
      },
    });
  });

  it('does not expose health endpoints under the versioned API prefix', async () => {
    await request(app.getHttpServer()).get('/api/healthz').expect(404);
  });
});
