import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import type { addComment, getComment } from './type/type'
// import * as dayjs from 'dayjs'
// const dayjs = require('dayjs');

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post('add')
  addComment(@Body() params: addComment) {
    let { nick_name, user_email, user_avatar, user_ip, jump_url, biz_type, biz_id, comment_id, parent_id, reply_ip, content, created_at, updated_at } = params

    if (/\s/.test(nick_name)) {
      throw new HttpException('昵称不能有空格', HttpStatus.BAD_REQUEST);
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(user_email)) {
      throw new HttpException('邮箱格式错误', HttpStatus.BAD_REQUEST);
    }
    else if (!comment_id) {
      throw new HttpException('评论id不能为空', HttpStatus.BAD_REQUEST);
    }
    else if (!user_ip) {
      throw new HttpException('用户ip不能为空', HttpStatus.BAD_REQUEST);
    }
    else if (!content) {
      throw new HttpException('评论内容不能为空', HttpStatus.BAD_REQUEST);
    }

    return this.commentService.addComment(params);
  }

  @Get('list')
  async getComment(@Query() params: getComment) {
    const { biz_id, biz_type, page, limit } = params
    const typeList = ['article', 'message']
    if (!biz_id) {
      throw new HttpException('缺少业务id字段', HttpStatus.BAD_REQUEST);
    }
    else if (!biz_type) {
      throw new HttpException('缺少业务类型字段', HttpStatus.BAD_REQUEST);
    }
    else if (!typeList.includes(biz_type)) {
      throw new HttpException('不存在该业务', HttpStatus.BAD_REQUEST);
    }
    else if (!page) {
      throw new HttpException('缺少页数字段', HttpStatus.BAD_REQUEST);
    }
    else if (!limit) {
      throw new HttpException('缺少限量字段', HttpStatus.BAD_REQUEST);
    }

    return await this.commentService.getComment(params)
  }

  @Delete('delete')
  deleteComment(@Body() params: any) {
    const { comment_id, biz_id, biz_type } = params;

    if (!comment_id) {
      throw new HttpException('缺少评论id字段', HttpStatus.BAD_REQUEST);
    }
    else if (!biz_id) {
      throw new HttpException('缺少业务id字段', HttpStatus.BAD_REQUEST);
    }
    else if (!biz_type) {
      throw new HttpException('缺少业务类型字段', HttpStatus.BAD_REQUEST);
    }

    return this.commentService.deleteComment(params);
  }

}
