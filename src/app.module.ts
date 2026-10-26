import { Module } from '@nestjs/common';
import { PlatformConfigModule } from './config/platform-config.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [PlatformConfigModule, PrismaModule],
})
export class AppModule {}
