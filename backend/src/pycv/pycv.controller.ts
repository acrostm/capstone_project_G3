import {
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PycvService } from './pycv.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('pycv')
export class PycvController {
  constructor(private readonly pycvService: PycvService) {}

  @Get('/')
  getHello(): string {
    return 'Hello World!';
  }

  @Post('process')
  @ApiOperation({ summary: '上传处理视频' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: Math.pow(1024, 2) * 30 },
    }),
  )
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
  async processImage(
    @Req() req,
    @UploadedFile() video: Express.Multer.File,
  ): Promise<any> {
    try {
      return await this.pycvService.processImage(video);
    } catch (error) {
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }
}
