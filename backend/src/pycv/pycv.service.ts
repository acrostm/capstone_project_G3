import { spawn } from 'child_process';
import * as path from 'path';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';

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

    let processedVideo: Buffer | null = null;

    pythonProcess.stdout.on('data', (data) => {
      // Receive processed video data from Python script
      processedVideo = data;
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });

    pythonProcess.on('close', async (code) => {
      if (code === 0 && processedVideo) {
        console.log('Video processing completed');
        const response = await this.uploadFile(processedVideo, 'ProcessedV-');
        return { processedVideoUrl: response.Url };
      } else {
        console.error(`Video processing failed with code ${code}`);
      }
    });
  }
}
