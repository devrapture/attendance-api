import { FactoryProvider, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { ValidatedEnvironment } from './environment.schema';
import { environmentSchema } from './environment.schema.js';
import { APP_CONFIG, createAppConfig } from './app-config.js';

const readValidatedEnvironment = (
  config: ConfigService<ValidatedEnvironment, true>,
): ValidatedEnvironment => ({
  NODE_ENV: config.getOrThrow('NODE_ENV', {
    infer: true,
  }),
  LOG_LEVEL: config.getOrThrow('LOG_LEVEL', {
    infer: true,
  }),
  PORT: config.getOrThrow('PORT', {
    infer: true,
  }),
  DATABASE_URL: config.getOrThrow('DATABASE_URL', {
    infer: true,
  }),
  JWT_ACCESS_SECRET: config.getOrThrow('JWT_ACCESS_SECRET', {
    infer: true,
  }),
  JWT_REFRESH_SECRET: config.getOrThrow('JWT_REFRESH_SECRET', {
    infer: true,
  }),
  JWT_ISSUER: config.getOrThrow('JWT_ISSUER', {
    infer: true,
  }),
  JWT_AUDIENCE: config.getOrThrow('JWT_AUDIENCE', {
    infer: true,
  }),
  JWT_ACCESS_TTL_SECONDS: config.getOrThrow('JWT_ACCESS_TTL_SECONDS', {
    infer: true,
  }),
  JWT_REFRESH_TTL_SECONDS: config.getOrThrow('JWT_REFRESH_TTL_SECONDS', {
    infer: true,
  }),
  PASSWORD_RESET_TTL_SECONDS: config.getOrThrow('PASSWORD_RESET_TTL_SECONDS', {
    infer: true,
  }),
});

const appConfigProvider: FactoryProvider = {
  provide: APP_CONFIG,
  inject: [ConfigService],
  useFactory: (configService: ConfigService<ValidatedEnvironment, true>) =>
    createAppConfig(readValidatedEnvironment(configService)),
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: false,
      validationSchema: environmentSchema,
      validationOptions: {
        libraryOptions: {
          abortEarly: false,
          allowUnknown: true,
        },
      },
    }),
  ],
  providers: [appConfigProvider],
  exports: [APP_CONFIG],
})
export class PlatformConfigModule {}
