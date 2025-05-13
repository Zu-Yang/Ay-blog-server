import {
  HttpStatus,
  HttpException,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';
import { CreateMinioDto } from './dto/create-minio.dto';
import { UpdateMinioDto } from './dto/update-minio.dto';

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) { }
  /** 图片上传
   * @param file 图片
   * @returns 上传结果
    */
  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('上传字段有误', HttpStatus.BAD_REQUEST);
    }

    const imageType = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/svg+xml',
    ];

    if (!imageType.includes(file.mimetype)) {
      throw new HttpException('不支持该文件类型', HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    const bucketName = "article-images";
    const prefix = "";
    return await this.minioService.uploadImage(bucketName, prefix, file);
  }
  /** 多图片上传
   * @param files 图片
   * @returns 上传结果
    */
  @Post('uploadImageMultiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImageMultiple(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new HttpException('无法获取文件', HttpStatus.BAD_REQUEST);
    }

    const imageType = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/svg+xml',
    ];

    files.forEach((file) => {
      if (!imageType.includes(file.mimetype)) {
        throw new HttpException('不支持该文件类型', HttpStatus.UNSUPPORTED_MEDIA_TYPE);
      }
    });

    return await this.minioService.uploadImageMultiple(files);
  }
  /**  上传banner
   * @param files 图片
   * @param body prefix 前缀
   * @returns 上传结果
   */
  @Post('uploadBannerMultiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadBannerMultiple(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: any) {
    if (!files || files.length === 0) {
      throw new HttpException('无法获取文件', HttpStatus.BAD_REQUEST);
    }

    const prefix = (body.prefix as string).replace(/\/$/, '') + '/'; // 确保字符串末尾有"/"

    const imageType = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/svg+xml',
    ];

    files.forEach((file) => {
      if (!imageType.includes(file.mimetype)) {
        throw new HttpException('不支持该文件类型', HttpStatus.UNSUPPORTED_MEDIA_TYPE);
      }
    });

    return await this.minioService.uploadBannerMultiple(prefix, files);
  }
  /** 删除图片
   * @param images 图片列表
   * @returns 删除结果
   */
  @Delete('delImage')
  async deleteImage(@Body() params: { images: string[] }) {
    const images = params.images;
    if (!images || images.length === 0) {
      throw new HttpException('没有要删除的图片', HttpStatus.BAD_REQUEST);
    }

    const bucketName = 'article-images';
    return await this.minioService.deleteImage(bucketName, images);
  }

  /**获取随机banner
   * @param query bucketName 桶名
   * @param query prefix 前缀
   * @returns 随机图片
    */
  @Get('getRandomBanner')
  async getRandomImage(@Query() query: { bucketName: string; prefix: string }) {
    if (!query.bucketName) {
      throw new HttpException('缺少桶名', HttpStatus.BAD_REQUEST);
    }
    // if (!query.prefix) {
    //   throw new HttpException('缺少前缀', HttpStatus.BAD_REQUEST);
    // }

    const bucketName = query.bucketName;
    const prefix = query.prefix ? query.prefix.replace(/\/$/, '') + '/' : ''; // 确保字符串末尾有"/"
    return await this.minioService.getRandomImage(bucketName, prefix);
  }
  /** 获取所有音频
   * @param query bucketName 桶名
   * @returns 音频列表
    */
  @Get('getAudio')
  async getAllAudio(@Query() query: { bucketName: string }) {
    if (!query.bucketName) {
      throw new HttpException('缺少桶名', HttpStatus.BAD_REQUEST);
    }

    const bucketName = query.bucketName;
    return await this.minioService.getAllAudio(bucketName);
  }
}
