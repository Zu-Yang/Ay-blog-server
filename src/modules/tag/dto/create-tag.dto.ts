import { Article } from '../../article/entities/article.entity'
import { IsNotEmpty, IsString, IsOptional, Length, IsDate } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
export class CreateTagDto {
  @ApiProperty({ description: '标签ID' })
  tag_id: number

  @ApiProperty({ description: '标签名称' })
  @IsNotEmpty({ message: '标签名称不能为空' })
  @IsString({ message: '标签名称必须是字符串' })
  @Length(1, 8, { message: '标签名称长度必须在1-8个字符之间' })
  tag_name: string

  @ApiProperty({ description: '标签别名' })
  @IsOptional()
  @IsString({ message: '标签别名必须是字符串' })
  @Length(1, 8, { message: '标签别名长度必须在1-8个字符之间' })
  alias_name: string

  @ApiProperty({ description: '标签描述' })
  @IsOptional()
  @IsString({ message: '标签描述必须是字符串' })
  description: string

  @ApiProperty({ description: '创建时间' })
  @IsOptional()
  @IsDate({ message: '创建时间格式不正确' })
  create_time: Date

  @ApiProperty({ description: '关联的文章列表' })
  @IsOptional()
  articles: Article[]
}
