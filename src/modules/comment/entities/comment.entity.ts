import { Column, Entity, PrimaryGeneratedColumn, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { Visitor } from "../../visitor/entities/visitor.entity"
import { Reply } from "../../reply/entities/reply.entity"

@Entity()
export class Comment {
  @PrimaryGeneratedColumn({ type: "int", comment: "主键id" })
  id: number

  @Column({ type: "varchar", comment: "昵称", nullable: false })
  nick_name: string

  @Column({ type: "varchar", comment: "邮箱", nullable: false })
  user_email: string

  @Column({ type: "varchar", comment: "头像", nullable: true })
  user_avatar: string

  // 将ip设置为主键
  @PrimaryColumn({ type: 'varchar', comment: '游客IP' })
  // @Column({ type: "varchar", comment: "用户ip", nullable: false })
  user_ip: string

  @Column({ type: "varchar", comment: "用户网站", nullable: true })
  jump_url: string

  @Column({ type: "int", comment: "业务id", nullable: true })
  biz_id: number

  @Column({ type: "varchar", comment: "业务场景", nullable: false })
  biz_type: string;

  @Column({ type: "varchar", comment: "评论id", nullable: false })
  comment_id: string

  // @Column({ type: "varchar", comment: "回复的评论id，没有为null", nullable: true })
  // parent_id: number

  // @Column({ type: "varchar", comment: "被回复的用户ip", nullable: true })
  // reply_ip: string

  // @Column({ type: "boolean", comment: "是否展开", default: false, nullable: false })
  // open: boolean;

  @Column({ type: "text", comment: "评论内容", nullable: false })
  content: string

  @Column({ type: "int", comment: "0不删除，1软删除", default: 0, nullable: false })
  deleted: number

  @Column({ type: "int", comment: "0审核不通过，1审核通过", default: 1, nullable: false })
  approved: number

  @Column({ type: "datetime", comment: "评论时间", nullable: true })
  created_at: Date

  @Column({ type: "datetime", comment: "最后评论时间", nullable: true })
  updated_at: Date

  @ManyToOne(() => Visitor, (visitor) => visitor.comments)
  @JoinColumn({ name: 'visitor_ip', referencedColumnName: 'ip' })
  visitor_info: Visitor;

  @OneToMany(() => Reply, (reply) => reply.parent_comments)
  replys: Reply[];
}
