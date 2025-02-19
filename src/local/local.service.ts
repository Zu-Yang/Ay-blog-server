import axios from 'axios'; // 引入 axios
import { Injectable } from '@nestjs/common';
import { Visitor } from '../modules/visitor/entities/visitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LocalService {
  constructor(
    @InjectRepository(Visitor)
    private readonly visitoreRepository: Repository<Visitor>,
  ) { }

  async getUserIp() {
    return axios.get('https://ip.useragentinfo.com/json')
      .then(async response => {
        const { country, short_name, province, city, area, isp, net, ip } = response.data;

        // 检查访客ip是否已存在
        const data = await this.visitoreRepository.findOne({
          where: { ip },
        });

        const visitorEntity = new Visitor(); // 创建实体
        visitorEntity.country = country;
        visitorEntity.short_name = short_name;
        visitorEntity.province = province;
        visitorEntity.city = city;
        visitorEntity.area = area;
        visitorEntity.isp = isp;
        visitorEntity.net = net;

        if (data) {
          // 存在则更新
          await this.visitoreRepository.update(
            { id: data.id, ip }, // update()第一个参数需要表所有的主键
            visitorEntity,
          );
        } else {
          // 不存在则新增
          visitorEntity.ip = ip;
          await this.visitoreRepository.save(visitorEntity);
        }

        return { code: 200, msg: "请求成功", data: { country, short_name, province, city, area, isp, net, ip } };
      })
      .catch(error => {
        throw new Error('Error retrieving data from server');
      });
  }
}