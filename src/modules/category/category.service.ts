import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  // 获取分类
  async getCategory() {
    try {
      const res = await this.categoryRepository.find();
      if (res) {
        return {
          code: 200,
          msg: 'success',
          data: res,
        };
      }
    } catch (error) {
      return error;
    }
  }

  // 获取单个分类信息
  async getCategoryInfo(query: any): Promise<Category> {
    let info = await this.categoryRepository.findOne({
      where: { category_id: query.id },
    });
    return info;
  }

  // 创建分类
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const category = new Category();

    category.category_name = createCategoryDto.category_name;
    category.alias_name = createCategoryDto.alias_name;
    category.description = createCategoryDto.description;
    category.create_time = Date.now();

    category.articles = createCategoryDto.articles;

    try {
      const res = await this.categoryRepository.save(category);
      if (res) {
        return { code: 200, msg: 'create success' };
      }
    } catch (error) {
      return error;
    }
  }
}
