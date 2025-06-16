import axios from 'axios'; // 引入 axios
import { HttpStatus, Injectable, Ip } from '@nestjs/common';
import { Visitor } from '../modules/visitor/entities/visitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LocalService {
  constructor(
    @InjectRepository(Visitor)
    private readonly visitorRepository: Repository<Visitor>,
  ) { }
  async getLocation(ip: string) {
    try {
      // 对接文档:https://lbsyun.baidu.com/faq/api?title=webapi/ip-api-base
      const url = `https://api.map.baidu.com/location/ip?ip=&coor=bd09ll&ak=${process.env.BAIDU_SERVER_AK}`;

      // 使用await替代then/catch，使代码更易读
      const res = await axios.get(url);

      const { content } = res.data;
      const { province, city, district } = content.address_detail;

      // 查找或创建访客记录
      let visitor = await this.visitorRepository.findOne({ where: { ip } });

      const visitorData = {
        province,
        city,
        area: district,
        ...(!visitor && { ip }) // 仅当不存在时添加ip字段
      };

      if (visitor) {
        await this.visitorRepository.update({ id: visitor.id, ip }, visitorData);
      } else {
        await this.visitorRepository.save(visitorData);
      }

      return {
        code: HttpStatus.OK,
        msg: "请求成功",
        data: res.data,
      };

    } catch (error) {
      console.error('获取位置信息失败:', error);
      return {
        code: error.response?.data.status || HttpStatus.INTERNAL_SERVER_ERROR,
        msg: error.message || "请求错误",
      };
    }
  }
}