import { PartialType } from '@nestjs/swagger';
import { CreateArticleDto } from './create-article.dto';

/**
 * 更新文章DTO类，继承自CreateArticleDto的部分类型
 * 使用@nestjs/swagger的PartialType工具，使所有属性变为可选
 * 用于更新文章时传递参数，允许只更新部分字段
 */
export class UpdateArticleDto extends PartialType(CreateArticleDto) {

}
