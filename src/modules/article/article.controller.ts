import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Article } from './entities/article.entity';
import { ParseObjPipe } from './pipe/parse-obj.pipe';


@ApiTags('博文模块') // 设置swagger文档接口分类
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }

  @Get('list')
  @ApiOperation({ summary: '查询所有博文' })
  getAllArticles(@Query() params) {
    return this.articleService.getAllArticles(params);
  }

  @Get('toplist')
  @ApiOperation({ summary: '查询所有博文' })
  getTopArticles(@Query() params) {
    return this.articleService.getTopArticles();
  }

  @Get('detail')
  @ApiOperation({ summary: '博文详情' })
  getArticle(@Query('id') id: number) {
    return this.articleService.getArticle(id);
  }

  @Post('addArticles')
  @ApiOperation({ summary: '新增博文' })
  createArticle(
    @Body(new ParseObjPipe()) createArticleDto: CreateArticleDto,
  ): Promise<Object> {
    return this.articleService.createArticle(createArticleDto);
  }

  @Patch('updateArticle') // 使用PATCH方法进行部分更新，适用于更新文章的部分字段
  @ApiOperation({ summary: '修改博文' })
  updateArticle(
    @Body(new ParseObjPipe()) updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.updateArticle(updateArticleDto);
  }
}
