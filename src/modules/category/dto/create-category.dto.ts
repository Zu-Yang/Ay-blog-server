import { ApiProperty } from '@nestjs/swagger'
import { Article } from "../../article/entities/article.entity"

export class CreateCategoryDto {
  @ApiProperty({ description: '分类id' })
  category_id: number

  @ApiProperty({ description: '分类名称' })
  category_name: string

  @ApiProperty({ description: '分类别名' })
  alias_name: string

  @ApiProperty({ description: '分类描述' })
  description: string

  @ApiProperty({ description: '创建时间' })
  create_time: Date

  @ApiProperty({ description: '文章引用' })
  articles: Article[]
}
