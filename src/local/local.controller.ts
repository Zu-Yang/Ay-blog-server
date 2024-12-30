import { Controller, Get } from '@nestjs/common';
import { LocalService } from './local.service';

@Controller('local')
export class LocalController {
  constructor(private readonly localService: LocalService) {}

  @Get('getIP')
  async getNetworkIp() {
    const data = this.localService.getNetworkIp();

    return data;
  }
}
