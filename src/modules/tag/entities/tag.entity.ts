import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Article } from '../../article/entities/article.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn({ type: 'int', comment: '标签id' })
  tag_id: number;

  @Column({ type: 'varchar', comment: '标签名称' })
  tag_name: string;

  @Column({ type: 'varchar', comment: '标签别名' })
  alias_name: string;

  @Column({ type: 'varchar', comment: '标签描述' })
  description: string;

  @Column({ type: 'bigint', comment: '创建时间' })
  create_time: number;

  @OneToMany(() => Article, (article) => article.tag)
  articles: Article[];
}
