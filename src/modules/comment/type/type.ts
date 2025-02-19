export type addComment = {
  nick_name: string,
  user_email: string,
  user_ip: string,
  user_avatar: string | null,
  jump_url: string | null,
  biz_id?: number | null,
  biz_type: string,
  comment_id: string,
  parent_id?: string,
  reply_ip: string,
  content: string,
  deleted: number,
  approved: number,
  created_at: Date,
  updated_at: Date,
}
export type getComment = {
  biz_id: number,
  biz_type: string,
  page: number,
  limit: number,
}