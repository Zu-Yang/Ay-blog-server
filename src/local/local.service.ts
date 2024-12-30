import { Injectable } from '@nestjs/common';
const os = require('os'); //node环境中才能使用os

@Injectable()
export class LocalService {
  getNetworkIp() {
    let needHost = '';
    try {
      // 获得网络接口列表
      let network = os.networkInterfaces();

      for (let dev in network) {
        let iface = network[dev];
        if (iface) {
          for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (
              alias.family === 'IPv4' &&
              alias.address !== '127.0.0.1' &&
              !alias.internal
            ) {
              needHost = alias.address;
            }
          }
        }
      }
      return {
        code: 200,
        msg: '获取成功',
        data: {
          ip: needHost,
        },
      };
    } catch (e) {
      console.log('*', e);
      return {
        code: 500,
        msg: '获取失败',
        data: {
          ip: needHost,
        },
      };
    }
  }
}
