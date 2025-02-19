import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../modules/article/entities/article.entity';
import { Visitor } from '../modules/visitor/entities/visitor.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRedis() private readonly redis: Redis,

    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,

    @InjectRepository(Visitor)
    private readonly visitoreRepository: Repository<Visitor>,
  ) { }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async UpdateArticleData() {
    const keys = await this.redis.keys('article:article-*');
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const article_id = key.replace('article:article-', '');

      const res = await this.redis.get(key);

      const readCount = JSON.parse(res).readCount;
      const likeCount = JSON.parse(res).likeCount;
      const params = {
        article_read_count: parseInt(readCount),
        article_like_count: parseInt(likeCount),
      };

      await this.articleRepository.update(article_id, params);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async UpdateVisitorData() {
    const keys = await this.redis.keys('article:like-user*');
    for (let index = 0; index < keys.length; index++) {
      const visitorEntity = new Visitor(); // 创建实体
      const key = keys[index];
      const res = await this.redis.get(key);

      const { country, short_name, province, city, area, isp, net, ip, likeList } = JSON.parse(res)

      // 检查访客ip是否已存在
      const data = await this.visitoreRepository.findOne({
        where: { ip },
      });

      visitorEntity.article_like_list = likeList;
      visitorEntity.country = country;
      visitorEntity.short_name = short_name;
      visitorEntity.province = province;
      visitorEntity.city = city;
      visitorEntity.area = area;
      visitorEntity.isp = isp;
      visitorEntity.net = net;

      if (data) {
        // 存在则更新
        await this.visitoreRepository.update(
          { id: data.id, ip }, // update()第一个参数需要表所有的主键
          visitorEntity,
        );
      } else {
        // 不存在则新增
        visitorEntity.ip = ip;
        await this.visitoreRepository.save(visitorEntity);
      }
    }
  }
}
