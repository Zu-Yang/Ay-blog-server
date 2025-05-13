import { spawn } from 'child_process';
import * as path from 'path';

// 启动NestJS应用
const nestApp = spawn('cross-env', ['NODE_ENV=development', 'nest', 'start', '--watch'], {
  stdio: 'inherit',
  shell: true
});

// 启动Minio服务
const minioScript = spawn('ts-node', ['scripts/start-minio.ts'], {
  stdio: 'inherit',
  shell: true
});


// 处理进程退出
process.on('SIGINT', () => {
  console.log('正在关闭所有服务...');
  minioScript.kill();
  nestApp.kill();
  process.exit();
});

minioScript.on('close', (code) => {
  console.log(`Minio脚本已退出，退出码: ${code}`);
});

nestApp.on('close', (code) => {
  console.log(`NestJS应用已退出，退出码: ${code}`);
  minioScript.kill();
  process.exit();
});