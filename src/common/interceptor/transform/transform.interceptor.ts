import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Logger } from '../../../utils/log4js'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  // intercept 接受两个参数，当前的上下文和传递函数，这里还使用了 pipe（管道），用于传递响应数据
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(1).req // 获取请求对象
    return next.handle().pipe(
      map((data) => {
        const logFormat = `
        Request original url: ${req.originalUrl}
        Method: ${req.method}
        IP: ${req.ip}
        User: ${JSON.stringify(req.user)}
        Response data: ${JSON.stringify(data.data)}
        `
        Logger.info(logFormat)
        Logger.access(logFormat)
        return data
      }),
    )
  }
}