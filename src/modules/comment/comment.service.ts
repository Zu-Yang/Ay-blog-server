import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, getConnection } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { Visitor } from '../visitor/entities/visitor.entity'
import { Reply } from '../reply/entities/reply.entity'
import { Article } from '../article/entities/article.entity'
import type { addComment, getComment } from './type/type'
import dayjs from 'dayjs';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Visitor)
    private readonly visitorRepository: Repository<Visitor>,

    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>
  ) { }

  /* 计算评论数 */
  allCommentNum(commentList: Comment[], parentNum: number) {
    if (!commentList.length) return 0
    let totalNum = parentNum
    commentList.forEach(item => {
      const replyNum = item.replys.length
      if (replyNum) {
        totalNum += replyNum
      }
    });
    return totalNum
  }

  async addComment(params: any) {
    try {
      const { nick_name, user_email, user_avatar, user_ip, jump_url, biz_type, biz_id, comment_id, parent_id, reply_id, reply_ip, content, created_at, updated_at } = params
      // 回复评论
      if (parent_id && reply_id) {
        const replyEntity = new Reply()
        const userInfo = await this.visitorRepository.findOne({
          where: { ip: user_ip }
        })
        if (!userInfo) throw new HttpException('信息未登记，请刷新重试', HttpStatus.NOT_FOUND);
        replyEntity.visitor_info = userInfo

        const replyInfo = await this.visitorRepository.findOne({
          where: { ip: reply_ip }
        })
        if (!replyInfo) throw new HttpException('回复用户不存在', HttpStatus.NOT_FOUND);
        replyEntity.reply_info = replyInfo

        const commentInfo = await this.commentRepository.findOne({
          where: { comment_id: parent_id }
        })
        if (!commentInfo) throw new HttpException('回复的评论不存在', HttpStatus.NOT_FOUND);
        replyEntity.parent_comments = commentInfo

        replyEntity.nick_name = nick_name
        replyEntity.user_email = user_email
        replyEntity.user_avatar = user_avatar
        replyEntity.user_ip = user_ip
        replyEntity.jump_url = jump_url
        replyEntity.biz_id = biz_id
        replyEntity.biz_type = biz_type
        replyEntity.comment_id = comment_id
        replyEntity.parent_id = parent_id
        replyEntity.reply_id = reply_id
        replyEntity.reply_ip = reply_ip
        replyEntity.content = content
        replyEntity.created_at = new Date()
        replyEntity.updated_at = new Date()
        const data = await this.replyRepository.save(replyEntity)
        if (data) {
          // 更新文章评论数（递增1）
          await this.articleRepository.increment(
            { article_id: biz_id },
            "article_comment_count",
            1
          );
          return {
            code: HttpStatus.OK,
            msg: 'success',
            data
          };
        }
      } else {
        // 评论
        const commentEntity = new Comment()
        const visitorInfo = await this.visitorRepository.findOne({
          where: { ip: user_ip }
        })
        if (!visitorInfo) throw new HttpException('信息未登记，请刷新重试', HttpStatus.NOT_FOUND);
        commentEntity.replys = []
        commentEntity.visitor_info = visitorInfo
        commentEntity.nick_name = nick_name
        commentEntity.user_email = user_email
        commentEntity.user_avatar = user_avatar
        commentEntity.user_ip = user_ip
        commentEntity.jump_url = jump_url
        commentEntity.biz_id = biz_id
        commentEntity.biz_type = biz_type
        commentEntity.comment_id = comment_id
        commentEntity.content = content
        commentEntity.created_at = new Date()
        commentEntity.updated_at = new Date()
        const data = await this.commentRepository.save(commentEntity)
        if (data) {
          // 更新文章评论数（递增1）
          await this.articleRepository.increment({ article_id: biz_id }, "article_comment_count", 1);
          return {
            code: HttpStatus.OK,
            msg: 'success',
            data
          };
        }
      }
    } catch (error) {
      throw new HttpException(
        '服务器错误',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error }
      );
    }
  }

  async getComment(params) {
    return new Promise(async (resolve, reject) => {
      const { biz_id, biz_type, page, limit } = params

      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      await this.commentRepository.findAndCount({
        where: {
          biz_id: biz_id,
          biz_type: biz_type,
        },
        relations: ['visitor_info', 'replys', 'replys.visitor_info', 'replys.reply_info'],
        skip: limitNumber * (pageNumber - 1), // 跳过
        take: limitNumber, // 限量

      }).then(([data, total]) => {
        // const totalNum = this.allCommentNum(data, total)
        if (total) {
          resolve({ code: HttpStatus.OK, msg: '请求成功', data, oneLevelCount: total, page: pageNumber, limit: limitNumber })
        } else {
          resolve({ code: HttpStatus.NO_CONTENT, msg: '无内容', data: [], oneLevelCount: total, page: pageNumber, limit: limitNumber })
        }
      }).catch((err) => {
        reject(new HttpException(
          '查询失败',
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: err }
        ));
      });
    })
  }

  /**
   *  删除评论&删除回复（开启事务级联删除） 
   *  @param {string} `comment_id` - 评论id
   *  @param {string} `parent_id` - 回复id
   *  @param {number} `biz_id` - 业务id
   *  @param {string} `biz_type` - 业务类型
   * */
  async deleteComment(params) {
    const { comment_id, parent_id, biz_id, biz_type } = params;

    try {
      // 获取数据库连接
      const connection = this.commentRepository.manager.connection;

      // 开启事务处理
      await connection.transaction(async manager => {
        if (parent_id) {
          // 删除单条回复
          await manager.delete(Reply, {
            comment_id,
            biz_id,
            biz_type
          });
        } else {
          // 先删除所有相关回复
          await manager.delete(Reply, {
            parent_id: comment_id,
            biz_id,
            biz_type
          });

          // 删除主评论
          await manager.delete(Comment, {
            comment_id,
            biz_id,
            biz_type
          });
        }
      });

      return { code: HttpStatus.OK, msg: '删除成功' };
    } catch (error) {
      throw new HttpException(
        '删除失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error }
      );
    }
  }

}
