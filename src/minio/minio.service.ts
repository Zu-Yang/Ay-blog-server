import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import * as Minio from 'minio';
import * as dayjs from 'dayjs';
import { v4 } from 'uuid';
import * as sharp from 'sharp';
import { streamToBuffer, extractImageName } from '../utils/index';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService {
  private readonly minioClient: Minio.Client;
  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: Number(process.env.MINIO_PORT),
      useSSL: false, // 启用https访问
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }

  /** 多图片上传
   * @param files 图片数组
   * @returns
   */
  async uploadImageMultiple(files: Array<Express.Multer.File> = []) {
    try {
      const bucketName = 'article-images'; // 存储桶名称
      const prefix = ''; // 子路径

      // 存储上传成功的图片路径,用于回滚
      const uploadedImages = <string[]>[];

      // 逐个上传文件,任一文件失败则回滚
      for (const file of files) {
        const result = await this.uploadImage(bucketName, prefix, file);

        if (result.code !== 200) {
          // 上传失败,开始回滚已上传的图片
          for (const imagePath of uploadedImages) {
            // 从URL中提取文件路径
            const pathMatch = imagePath.match(/^(https?:\/\/[^\/]+(\/[^?]*\.(?:jpg|jpeg|png|gif|bmp|webp|svg)))/i);
            const fullPath = pathMatch ? pathMatch[2].substring(1) : null;
            console.log('获取图片路径', pathMatch);
            console.log('获取图片路径', fullPath);

            if (fullPath) {
              await this.minioClient.removeObject(bucketName, fullPath);
            }
          }

          // 返回失败信息
          return {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            msg: '部分图片上传失败,已回滚所有上传',
            data: {
              images: [],
            },
          };
        }

        // 上传成功,记录图片URL用于可能的回滚
        uploadedImages.push(result.data.image);
      }

      // 所有文件上传成功
      return {
        code: HttpStatus.OK,
        msg: `成功上传${files.length}个文件`,
        data: {
          images: uploadedImages,
        },
      };

    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** 多图片上传banner
   * @param prefix 子路径
   * @param files 图片数组
   * @returns
   */
  async uploadBannerMultiple(prefix: string = '', files: Array<Express.Multer.File> = []) {
    try {
      const bucketName = 'banner-images'; // 存储桶名称

      // 存储上传成功的图片路径,用于回滚
      const uploadedImages = <string[]>[];

      // 逐个上传文件,任一文件失败则回滚
      for (const file of files) {
        const result = await this.uploadImage(bucketName, prefix, file);

        if (result.code !== 200) {
          // 上传失败,开始回滚已上传的图片
          for (const imagePath of uploadedImages) {
            // 从URL中提取文件路径
            const pathMatch = imagePath.match(/^(https?:\/\/[^\/]+(\/[^?]*\.(?:jpg|jpeg|png|gif|bmp|webp|svg)))/i);
            const fullPath = pathMatch ? pathMatch[2].substring(1) : null;

            if (fullPath) {
              await this.minioClient.removeObject(bucketName, fullPath);
            }
          }

          // 返回失败信息
          return {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            msg: '部分图片上传失败,已回滚所有上传',
            data: { images: [] }
          };
        }

        // 上传成功,记录图片URL用于可能的回滚
        uploadedImages.push(result.data.image);
      }

      // 所有文件上传成功
      return {
        code: HttpStatus.OK,
        msg: `成功上传${files.length}个文件`,
        data: {
          images: uploadedImages,
        },
      };

    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** 单张上传
   * @param bucketName 存储桶名称
   * @param prefix 子路径
   * @param file 图片文件
   * @returns
   */
  async uploadImage(bucketName: string, prefix: string, file: Express.Multer.File) {
    try {
      // 检查文件是否存在
      if (!file) {
        throw new HttpException("No file uploaded", HttpStatus.BAD_REQUEST);
      }

      // 获取文件信息
      const fileExtension = file.originalname.match(/\.([^.]+)$/)[1]; // 获取文件扩展名
      // const { width, height } = await sharp(file.buffer).metadata();
      const newfilename = `${v4().substring(0, 8)}-${dayjs().format('YYYYMMDDHHmmss')}.${fileExtension}`;

      // 设置文件元数据
      const metaData = {
        'Content-Type': file.mimetype,
      };

      // 检查bucket是否存在，不存在则创建
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName);
      }

      // 构建完整的对象路径
      const objectPath = prefix ? `${prefix}/${newfilename}` : newfilename;

      // 上传文件
      await this.minioClient.putObject(bucketName, objectPath, file.buffer, file.size, metaData);

      // 获取文件访问链接
      const presignedUrl = await this.minioClient.presignedGetObject(bucketName, objectPath, 0);

      // 清除presignedUrl携带的query参数
      const fullPath = presignedUrl.split('?')[0];

      return {
        code: HttpStatus.OK,
        msg: 'success',
        data: {
          image: fullPath,
        },
      };

    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  /** 删除图片
   * @param bucketName 存储桶名称
   * @param images 图片路径数组
   * @returns
   */
  async deleteImage(bucketName: string = 'article-images', images: string[] = []) {
    try {
      // 记录已删除的图片,用于出错时回滚
      for (const imageUrl of images) {
        // 提取图片名称的正则表达式
        // 处理三种情况：1. 完整URL 2. 相对路径 3. 已经是文件名
        const objectName = extractImageName(imageUrl);
        console.log('--objectName--', objectName);

        if (!objectName) {
          continue;
        }

        try {
          // 检查文件是否存在
          await this.minioClient.statObject(bucketName, objectName);

          // 删除文件
          await this.minioClient.removeObject(bucketName, objectName);
        } catch (err) {
          return {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            msg: err.message,
          };
        }
      }

      return {
        code: HttpStatus.OK,
        msg: "删除成功",
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || '删除图片时发生错误',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /** 获取随机banner
   * @param bucketName 存储桶名称
   * @param prefix 子路径
   * @returns
   */
  async getRandomImage(bucketName: string = 'banner-images', prefix: string = '') {
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
              code: HttpStatus.OK,
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
            code: HttpStatus.OK,
            msg: 'success',
            data: {
              presignedUrl,
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** 获取所有音频文件
   * @param bucketName 存储桶名称
   * @returns
   */
  async getAllAudio(bucketName: string = 'blog-audio') {
    try {
      const songFolders = new Map();

      // 获取所有文件
      const stream = this.minioClient.listObjects(bucketName, '', true);

      // 收集所有对象并按文件夹分组
      await new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
          if (!obj.name) return;

          // 解析文件路径: 文件夹名/文件名
          const [folderName, fileName] = obj.name.split('/');
          if (!fileName) return;

          if (!songFolders.has(folderName)) {
            songFolders.set(folderName, { audio: null, cover: null, lrc: null });
          }

          const folder = songFolders.get(folderName);
          if (fileName.match(/\.(mp3|wav|ogg)$/i)) {
            folder.audio = obj.name;
          } else if (fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i)) {
            folder.cover = obj.name;
          } else if (fileName.match(/\.lrc$/i)) {
            folder.lrc = obj.name;
          }
        });

        stream.on('end', resolve);
        stream.on('error', reject);
      });

      if (songFolders.size === 0) {
        return {
          code: HttpStatus.OK,
          msg: '没有找到任何音频文件',
          data: [],
        };
      }

      // 获取所有歌曲的详细信息
      const songList = await Promise.all(
        Array.from(songFolders.entries()).map(async ([folderName, files]) => {
          if (!files.audio) return null;

          // 生成音频文件的预签名URL
          const audioUrl = await this.minioClient.presignedGetObject(
            bucketName,
            files.audio,
            0
          );

          // 生成封面和歌词的预签名URL
          const coverUrl = files.cover ?
            await this.minioClient.presignedGetObject(bucketName, files.cover, 0) :
            null;
          const lrcUrl = files.lrc ?
            await this.minioClient.presignedGetObject(bucketName, files.lrc, 0) :
            null;

          // 从文件名解析歌手 - 歌名
          let artist = '未知歌手';
          let name = '未知歌名';
          // 使用正则表达式匹配歌手名和歌名，格式为: "歌手 - 歌名"
          const match = folderName.match(/^(.*?)\s*-\s*(.*)$/);
          if (match) {
            artist = match[1].trim(); // 获取歌手名
            name = match[2].trim();   // 获取歌名
          }

          return {
            name,
            artist,
            url: audioUrl,
            cover: coverUrl,
            lrc: lrcUrl
          };
        })
      );

      // 过滤掉处理失败的项
      const validSongList = songList.filter(item => item !== null);

      return {
        code: HttpStatus.OK,
        msg: 'success',
        data: validSongList
      };

    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
