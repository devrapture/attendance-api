import {
  LogLevel,
  NodeEnvironment,
  ValidatedEnvironment,
} from './environment.schema.js';

export const APP_CONFIG = Symbol('APP_CONFIG');

export interface AppConfig {
  readonly environment: NodeEnvironment;
  readonly port: number;
  readonly logLevel: LogLevel;
  readonly database_url: string;
}

export const createAppConfig = (environment: ValidatedEnvironment): AppConfig =>
  Object.freeze({
    environment: environment.NODE_ENV,
    port: environment.PORT,
    logLevel: environment.LOG_LEVEL,
    database_url: environment.DATABASE_URL,
  });
