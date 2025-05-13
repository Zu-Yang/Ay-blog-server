import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'
import { Logger } from '../../../utils/log4js'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp() // 获取请求上下文
    const response = ctx.getResponse<Response>() // 获取请求上下文中的 response对象
    const request = ctx.getRequest<Request>() // 获取请求上下文中的 request对象
    const status = exception.getStatus() // 获取异常状态码

    const logFormat = `
    Request original url: ${request.originalUrl}
    Method: ${request.method}
    IP: ${request.ip}
    Status code: ${status}
    Response: ${exception.toString()}    
    `
    Logger.info(logFormat)
    // 全局错误处理
    response.status(status).json({
      statusCode: status,
      error: exception.message,
      // msg: `${status >= 500 ? '系统错误' : '客户端错误'}`,
    })
  }
}