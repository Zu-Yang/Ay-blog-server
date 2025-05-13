// 将文件流转换为 Buffer
export const streamToBuffer = async (stream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};


/**
   * 从URL或文件路径中提取图片名称
   * @param imageUrl 图片URL或文件名
   * @returns 提取的图片名称
   */
export const extractImageName = (imageUrl: string): string => {
  // 如果输入为空，返回空字符串
  if (!imageUrl) return '';

  // 情况1: 完整URL (http://server:port/bucket/filename.jpg)
  const urlMatch = imageUrl.match(/\/([^\/\?]+\.(jpg|jpeg|png|gif|bmp|webp|svg))(\?.*)?$/i);
  if (urlMatch) return urlMatch[1];

  // 情况2: 相对路径 (/bucket/filename.jpg)
  const pathMatch = imageUrl.match(/\/([^\/\?]+\.(jpg|jpeg|png|gif|bmp|webp|svg))(\?.*)?$/i);
  if (pathMatch) return pathMatch[1];

  // 情况3: 已经是文件名 (filename.jpg)
  const fileMatch = imageUrl.match(/^([^\/\?]+\.(jpg|jpeg|png|gif|bmp|webp|svg))(\?.*)?$/i);
  if (fileMatch) return fileMatch[1];

  // 如果都不匹配，返回原始输入（可能是不带扩展名的文件名）
  return imageUrl;
}