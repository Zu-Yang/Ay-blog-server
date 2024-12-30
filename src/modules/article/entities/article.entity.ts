import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Tag } from '../../tag/entities/tag.entity';

type articleTop = 1 | 0;

@Entity()
export class Article {
  @PrimaryGeneratedColumn({ type: 'int', comment: '博文id' })
  article_id: number;

  @Column({ type: 'int', comment: '发表用户id' })
  article_user_id: number;

  @Column({ type: 'text', comment: '博文标题' })
  article_title: string;

  @Column({ type: 'int', comment: '点赞数' })
  article_like_count: number;

  @Column({ type: 'int', comment: '评论数' })
  article_comment_count: number;

  @Column({ type: 'int', comment: '浏览数' })
  article_read_count: number;

  @Column({
    type: 'enum',
    enum: [1, 0],
    comment: '是否置顶:1是,0否',
    default: 0,
  })
  article_top: articleTop;

  @Column({
    type: 'bigint',
    comment: '创建时间',
    transformer: {
      to: (value: number) => Number(value),
      from: (value: number) => Number(value),
    },
  })
  article_create_time: number;

  @Column({
    type: 'bigint',
    comment: '更新时间',
    transformer: {
      to: (value: number) => Number(value),
      from: (value: number) => Number(value),
    },
  })
  article_update_time: number;

  @Column({ type: 'int', comment: '更新用户id' })
  article_update_user_id: number;

  @Column({
    type: 'text',
    comment: '封面图',
    transformer: {
      to: (value: string[]) => JSON.stringify(value), // 保存时将数组转换为字符串
      from: (value: string) => JSON.parse(value), // 读取时将字符串转换为数组
    },
  })
  article_cover: string[];

  @Column({ type: 'text', comment: '博文简介' })
  article_summary: string;

  @Column({ type: 'longtext', comment: '博文内容' })
  article_content: string;

  @Column({ type: 'text', comment: '锚点' })
  article_content_title: string;

  @Column({ type: 'int', comment: '分类id' })
  category_id: number;

  @Column({ type: 'int', comment: '标签id' })
  tag_id: number;

  // 分类
  @ManyToOne(() => Category, (category) => category.articles)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'category_id' })
  category: Category;

  // 标签
  @ManyToOne(() => Tag, (tag) => tag.articles)
  @JoinColumn({ name: 'tag_id', referencedColumnName: 'tag_id' })
  tag: Tag;
}
