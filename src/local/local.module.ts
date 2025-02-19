import { Module } from '@nestjs/common';
import { LocalController } from './local.controller';
import { LocalService } from './local.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Visitor } from '../modules/visitor/entities/visitor.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Visitor])],
  controllers: [LocalController],
  providers: [LocalService],
})
export class LoaclModule { }
