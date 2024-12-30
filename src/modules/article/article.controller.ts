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
  constructor(private readonly articleService: ArticleService) {}

  @Get('list')
  @ApiOperation({ summary: '查询所有博文' })
  getAllArticles(@Query() params) {
    return this.articleService.getAllArticles(params);
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
}
