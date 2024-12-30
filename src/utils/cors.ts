export class Cors {
  private app = null;
  constructor(app) {
    this.app = app
    this.handle()
  }
  handle() {
    this.app.enableCors({
      origin: process.env.CORS_ORIGIN,
      allowedHeaders: process.env.CORS_HEADERS,
      methods: process.env.CORS_METHODS,
      credentials: process.env.CORS_CREDENTIALS,
    })
  }
}