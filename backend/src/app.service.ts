import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async uploadFile(file: any): Promise<any> {
    const formData = new FormData();
    formData.append('file', file.buffer(), file.originalname);
    console.log('formData', formData);

    const response = await fetch(
      'https://r2api.3cap.xyz/6ptvnssij7ipowovndrhch3x1.jpg',
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
