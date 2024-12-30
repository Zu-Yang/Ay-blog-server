import { CreateRediDto } from './dto/create-redi.dto';
import { UpdateRediDto } from './dto/update-redi.dto';
import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../modules/article/entities/article.entity';

@Injectable()
export class RedisService {
  constructor(
    @InjectRedis() private readonly redis: Redis,

    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async articleReadCount(params) {
    const { article_id, ip } = params;
    if (article_id && ip) {
      const ipKey = `article:article-${article_id}:user-${ip}`;
      const idKey = `article:article-${article_id}`;

      const readCount = await this.redis.get(idKey);
      // 是否存在阅读量
      if (!readCount) {
        try {
          const articleInfo = await this.articleRepository.findOne({
            where: { article_id },
          });

          await this.redis.set(ipKey, 1, 'EX', 600); // 600s后过期 用户访问标记
          await this.redis.set(idKey, articleInfo.article_read_count); // 储存数据库的浏览量
          const count = await this.redis.incr(idKey);
          return {
            code: 200,
            msg: 'success',
            data: { readCount: count },
          };
        } catch (error) {
          return { code: 500, error };
        }
      } else {
        const hasIp = await this.redis.get(ipKey); // 存在标记，阅读量不增加
        if (hasIp) {
          return {
            code: 200,
            msg: '冷却中...',
            data: { readCount: parseInt(readCount) },
          };
        }
        await this.redis.set(ipKey, 1, 'EX', 600); // 600s后过期 用户访问标记
        await this.redis.incr(idKey); // 阅读+1
        return {
          code: 200,
          msg: 'success',
          data: { readCount: parseInt(readCount) + 1 },
        };
      }
    } else {
      return {
        code: 400,
        msg: '参数错误',
      };
    }
  }
}
