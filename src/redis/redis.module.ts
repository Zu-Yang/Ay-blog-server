import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { RedisModule } from '@nestjs-modules/ioredis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../modules/article/entities/article.entity';
import { Visitor } from '../modules/visitor/entities/visitor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Visitor]), // 动态导入实体,使其能被改模块使用
    RedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        // options: {
        //   password: process.env.REDIS_PASSWORD,
        // },
      }),
      // useFactory: () => ({
      //   type: 'cluster',
      //   nodes: [
      //     {
      //       host: '127.0.0.1',
      //       port: 6379,
      //     },
      //     //   {
      //     //   host: '127.0.0.2',
      //     //   port: 6379
      //     // }
      //   ],
      //   options: {
      //     redisOptions: {
      //       password: 'redis_root',
      //     },
      //   },
      // }),
    }),
  ],
  controllers: [RedisController],
  providers: [RedisService],
})
export class RedisClientModule {}
