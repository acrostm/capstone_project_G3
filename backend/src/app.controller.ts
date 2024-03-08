import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: Math.pow(1024, 2) * 9 },
    }),
  )
  async uploadFile(@UploadedFile() file: any): Promise<AppService> {
    console.log('file', file);
    if (!file) {
      throw new HttpException('文件不能为空', HttpStatus.BAD_REQUEST);
    }
    if (file.size > 1024 * 1024 * 10) {
      // 10MB
      throw new HttpException('文件大小超过限制', HttpStatus.BAD_REQUEST);
    }
    return await this.appService.uploadFile(file);
  }
}
