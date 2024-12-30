import { Module } from '@nestjs/common'
import { ArticleService } from './article.service'
import { ArticleController } from './article.controller'
import { Article } from './entities/article.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from "../category/entities/category.entity"
import { Tag } from "../tag/entities/tag.entity"


@Module({
  imports: [TypeOrmModule.forFeature([Article, Category, Tag])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule { }
