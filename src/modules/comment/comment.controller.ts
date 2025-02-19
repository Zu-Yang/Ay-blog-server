import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import type { addComment, getComment } from './type/type'
import * as dayjs from 'dayjs'
// const dayjs = require('dayjs');

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post('add')
  addComment(@Body() params: addComment) {
    let { nick_name, user_email, user_avatar, user_ip, jump_url, biz_type, biz_id, comment_id, parent_id, reply_ip, content, deleted, approved, created_at, updated_at } = params

    if (/\s/.test(nick_name)) {
      return { code: 400, message: '昵称不能有空格' };
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(user_email)) {
      return { code: 400, message: '邮箱格式错误' };
    }
    else if (!comment_id) {
      return { code: 400, message: '评论id不能为空' };
    }
    else if (!user_ip) {
      return { code: 400, message: '用户ip不能为空' };
    }
    // else if (!reply_ip) {
    //   return { code: 400, message: '回复ip不能为空' };
    // }
    else if (!content) {
      return { code: 400, message: '评论内容不能为空' };
    }

    // 默认值
    user_avatar = user_avatar == 'null' ? null : user_avatar
    jump_url = jump_url == 'null' ? null : jump_url
    biz_id = biz_id == null ? null : biz_id;
    parent_id = parent_id == 'null' ? null : parent_id
    deleted = 0; // 默认未删除
    approved = 1; // 默认已审核
    created_at = new Date(); // 使用当前日期时间
    updated_at = new Date(); // 使用当前日期时间


    return this.commentService.addComment({
      nick_name,
      user_email,
      user_avatar,
      user_ip,
      jump_url,
      biz_type,
      biz_id,
      comment_id,
      parent_id,
      reply_ip,
      content,
      deleted,
      approved,
      created_at,
      updated_at,
    });
  }

  @Get('list')
  async getComment(@Query() params: getComment) {
    const { biz_id, biz_type, page, limit } = params
    const typeList = ['article', 'message']
    if (!biz_id) {
      return { code: 400, msg: '缺少业务id字段' };
    }
    else if (!biz_type) {
      return { code: 400, msg: '缺少业务类型字段' };
    }
    else if (!typeList.includes(biz_type)) {
      return { code: 400, msg: '不存在该业务' };
    }
    else if (!page) {
      return { code: 400, msg: '缺少页数字段' };
    }
    else if (!limit) {
      return { code: 400, msg: '缺少限量字段' };
    }

    return await this.commentService.getComment(params)
  }
}
