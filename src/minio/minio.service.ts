import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import * as Minio from 'minio';
import * as dayjs from 'dayjs';
import { v4 } from 'uuid';
import * as sharp from 'sharp';
import { streamToBuffer } from '../utils/index';

@Injectable()
export class MinioService {
  private readonly minioClient: Minio.Client;
  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: 9000,
      useSSL: false, // 启用https访问
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }
  // 多图片上传
  async uploadImageMultiple(
    bucketName: string = 'article-images',
    files: Array<Express.Multer.File> = [],
  ) {
    try {
      const promiseList = files.map((item) => {
        return this.uploadImage(
          bucketName,
          item.originalname,
          '',
          item.buffer,
          item.size,
        );
      });

      return Promise.all(promiseList).then((res) => {
        const status = res.map((item) => item.status); // 上传状态
        const trueCount = status.filter((item) => item === true).length; // 成功统计
        const falseCount = status.filter((item) => item === false).length; // 失败统计
        const successfully = [];
        const failed = [];

        res.forEach((item) => {
          if (item.status) {
            successfully.push(item.data.image);
          } else {
            failed.push(item);
          }
        });

        if (failed.length > 0) {
          console.log('上传图片 Error', failed);
        }

        const data = {
          code: 200,
          msg: `共上传${files.length}个文件，成功${trueCount}，失败${falseCount}`,
          data: {
            images: successfully,
            failed,
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          },
        };

        return data;
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  // 多图片上传banner
  async uploadBannerMultiple(
    bucketName: string = 'banner-images',
    subPath: string = '',
    files: Array<Express.Multer.File> = [],
  ) {
    try {
      const promiseList = files.map((item) => {
        return this.uploadImage(
          bucketName,
          item.originalname,
          subPath,
          item.buffer,
          item.size,
        );
      });

      return Promise.all(promiseList).then((res) => {
        const status = res.map((item) => item.status); // 上传状态
        const trueCount = status.filter((item) => item === true).length; // 成功统计
        const falseCount = status.filter((item) => item === false).length; // 失败统计
        const successfully = [];
        const failed = [];

        res.forEach((item) => {
          if (item.status) {
            successfully.push(item.data.image);
          } else {
            failed.push(item);
          }
        });

        if (failed.length > 0) {
          console.log('上传图片 Error', failed);
        }

        const data = {
          code: 200,
          msg: `共上传${files.length}个文件，成功${trueCount}，失败${falseCount}`,
          data: {
            images: successfully,
            failed,
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          },
        };

        return data;
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  // 单张上传
  async uploadImage(
    bucketName: string,
    objectName: string,
    subPath: string,
    stream: Buffer,
    size: number,
  ) {
    try {
      const fileExtension = objectName.match(/\.([^.]+)$/)[1]; // 获取文件后缀
      const { width, height } = await sharp(stream).metadata();
      const newfilename = `${v4().substring(0, 8)}-${width + 'x' + height}-${size + 'k'}-${dayjs().format('YYYYMMDDHHmmss')}.${fileExtension}`; // 使用 uuid + 当前时间重写文件名
      const metaData = {
        'Content-Type': `image/${fileExtension}`, // 解决minio打开直接下载图片问题
      };

      // 上传图片
      await this.minioClient.putObject(
        bucketName,
        subPath ? subPath + newfilename : newfilename,
        stream,
        size,
        metaData,
      );
      // 获取预览链接
      const presignedUrl = await this.minioClient.presignedGetObject(
        bucketName,
        subPath ? subPath + newfilename : newfilename,
        0, // 设置为0表示无预览限期
      );
      // 使用正则表达式获取完整的图片路径，兼容 http 和 https
      const imagePath = presignedUrl.match(
        /^(https?:\/\/[^\/]+(\/[^?]*\.(?:jpg|jpeg|png|gif|bmp|webp|svg)))/i,
      );
      const fullPath = imagePath ? imagePath[1] : null;

      return {
        code: 200,
        status: true,
        msg: 'success',
        data: {
          image: fullPath, // 获取图片相对路径
        },
      };
    } catch (error) {
      return {
        status: false,
        msg: 'failed',
        error,
      };
    }
  }
  // 删除图片
  async deleteImage(
    bucketName: string = 'article-images',
    images: Array<string> = [],
  ) {
    try {
      const status = [];
      for (let index = 0; index < images.length; index++) {
        const objectName = images[index];
        // 获取对象的元数据
        const res = await this.minioClient
          .statObject(bucketName, objectName)
          .then(async (res) => {
            await this.minioClient.removeObject(bucketName, objectName);
            return true;
          })
          .catch((err) => {
            return false;
          });
        status.push(res);
      }
      const trueCount = status.filter((item) => item == true).length;
      const falseCount = status.filter((item) => item == false).length;
      return {
        code: 200,
        msg: `success: ${trueCount}, no found: ${falseCount}`,
      };
    } catch (error) {
      console.error(`Error deleting image: ${error.message}`);
      throw error;
    }
  }
  // 获取随机banner
  async getRandomImage(
    bucketName: string = 'banner-images',
    prefix: string = '',
  ) {
    try {
      const objects = [];
      const stream = this.minioClient.listObjects(bucketName, prefix);

      // 收集所有对象
      stream
        .on('data', (obj) => {
          if (obj.name) objects.push(obj.name);
        })
        .on('error', function (err) {
          console.log('Error listing objects.', err);
        });

      // 等待流结束
      return new Promise((resolve, reject) => {
        stream.on('end', async () => {
          if (objects.length == 0) {
            return resolve({
              code: 200,
              msg: '没有找到任何图片',
            });
          }
          // 随机选择一张图片
          const randomIndex = Math.floor(Math.random() * objects.length);
          const randomImage = objects[randomIndex];

          // 生成预签名URL
          const presignedUrl = await this.minioClient.presignedGetObject(
            bucketName,
            randomImage,
            0,
          );
          const imagePath = presignedUrl.match(
            /^(https?:\/\/[^\/]+(\/[^?]*\.(?:jpg|jpeg|png|gif|bmp|webp|svg)))/i,
          );
          const fullPath = imagePath ? imagePath[1] : null;
          return resolve({
            code: 200,
            msg: 'success',
            data: {
              image: fullPath,
            },
          });
        });
        // 处理错误
        stream.on('error', (err) => {
          console.error(`Error listing objects: ${err.message}`);
          reject(err); // 拒绝 Promise
        });
      });
    } catch (error) {
      console.error(`Error getting random image: ${error.message}`);
      throw error;
    }
  }
}
