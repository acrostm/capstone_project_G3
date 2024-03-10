import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import FormData from 'form-data';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    console.log('file==', file);

    const formData = new FormData();
    formData.append('file', file);

    const response: Response = await fetch(
      'https://r2api.3cap.xyz/' + file.originalname,
      {
        method: 'PUT',
        headers: {
          'X-Custom-Auth-Key': 'www.3cap.xyz',
        },
        body: formData,
      },
    );
    return await response.json();
  }
}
