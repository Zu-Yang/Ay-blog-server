import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getConnection } from 'typeorm'
import { User } from './entities/user.entity'

/* 
  使用Repository<>对象执行增删查改的操作
*/
@Injectable()
export class UserService {
  constructor(
    /* 
      Repository Api：https://typeorm.biunav.com/zh/repository-api.html#repositoryapi 
    */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }
  /* 
    获取所有用户数据列表
  */
  async findAll(): Promise<User[]> {

    let list = await this.userRepository.find()

    return list
  }
  /* 
    获取单个用户详情
  */
  async findOne(query: any): Promise<User> {

    let list = await this.userRepository.findOne({ where: { user_id: query.id } })

    return list
  }
  /* 
    新增用户
  */
  async addOne(rUser: any): Promise<String> {

    let user_info = await this.userRepository.findOne({ where: { user_name: rUser.user_name } })
    if (user_info) {
      return '用户名已存在!'
    }

    let list = await this.userRepository.save(rUser)

    if (list) {
      return '新增成功!'
    } else {
      return '新增失败!'
    }
  }
  /* 
    修改用户
  */
  async updateOne(uUser: any): Promise<String> {

    let list = await this.userRepository.update({ user_id: uUser.id }, uUser)

    if (list) {
      return '修改成功!'
    } else {
      return '修改失败!'
    }
  }
  /* 
    删除用户
  */
  async delOne(query: any): Promise<String> {

    let list = await this.userRepository.delete({ user_id: query.id })

    if (list) {
      return '删除成功!'
    } else {
      return '删除失败!'
    }
  }
}
