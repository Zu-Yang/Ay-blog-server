import { Injectable } from '@nestjs/common';
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
  ) {}

  createTag(createTagDto: CreateTagDto) {
    const tag = new Tag();

    tag.tag_id = createTagDto.tag_id;
    tag.tag_name = createTagDto.tag_name;
    tag.alias_name = createTagDto.alias_name;
    tag.description = createTagDto.description;
    tag.create_time = Date.now();

    tag.articles = createTagDto.articles;

    try {
      const info = this.tagRepository.save(tag);

      if (info) {
        return { code: 200, msg: 'create success' };
      }
    } catch (error) {
      throw new Error('Failed to save tag');
    }
  }
}
