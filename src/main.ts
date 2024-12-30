import * as express from 'express'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { logger } from './common/middleware/logger/logger.middleware'
import { TransformInterceptor } from './common/interceptor/transform/transform.interceptor'
import { HttpExceptionFilter } from './common/filter/http-exception/http-exception.filter'
import { generateDocument } from './config/swagger'
import { Cors } from './utils/cors'


async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api') // 设置全局前缀
  app.use(express.json()) // 全局解析json主体
  app.use(express.urlencoded({ extended: true })) // 全局解析urlencoded主体
  app.useGlobalFilters(new HttpExceptionFilter()) //  全局使用异常过滤器
  // app.useGlobalInterceptors(new TransformInterceptor()) // 全局使用日志拦截器
  // app.use(logger) // 全局使用日志中间件

  // generateDocument(app) // 生成swagger文档

  new Cors(app) // 解决跨域方案
  
  await app.listen(3000)
}
bootstrap()
