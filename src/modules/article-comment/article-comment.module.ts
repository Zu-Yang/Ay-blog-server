import { Module } from '@nestjs/common'
import { ArticleCommentService } from './article-comment.service'
import { ArticleCommentController } from './article-comment.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleComment } from './entities/article-comment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ArticleComment])],
  controllers: [ArticleCommentController],
  providers: [ArticleCommentService],
})
export class ArticleCommentModule { }
