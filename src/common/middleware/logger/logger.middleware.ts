import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { Logger } from '../../../utils/log4js'

// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     const code = res.statusCode // 响应状态码
//     next()
//     // 组装日志信息
//     const logFormat = `
//     Ip: ${req.ip}
//     Method: ${req.method}
//     Status code: ${code}
//     Request original url: ${req.originalUrl}
//     Parmas: ${JSON.stringify(req.params)}
//     query: ${JSON.stringify(req.query)}
//     Body: ${JSON.stringify(req.body)}
//   `
//     // 根据状态码，进行日志类型区分
//     if (code >= 500) {
//       Logger.error(logFormat)
//     } else if (code >= 400 && code < 500) {
//       Logger.warn(logFormat)
//     } else {
//       Logger.access(logFormat)
//       Logger.log(logFormat)
//     }
//   }
// }

// 函数式中间件
export function logger(req: Request, res: Response, next: NextFunction) {
  const code = res.statusCode // 响应状态码
  next()
  // 组装日志信息
  const logFormat = `
      Ip: ${req.ip}
      Method: ${req.method}
      Status code: ${code}
      Request original url: ${req.originalUrl}
      Parmas: ${JSON.stringify(req.params)}
      query: ${JSON.stringify(req.query)}
      Body: ${JSON.stringify(req.body)}
    `
  // 根据状态码，进行日志类型区分
  if (code >= 500) {
    Logger.error(logFormat)
  } else if (code >= 400 && code < 500) {
    Logger.warn(logFormat)
  } else {
    Logger.access(logFormat)
    Logger.log(logFormat)
  }
}