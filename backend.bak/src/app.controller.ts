import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('global apis')
@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    console.log('Hello World!');
    return this.appService.getHello();
  }

  @Post('upload')
  @ApiOperation({ summary: '上传文件' })
  @ApiBody({
    description: 'File to upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: Math.pow(1024, 2) * 9 },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    console.log('file--', file);
    if (!file) {
      throw new HttpException('文件不能为空', HttpStatus.BAD_REQUEST);
    }
    return await this.appService.uploadFile(file);
  }


}
