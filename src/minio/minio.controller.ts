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
  constructor(private readonly minioService: MinioService) {}
  // 多图片上传
  @Post('uploadImageMultiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImageMultiple(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('无法获取文件', HttpStatus.BAD_REQUEST);
    }
    const bucketName = 'article-images';
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
        throw new HttpException(
          '不支持该文件类型',
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        );
      }
    });
    try {
      const res = await this.minioService.uploadImageMultiple(
        bucketName,
        files,
      );
      return {
        code: res.code,
        data: res.data,
        msg: res.msg,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        { error, message: '图片上传失败' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // 上传banner
  @Post('uploadBannerMultiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadBannerMultiple(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: any,
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('上传字段有误', HttpStatus.BAD_REQUEST);
    }

    const bucketName = body.bucketName as string;
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
        throw new HttpException(
          '不支持该文件类型',
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        );
      }
    });
    try {
      const res = await this.minioService.uploadBannerMultiple(
        bucketName,
        prefix,
        files,
      );
      return {
        code: res.code,
        data: res.data,
        msg: res.msg,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('图片上传失败', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('delImage')
  async deleteImage(@Body() params: any) {
    if (params.length > 0) {
      const bucketName = 'article-images';
      return await this.minioService.deleteImage(bucketName, params);
    }
    throw new HttpException(
      'there are no images that need to be deleted',
      HttpStatus.BAD_REQUEST,
    );
  }
  // 获取随机banner
  @Get('getRandomBanner')
  async getRandomImage(@Query() query: { bucketName: string; prefix: string }) {
    const bucketName = query.bucketName;
    const prefix = query.prefix ? query.prefix.replace(/\/$/, '') + '/' : ''; // 确保字符串末尾有"/"

    return await this.minioService.getRandomImage(bucketName, prefix);
  }
}
