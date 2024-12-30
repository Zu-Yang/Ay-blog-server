import Redis from 'ioredis';
import { Controller, Get, Query, Param, Post, Body } from '@nestjs/common';
import { RedisService } from './redis.service';
import type { readCount } from './type/type';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Post('readCount')
  async articleReadCount(@Body() params: readCount) {
    const data = await this.redisService.articleReadCount(params);

    return data;
  }
}
