import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Article } from '../../article/entities/article.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({ type: 'int', comment: '分类id' })
  category_id: number;

  @Column({ type: 'varchar', comment: '分类名称' })
  category_name: string;

  @Column({ type: 'varchar', comment: '分类别名' })
  alias_name: string;

  @Column({ type: 'varchar', comment: '分类描述' })
  description: string;

  @Column({ type: 'bigint', comment: '创建时间' })
  create_time: number;

  @OneToMany(() => Article, (article) => article.category)
  articles: Article[];
}
