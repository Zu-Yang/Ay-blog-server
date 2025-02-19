import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Unique,
  OneToMany,
  Index
} from 'typeorm';
import { Comment } from "../../comment/entities/comment.entity"
import { Reply } from "../../reply/entities/reply.entity"

@Entity()
@Unique(['ip']) // 添加ip唯一约束，ip字段的每个值必须是唯一的，不能有重复的值
export class Visitor {
  // 修改点赞ID字段，取消作为主键，设置为自动递增
  @PrimaryGeneratedColumn({ type: 'int', comment: '点赞ID' })
  id: number;

  // 将ip设置为主键
  @PrimaryColumn({ type: 'varchar', comment: '游客IP' })
  ip: string;

  @Column({ type: "varchar", comment: "昵称", nullable: false })
  nick_name: string

  @Column({ type: "varchar", comment: "邮箱", nullable: false })
  user_email: string

  @Column({ type: "varchar", comment: "邮箱", nullable: false })
  user_jump_url: string

  @Column({ type: 'varchar', comment: '国家', nullable: true })
  country: string;

  @Column({ type: 'varchar', comment: '简称', nullable: true })
  short_name: string;

  @Column({ type: 'varchar', comment: '省份', nullable: true })
  province: string;

  @Column({ type: 'varchar', comment: '城市', nullable: true })
  city: string;

  @Column({ type: 'varchar', comment: '区域', nullable: true })
  area: string;

  @Column({ type: 'varchar', comment: '供应商', nullable: true })
  isp: string;

  @Column({ type: 'varchar', comment: '网络', nullable: true })
  net: string;

  @Column({ type: 'json', comment: '用户点赞的文章id', nullable: true })
  article_like_list: { id: number; status: boolean }[];

  @OneToMany(() => Comment, (comment) => comment.visitor_info)
  comments: Comment[];

  @OneToMany(() => Reply, (reply) => reply.visitor_info)
  replys: Reply[];
}
