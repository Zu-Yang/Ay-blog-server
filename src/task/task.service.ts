import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../modules/article/entities/article.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRedis() private readonly redis: Redis,

    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async UpdateArticleData() {
    const keys = await this.redis.keys('article:article-*');
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const article_id = key.replace('article:article-', '');

      const readCount = await this.redis.get(key);
      const params = {
        article_read_count: parseInt(readCount),
      };
      await this.articleRepository.update(article_id, params);
      console.log('执行定时服务------UpdateArticleData');
    }
  }
}
