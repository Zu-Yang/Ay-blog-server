import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 将entity中的User进行导入，这样UserService才能够正常使用
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // exporting the service to other modules
})
export class UserModule { }
