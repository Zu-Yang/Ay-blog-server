import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) { }

  async createTag(createTagDto: CreateTagDto) {
    const tag = new Tag();

    tag.tag_id = createTagDto.tag_id;
    tag.tag_name = createTagDto.tag_name;
    tag.alias_name = createTagDto.alias_name;
    tag.description = createTagDto.description;
    tag.create_time = Date.now();

    tag.articles = createTagDto.articles;

    try {
      const info = await this.tagRepository.save(tag);

      if (info) {
        return { code: HttpStatus.OK, msg: 'create success' };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async findAll() {
    try {
      const result = await this.tagRepository.find({
        select: ['tag_id', 'tag_name']
      });

      if (result) {
        return { code: HttpStatus.OK, data: result, msg: 'success' };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
