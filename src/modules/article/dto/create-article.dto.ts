import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../category/entities/category.entity';
import { Tag } from '../../tag/entities/tag.entity';

type articleTop = 1 | 0;

export class CreateArticleDto {
  @ApiProperty({ description: '博文id' })
  article_id: number;

  @ApiProperty({ description: '发表用户id' })
  article_user_id: number;

  @ApiProperty({ description: '博文标题' })
  article_title: string;

  @ApiProperty({ description: '点赞数' })
  article_like_count: number;

  @ApiProperty({ description: '评论数' })
  article_comment_count: number;

  @ApiProperty({ description: '浏览数' })
  article_read_count: number;

  @ApiProperty({
    type: 'enum',
    enum: [1, 2],
    description: '是否置顶:1是,0否',
  })
  article_top: articleTop;

  @ApiProperty({ description: '创建时间' })
  article_create_time: number;

  @ApiProperty({ description: '更新时间' })
  article_update_time: number;

  @ApiProperty({ description: '更新用户id' })
  article_update_user_id: number;

  @ApiProperty({ description: '封面图' })
  article_cover: string[];

  @ApiProperty({ description: '博文简介' })
  article_summary: string;

  @ApiProperty({ description: '博文内容' })
  article_content: string;

  @ApiProperty({ description: '文章锚点' })
  article_content_title: string;

  @ApiProperty({ description: '分类引用表' })
  category_id: number;

  @ApiProperty({ description: '标签引用表' })
  tag_id: number;
}
