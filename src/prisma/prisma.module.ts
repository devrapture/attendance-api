import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { PlatformConfigModule } from '../config/platform-config.module.js';

@Global()
@Module({
  imports: [PlatformConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
