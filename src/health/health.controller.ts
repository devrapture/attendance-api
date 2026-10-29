import {
  Controller,
  Get,
  HttpStatus,
  Res,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { HealthService } from './health.service.js';
import { type FastifyReply } from 'fastify';

@Controller({ version: VERSION_NEUTRAL })
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('/healthz')
  getLiveness() {
    return this.healthService.getLiveness();
  }

  @Get('/readyz')
  async getReadiness(
    @Res({
      passthrough: true,
    })
    reply: FastifyReply,
  ) {
    const response = await this.healthService.getReadiness();
    if (response.status === 'unavailable') {
      reply.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
    return response;
  }
}
