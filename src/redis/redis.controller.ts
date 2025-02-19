import Redis from 'ioredis';
import { Controller, Get, Query, Post, Body, Request } from '@nestjs/common';
import { RedisService } from './redis.service';
import type { likeStatus } from './type/type';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) { }

  @Post('count')
  async articleCount(@Body() params: { article_id: number, ip: string }) {
    const { article_id, ip } = params;

    if (!article_id || !ip) {
      return {
        code: 400,
        msg: '参数错误',
      };
    }
    return await this.redisService.articleCount(params);
  }
  @Post('getLikeList')
  async getArticleLikeList(@Body() params: { ip: string }) {
    const { ip } = params
    if (!ip) {
      return {
        code: 400,
        msg: '参数错误',
      };
    }
    return await this.redisService.getArticleLikeList(ip);
  }
  @Post('setLikeStatus')
  async articleLikeCount(@Body() params: likeStatus) {
    const { article_id, status, ip, country, short_name, province, city, area, isp, net } = params;

    if (!article_id || !ip) {
      return {
        code: 400,
        msg: '缺少必要参数',
      };
    }
    if (typeof status != 'boolean') {
      return {
        code: 400,
        msg: '参数值错误',
      };
    }
    return await this.redisService.articleLikeStatus(params);
  }
}
