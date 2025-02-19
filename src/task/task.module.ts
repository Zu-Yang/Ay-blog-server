import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { Article } from '../modules/article/entities/article.entity';
import { Visitor } from '../modules/visitor/entities/visitor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Visitor]), // 动态导入实体,使其能被改模块使用
  ],
  providers: [TaskService],
})
export class TaskModule {}
