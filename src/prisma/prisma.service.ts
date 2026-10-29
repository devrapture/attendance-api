import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { APP_CONFIG, type AppConfig } from '../config/app-config.js';
import { createDatabaseClient, type DatabaseClient } from './db.js';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  readonly db: DatabaseClient;

  constructor(
    @Inject(APP_CONFIG) appConfig: AppConfig,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(PrismaService.name);
    this.db = createDatabaseClient(appConfig.database_url);
  }

  async onModuleInit() {
    try {
      this.logger.info('Connecting to the database');
      await this.db.connect();
      this.logger.info('Database connection successful');
    } catch (error) {
      this.logger.error({ err: error }, 'Failed to connect to database');
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.db.close();
  }

  async ping(signal: AbortSignal): Promise<void> {
    const query = this.db.raw.sql`SELECT 1 AS ok`
      .returnsRow({ ok: 'pg/int4@1' })
      .build();

    await this.db.query(query, { signal }).firstOrThrow();
  }
}
