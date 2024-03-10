import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import * as FormData from 'form-data';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async uploadFile(file: Express.Multer.File, filePrefix: string='Uploaded-'): Promise<any> {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    console.log('file: ', file);
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype, // 设置正确的 Content-Type
    });

    const response: Response = await fetch(
      'https://r2api.3cap.xyz/' + filePrefix + '-' + file.originalname,
      {
        method: 'PUT',
        headers: {
          'X-Custom-Auth-Key': 'www.3cap.xyz',
          // 不需要设置 Content-Type，FormData 会自动设置正确的 Content-Type
        },
        body: formData,
      },
    );
    console.log(`File: ${file.originalname} uploaded to R2 Storage.`);
    return (response.ok ? { imageUrl: response.url } : 'File upload failed.');
  }
}
