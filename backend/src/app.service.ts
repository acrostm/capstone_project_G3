import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async uploadFile(
    file: Express.Multer.File,
    filePrefix: string = 'Uploaded-',
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
    console.log('response', response, '<-response');
    console.log(`File: ${file.originalname} uploaded to R2 Storage.`);
    return response.status === 200
      ? { imageUrl: response.config.url }
      : 'File upload failed.';
  }
}
