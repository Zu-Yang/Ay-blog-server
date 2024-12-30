import { Article } from '../../article/entities/article.entity'

export class CreateTagDto {
  tag_id: number

  tag_name: string

  alias_name: string

  description: string

  create_time: Date

  articles: Article[]
}
