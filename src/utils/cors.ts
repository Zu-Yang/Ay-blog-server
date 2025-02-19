export class Cors {
  private app = null;
  constructor(app) {
    this.app = app
    this.handle()
  }
  handle() {
    this.app.enableCors({
      // origin: process.env.CORS_ORIGIN,
      // 跨域请求白名单
      origin: function (origin, callback) {
        if (process.env.CORS_ORIGIN.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
      allowedHeaders: process.env.CORS_HEADERS,
      methods: process.env.CORS_METHODS,
      credentials: process.env.CORS_CREDENTIALS,
    })
  }
}