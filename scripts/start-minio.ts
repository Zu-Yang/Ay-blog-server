import { exec } from 'child_process';
import * as path from 'path';

// Minio服务的本地路径
const minioPath = 'D:\\minio';
const minioCommand = '.\\minio.exe server D:\\minio';

console.log('正在启动Minio服务...');

// 使用子进程执行命令
const minioProcess = exec(minioCommand, { cwd: minioPath }, (error, stdout, stderr) => {
  if (error) {
    console.error(`执行Minio命令时出错: ${error}`);
    return;
  }
});

// 输出Minio的日志
minioProcess.stdout?.on('data', (data) => {
  console.log(`Minio: ${data.toString().trim()}`);
});

// Minio将大部分输出写入stderr，但这些并不都是错误
minioProcess.stderr?.on('data', (data) => {
  // 检查是否包含API或WebUI信息，这些是重要的连接信息
  const message = data.toString().trim();
  if (message.includes('API:') || message.includes('WebUI:')) {
    console.log(`Minio连接信息: ${message}`);
  } else if (message.includes('WARN:')) {
    console.warn(`Minio警告: ${message}`);
  } else if (message.includes('ERROR:')) {
    console.warn(`Minio错误: ${message}`);
  } else {
    console.log(`Minio信息: ${message}`);
  }
});

// 处理进程退出
minioProcess.on('close', (code) => {
  console.log(`Minio进程已退出，退出码: ${code}`);
});

// 处理主进程退出时，确保Minio也关闭
process.on('SIGINT', () => {
  console.log('正在关闭Minio服务...');
  minioProcess.kill();
  process.exit();
});

console.log('Minio服务已启动');
