import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class ArticleComment {
  @PrimaryGeneratedColumn({ type: "int", comment: "评论表主键id" })
  id: number

  @Column({ type: "varchar", comment: "评论内容" })
  content: string

  @Column({ type: "int", comment: "文章id" })
  article_id: number

  @Column({ type: "int", comment: "发表评论的用户id" })
  user_id: number

  @Column({ type: "int", comment: "评论层级，0为针对博文的评论，1为针对0的评论，2为针对1的评论" })
  level: number

  @Column({ type: "int", comment: "回复的评论id，没有为null" })
  parent_id: number

  @Column({ type: "int", comment: "根评论id，没有为null，根评论的作用是为了方便归类" })
  root_id: number

  @Column({ type: "bigint", comment: "评论时间" })
  create_time: number
}
