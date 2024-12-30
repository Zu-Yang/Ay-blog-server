import { Controller, Get, Post, Delete, Body, Query, Put } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('用户模块') // 设置swagger文档接口分类
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /* 查询所有列表 */
  @Get('list')
  @ApiOperation({ summary: '查询所有列表' }) // 设置swagger文档接口描述信息
  findAll(): Promise<User[]> {
    return this.userService.findAll()
  }
  /* 查询单个详情 */
  @Get('detail')
  @ApiOperation({ summary: '查询单个详情' })
  findOne(@Query() query): Promise<User> {
    return this.userService.findOne(query)
  }
  /* 新增数据 */
  @Post('add')
  @ApiOperation({ summary: '新增数据' })
  addOne(@Body() rUser): Promise<String> {
    return this.userService.addOne(rUser)
  }
  /* 修改数据 */
  @Put('update')
  @ApiOperation({ summary: '修改数据' })
  updateOne(@Body() uUser): Promise<String> {
    return this.userService.updateOne(uUser)
  }
  /* 删除数据 */
  @Delete('del')
  @ApiOperation({ summary: '删除数据' })
  delOne(@Query() query): Promise<String> {
    return this.userService.delOne(query)
  }
}