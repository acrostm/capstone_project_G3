import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    console.log('file', file);

    const response: Response = await fetch(
      'https://r2api.3cap.xyz/6ptvnssij7ipowovndrhch3x1.jpg',
      {
        method: 'PUT',
        headers: {
          'X-Custom-Auth-Key': 'www.3cap.xyz',
        },
        body: file,
      },
    );
    return await response.json();
  }
}
