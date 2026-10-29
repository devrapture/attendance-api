import postgres, { type PostgresClient } from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import 'temporal-polyfill/full/global';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

const contract = contractFromJson<Contract>(contractJson);

export type DatabaseClient = PostgresClient<Contract>;

export const createDatabaseClient = (url: string): DatabaseClient =>
  postgres<Contract>({
    contract,
    url,
  });

export type TransactionClient = Parameters<
  Parameters<DatabaseClient['transaction']>[0]
>[0];
