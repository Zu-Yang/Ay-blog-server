import { Controller, Get, Request } from '@nestjs/common';
import { LocalService } from './local.service';

@Controller('local')
export class LocalController {
  constructor(private readonly localService: LocalService) { }

  @Get('getUserIP')
  async getUserIp() {
    const res = this.localService.getUserIp();

    return res;
  }
}
