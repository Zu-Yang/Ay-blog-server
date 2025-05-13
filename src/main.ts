import * as express from 'express'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { logger } from './common/middleware/logger/logger.middleware'
import { TransformInterceptor } from './common/interceptor/transform/transform.interceptor'
import { HttpExceptionFilter } from './common/filter/http-exception/http-exception.filter'
import { generateDocument } from './config/swagger'
import { Cors } from './utils/cors'
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService);   // 获取全局配置
  const PORT = configService.get<number>('PORT', 3000);
  const HOST = configService.get('HOST', 'localhost');

  app.setGlobalPrefix('api') // 设置全局前缀
  app.use(express.json()) // 全局解析json主体
  app.use(express.urlencoded({ extended: true })) // 全局解析urlencoded主体
  app.useGlobalFilters(new HttpExceptionFilter()) //  全局异常过滤器
  // app.useGlobalInterceptors(new TransformInterceptor()) // 全局过滤器
  // app.use(logger) // 全局使用日志中间件
  // generateDocument(app) // 生成swagger文档
  new Cors(app) // 解决跨域方案

  // await app.listen(3000)
  await app.listen(PORT, () => {
    console.log(`\x1b[32m服务已经启动，接口请访问:http://${HOST}:${PORT}\x1b[0m`);
  });
}
bootstrap()
