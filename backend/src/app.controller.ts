/*
 * @Descripttion : 控制器文件，可以简单理解为路由文件
 * @Author       : wuhaidong
 * @Date         : 2022-12-15 17:14:31
 * @LastEditors  : wuhaidong
 * @LastEditTime : 2024-03-10 17:10:52
 */
import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
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
  async uploadFile(@UploadedFile() file: any): Promise<any> {
    console.log('file--', file);
  }
}
