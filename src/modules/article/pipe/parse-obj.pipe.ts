/*

管道有两个典型的用例(https://nest.nodejs.cn/pipes)：

转型：将输入数据转换为所需的形式（例如，从字符串到整数）

验证：评估输入数据，如果有效，只需将其原样传递；否则抛出异常
*/

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'

@Injectable()
export class ParseObjPipe implements PipeTransform<Object, Object> {
  transform(value: Object, metadata: ArgumentMetadata): Object {
    // 验证是否是对象类型
    if (typeof value !== 'object') {
      throw new BadRequestException('Validation failed')
    }
    return value
  }
}