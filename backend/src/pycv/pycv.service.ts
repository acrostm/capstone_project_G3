import { spawn } from 'child_process';
import * as path from 'path';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { Readable } from 'stream';

@Injectable()
export class PycvService {
  async uploadFile(
    file: Express.Multer.File,
    filePrefix: string = 'Video-',
  ): Promise<any> {
    if (!file) {
      return 'No file uploaded';
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
      ? { Url: response.config.url }
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
      'face.py',
    );

    if (!video) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const response = await this.uploadFile(video);
    const videoPath = response.Url;

    const pythonProcess = spawn('python3', [pythonScript, videoPath]);

    let processedBuffer: Buffer | null = null;

    pythonProcess.stdout.on('data', (data) => {
      // Receive processed video data from Python script
      processedBuffer = Buffer.from(data, 'base64');
    });

    console.log('Processing buffer ->', processedBuffer);
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });

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
      if (code === 0 && processedBuffer) {
        console.log('Video processing completed');
        const processedVideo: Express.Multer.File = {
          fieldname: 'processedVideo',
          originalname: 'processedVideo.mp4',
          encoding: '7bit',
          mimetype: 'video/mp4',
          buffer: processedBuffer,
          size: processedBuffer.length,
          stream: Readable.from(processedBuffer), // Add buffer data to the stream
          destination: '',
          filename: 'processedVideo.mp4',
          path: '',
        };
        console.log('Processing video ->', processedVideo);

        const response = await this.uploadFile(processedVideo, 'ProcVideo-');
        return { processedVideoUrl: response.Url };
      } else {
        console.error(`Video processing failed with code ${code}`);
      }
    });
  }
}
