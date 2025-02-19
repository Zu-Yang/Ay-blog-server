import { CreateRediDto } from './dto/create-redi.dto';
import { UpdateRediDto } from './dto/update-redi.dto';
import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../modules/article/entities/article.entity';
import { Visitor } from '../modules/Visitor/entities/Visitor.entity';

@Injectable()
export class RedisService {
  constructor(
    @InjectRedis() private readonly redis: Redis,

    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,

    @InjectRepository(Visitor)
    private readonly visitorRepository: Repository<Visitor>,
  ) { }

  async articleCount(params) {
    const { article_id, ip } = params;
    const readKey = `article:read-user:${article_id}-${ip}`;
    const idKey = `article:article-${article_id}`;

    const hasReadKey = await this.redis.get(readKey);
    const hasIdKey = await this.redis.get(idKey);

    const data = {
      readCount: 0,
      likeCount: 0,
    };

    if (!hasIdKey) {
      const articleInfo = await this.articleRepository.findOne({
        where: { article_id },
      });
      data.readCount = articleInfo.article_read_count;
      data.likeCount = articleInfo.article_like_count;
    } else {
      const idKeyValue = JSON.parse(hasIdKey)
      data.readCount = idKeyValue.readCount;
      data.likeCount = idKeyValue.likeCount;
    }

    if (!hasReadKey) {
      data.readCount += 1;
      await this.redis.set(idKey, JSON.stringify(data)); // 储存所需数据
      await this.redis.set(readKey, JSON.stringify({ article_id, waiting: true }), 'EX', 3600); // 用户访问标记,一小时后过期
      return {
        code: 200,
        msg: 'success',
        data: data,
      };
    } else {
      return {
        code: 200,
        msg: '冷却中...',
        data: data,
      };
    }
  }

  async articleLikeStatus(params) {
    const { article_id, status, ip, country, short_name, province, city, area, isp, net } = params;

    try {
      const likeKey = `article:like-user:${ip}`;
      const idKey = `article:article-${article_id}`;

      const hasLikeKey = await this.redis.get(likeKey);
      const hasIdKey = await this.redis.get(idKey);

      const data = {
        readCount: 0,
        likeCount: 0,
      };

      if (!hasIdKey) {
        const articleInfo = await this.articleRepository.findOne({
          where: { article_id },
        });
        data.readCount = articleInfo.article_read_count;
        data.likeCount = articleInfo.article_like_count;
      } else {
        const idKeyValue = JSON.parse(hasIdKey)
        data.readCount = idKeyValue.readCount;
        data.likeCount = idKeyValue.likeCount;
      }

      switch (status) {
        case true:
          data.likeCount += 1;
          break;
        case false:
          data.likeCount -= 1;
          break;

        default:
          break;
      }

      if (!hasLikeKey) {
        const params = { country, short_name, province, city, area, isp, net, ip, likeList: [{ id: article_id, status }] }
        await this.redis.set(likeKey, JSON.stringify(params), 'EX', 604800); // 标记该IP点赞的所有文章id, 604800s一周后(不点赞/取消点赞)则自动删除标记
      } else {
        const likeKeyValue = JSON.parse(hasLikeKey);
        const exist = likeKeyValue.likeList.some((item) => item.id == article_id);
        // 更新文章点赞状态
        if (exist) {
          for (let index = 0; index < likeKeyValue.length; index++) {
            const item = likeKeyValue.likeList[index];
            if (item.id == article_id) {
              !status && likeKeyValue.likeList.splice(index, 1); // 删除对应索引的值
              await this.redis.set(
                likeKey,
                JSON.stringify(likeKeyValue),
                'EX',
                604800,
              ); // 标记该IP点赞的所有文章id, 604800s一周后(不点赞/取消点赞)则自动删除标记
            }
          }
        }
        // 新增文章点赞
        else {
          likeKeyValue.likeList.push({ id: article_id, status });
          await this.redis.set(
            likeKey,
            JSON.stringify(likeKeyValue),
            'EX',
            604800,
          ); // 标记该IP点赞的所有文章id, 604800s一周后(不点赞/取消点赞)则自动删除标记
        }
      }

      await this.redis.set(idKey, JSON.stringify(data)); // 储存阅读/点赞总量

      return {
        code: 200,
        msg: status ? '点赞成功' : '取消点赞',
        data: { likeCount: data.likeCount },
      };
    } catch (error) {
      console.error(error);
    }
  }

  async getArticleLikeList(ip: string) {
    const likeKey = `article:like-user:${ip}`;
    const hasLikeKey = await this.redis.get(likeKey);

    if (!hasLikeKey) {
      const visitorInfo = await this.visitorRepository.findOne({
        where: { ip },
      });
      if (visitorInfo) {
        const likeList = visitorInfo.article_like_list;
        return {
          code: 200,
          msg: 'success',
          data: likeList,
        };
      } else {
        return {
          code: 200,
          msg: '无数据',
          data: [],
        };
      }
    } else {
      return {
        code: 200,
        msg: 'success',
        data: JSON.parse(hasLikeKey).likeList,
      };
    }
  }
}
