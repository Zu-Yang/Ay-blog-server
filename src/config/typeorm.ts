import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // 导入所需模块给inject使用
      inject: [ConfigService], // 注入imports中的模块
      useFactory: (configService: ConfigService) => {
        return {
          type: "mysql",
          port: configService.get<number>("SQL_PORT"),
          host: configService.get<string>("SQL_HOST"),
          username: configService.get<string>("SQL_USERNAME"),
          password: configService.get<string>("SQL_PASSWORD"),
          database: configService.get<string>("SQL_DATABASE"),
          entities: [__dirname + '/**/*.entity{.ts,.js}'], // 实体文件
          autoLoadEntities: true, //  自动加载实体
          synchronize: true, // 自动创建表
        }
      }
    })
  ]
})
export class TypeormModule { }