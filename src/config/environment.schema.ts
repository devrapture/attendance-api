import Joi from 'joi';

export const NODE_ENVIRONMENTS = ['development', 'test', 'production'] as const;

export type NodeEnvironment = (typeof NODE_ENVIRONMENTS)[number];

export const LOG_LEVELS = [
  'fatal',
  'error',
  'warn',
  'info',
  'debug',
  'trace',
  'silent',
] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];

export interface ValidatedEnvironment {
  readonly NODE_ENV: NodeEnvironment;
  readonly PORT: number;
  readonly LOG_LEVEL: LogLevel;
  readonly DATABASE_URL: string;
  readonly JWT_ACCESS_SECRET: string;
  readonly JWT_REFRESH_SECRET: string;
  readonly JWT_ISSUER: string;
  readonly JWT_AUDIENCE: string;
  readonly JWT_ACCESS_TTL_SECONDS: number;
  readonly JWT_REFRESH_TTL_SECONDS: number;
  readonly PASSWORD_RESET_TTL_SECONDS: number;
}

export const environmentSchema = Joi.object<ValidatedEnvironment>({
  NODE_ENV: Joi.string()
    .valid(...NODE_ENVIRONMENTS)
    .default('development'),
  PORT: Joi.number().integer().min(1).max(65_535).default(3000),
  LOG_LEVEL: Joi.when('NODE_ENV', {
    switch: [
      {
        is: 'production',
        then: Joi.string().valid('info').default('info'),
      },
      {
        is: 'development',
        then: Joi.string().valid('debug').default('debug'),
      },
    ],
    otherwise: Joi.string()
      .valid(...LOG_LEVELS)
      .default('silent'),
  }),
  DATABASE_URL: Joi.string()
    .trim()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .required()
    .messages({
      'string.uri': 'DATABASE_URL must be a valid PostgreSQL connection URL.',
      'string.uriCustomScheme':
        'DATABASE_URL must use the postgres or postgresql scheme.',
    }),
  JWT_ACCESS_SECRET: Joi.string().min(32).max(256).required(),

  JWT_REFRESH_SECRET: Joi.string()
    .min(32)
    .max(256)
    .required()
    .invalid(Joi.ref('JWT_ACCESS_SECRET'))
    .messages({
      'any.invalid': 'Access and refresh signing secrets must be different.',
    }),

  JWT_ISSUER: Joi.string().trim().min(1).max(200).required(),

  JWT_AUDIENCE: Joi.string().trim().min(1).max(200).required(),

  JWT_ACCESS_TTL_SECONDS: Joi.number()
    .integer()
    .positive()
    .max(86_400)
    .default(900),

  JWT_REFRESH_TTL_SECONDS: Joi.number()
    .integer()
    .positive()
    .max(31_536_000)
    .default(2_592_000),

  PASSWORD_RESET_TTL_SECONDS: Joi.number()
    .integer()
    .positive()
    .max(86_400)
    .default(1_800),
});
