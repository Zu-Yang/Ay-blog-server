import { Controller, Get, HttpStatus, Query, Request, Ip } from '@nestjs/common';
import { LocalService } from './local.service';

@Controller('local')
export class LocalController {
  constructor(private readonly localService: LocalService) { }

  @Get('getLocal')
  async getUserIp(@Query('ip') ip: string) {
    if (!ip) {
      return { code: HttpStatus.BAD_REQUEST, msg: 'ip不能为空' };
    }

    return this.localService.getLocation(ip);
  }
}
