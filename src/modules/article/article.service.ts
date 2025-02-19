import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Category } from '../category/entities/category.entity';
import { Tag } from '../tag/entities/tag.entity';
import dayjs from 'dayjs';
import { pagination } from './type';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) { }

  // 获取全部博文
  // 分页数据类型

  async getAllArticles(params: pagination) {
    const { page, limit } = params;

    // https://typeorm.bootcss.com/repository-a
    const [result, total] = await this.articleRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['category', 'tag'], // 关联分类和标签
    });
    const count = Math.ceil(total / limit);
    if (page > count) {
      return {
        code: 404,
        msg: '敬请期待,更多精彩内容~',
      };
    } else {
      return {
        code: 200,
        total,
        page,
        count,
        data: result,
        msg: 'success',
      };
    }
  }
  // 获取博文
  async getArticle(id: number) {
    const articleInfo = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .where('article.article_id = :id', { id: id })
      .getOne();

    return { code: 200, data: articleInfo, msg: 'success' };
  }

  // 新增博文
  async createArticle(createArticleDto: CreateArticleDto): Promise<Object> {
    const article = new Article(); // 创建实体
    const {
      article_id,
      article_title,
      article_content,
      article_summary,
      article_cover,
      article_top,
      article_like_count,
      article_comment_count,
      article_read_count,
      article_user_id,
      article_update_user_id,
      article_create_time,
      article_update_time,
      category_id,
      tag_id,
    } = createArticleDto;

    const category_info = await this.categoryRepository.findOne({
      where: { category_id: category_id },
    });
    if (!category_info) return { code: 500, msg: '文章分类不存在!' };
    else article.category = category_info;

    const tag_info = await this.tagRepository.findOne({
      where: { tag_id: tag_id },
    });
    if (!tag_info) return { code: 500, msg: '文章标签不存在!' };
    else article.tag = tag_info;

    article.article_user_id = 1; // 发表用户id
    article.article_update_user_id = 1; // 更新用户id
    article.article_like_count = 0; // 点赞数
    article.article_comment_count = 0; // 评论数
    article.article_read_count = 0; // 浏览数
    // article.article_id = article_id; // 文章id
    article.article_title = article_title; // 标题
    article.article_content = article_content; // 内容
    article.article_summary = article_summary; // 摘要
    article.article_cover = article_cover; // 封面
    article.article_top = article_top; // 是否置顶
    article.article_create_time = Date.now(); // 创建时间戳
    article.article_update_time = Date.now(); // 更新时间戳

    try {
      const res = await this.articleRepository.save(article); // save():id存在则更新,不存在则新增
      if (res) return { code: 200, msg: '发布成功', data: res };
    } catch (error) {
      return { code: 500, msg: '发布失败!', error };
    }
  }
}
