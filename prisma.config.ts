import 'dotenv/config';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';
import { definePrismaConfig } from 'prisma/config';

type PrismaConfig = ReturnType<
  typeof definePrismaConfig<{
    orm: ReturnType<typeof ormConfig>;
  }>
>;

const config: PrismaConfig = definePrismaConfig({
  orm: ormConfig({
    contract: './src/prisma/contract.prisma',
    db: {
      connection: process.env['DATABASE_URL'],
    },
  }),
});

export default config;
