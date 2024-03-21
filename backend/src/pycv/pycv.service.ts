import { spawn } from 'child_process';
import * as path from 'path';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { Readable } from 'stream';
import * as fs from 'fs';

@Injectable()
export class PycvService {
  async uploadFile(
    file: Express.Multer.File,
    filePrefix: string = 'Video-',
  ): Promise<any> {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await axios.put(
      'https://r2api.3cap.xyz/' + filePrefix + file.originalname,
      formData,
      {
        headers: {
          'X-Custom-Auth-Key': 'www.3cap.xyz',
          ...formData.getHeaders(),
        },
      },
    );

    console.log(`File: ${file.originalname} uploaded to R2 Storage.`);
    return response.status === 200
      ? { url: response.config.url }
      : 'File upload failed.';
  }

  async processImage(video: Express.Multer.File): Promise<any> {
    const pythonScript = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'test',
      'upload_video_code',
      'app.py',
    );

    if (!video) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const videoUrl = await this.uploadFile(video, 'Video-');

    // 调用Python脚本
    const pythonProcess = spawn('python', [pythonScript, videoUrl]);

    // 监听Python脚本的标准输出和错误输出
    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    // 等待Python脚本执行完成
    pythonProcess.on('close', async (code) => {
      console.log(`Python script exited with code ${code}`);

      if (code === 0) {
        // 上传处理后的视频文件
        const uploadedFileUrl = await this.uploadFile(
          // 使用一个占位的本地文件路径，这里你可以自定义一个
          {
            path: '/home/jiachzha/github/capstone_project_G3/test/upload_video_code/processed_video.mp4',
            originalname: 'processed_video.mp4',
            fieldname: '',
            encoding: '',
            mimetype: '',
            size: 0,
            stream: new Readable(),
            destination: '',
            filename: '',
            buffer: undefined,
          },
          'ProcessedVideo-',
        );

        // 删除处理后的视频文件
        fs.unlinkSync(
          '/home/jiachzha/github/capstone_project_G3/test/upload_video_code/processed_video.mp4',
        );

        console.log('Processed video uploaded and deleted.');

        return uploadedFileUrl;
      } else {
        throw new HttpException(
          'Video processing failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
  }
}
