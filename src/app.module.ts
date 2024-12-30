import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeormModule } from './config/typeorm';
import { UserModule } from './modules/user/user.module';
import { ArticleModule } from './modules/article/article.module';
import { CategoryModule } from './modules/category/category.module';
import { TagModule } from './modules/tag/tag.module';
import { ArticleCommentModule } from './modules/article-comment/article-comment.module';
import { MinioModule } from './minio/minio.module';
import { RedisClientModule } from './redis/redis.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.env.development'
          : '.env.production', // 根据环境变量加载不同的环境配置文件
    }),
    ScheduleModule.forRoot(), // 启动task定时服务
    TypeormModule,
    UserModule,
    ArticleModule,
    CategoryModule,
    TagModule,
    ArticleCommentModule,
    MinioModule,
    RedisClientModule,
    TaskModule,
  ],
})
export class AppModule {}
