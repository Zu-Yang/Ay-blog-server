import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { TagService } from './tag.service'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) { }

  @Post('add')
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.createTag(createTagDto)
  }
}
