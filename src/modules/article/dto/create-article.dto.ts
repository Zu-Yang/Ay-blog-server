import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray, IsIn, IsNotEmpty } from 'class-validator';
import { Category } from '../../category/entities/category.entity';
import { Tag } from '../../tag/entities/tag.entity';

type articleTop = 1 | 0;

export class CreateArticleDto {
  @ApiProperty({ description: '博文id' })
  @IsNumber()
  article_id: number;

  @ApiProperty({ description: '发表用户id' })
  @IsNumber()
  article_user_id: number;

  @ApiProperty({ description: '博文标题' })
  @IsString()
  @IsNotEmpty()
  article_title: string;

  @ApiProperty({ description: '点赞数' })
  @IsNumber()
  article_like_count: number;

  @ApiProperty({ description: '评论数' })
  @IsNumber()
  article_comment_count: number;

  @ApiProperty({ description: '浏览数' })
  @IsNumber()
  article_read_count: number;

  @ApiProperty({
    type: 'enum',
    enum: [1, 0],
    description: '是否置顶:1是,0否',
  })
  @IsIn([1, 0])
  article_top: articleTop;

  @ApiProperty({ description: '创建时间' })
  @IsNumber()
  article_create_time: number;

  @ApiProperty({ description: '更新时间' })
  @IsNumber()
  article_update_time: number;

  @ApiProperty({ description: '更新用户id' })
  @IsNumber()
  article_update_user_id: number;

  @ApiProperty({ description: '封面图' })
  @IsArray()
  article_cover: string[];

  @ApiProperty({ description: '博文简介' })
  @IsString()
  @IsNotEmpty()
  article_summary: string;

  @ApiProperty({ description: '博文内容' })
  @IsString()
  @IsNotEmpty()
  article_content: string;

  @ApiProperty({ description: '博文HTML' })
  @IsString()
  @IsNotEmpty()
  article_html: string;


  @ApiProperty({ description: '分类引用表' })
  @IsNumber()
  category_id: number;

  @ApiProperty({ description: '标签引用表' })
  @IsNumber()
  tag_id: number;
}
