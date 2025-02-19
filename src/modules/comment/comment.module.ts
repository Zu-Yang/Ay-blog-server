import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity'
import { Visitor } from '../visitor/entities/visitor.entity'
import { Reply } from '../reply/entities/reply.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Reply, Visitor])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule { }
