import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { PycvService } from './pycv.service';
import { ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
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
  @ApiOperation({ summary: '上传用户头像' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: Math.pow(1024, 2) * 30 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  async processImage(
    @Req() req,
    @UploadedFile() video: Express.Multer.File,
  ): Promise<any> {
    try {
      const processedVideo = await this.pycvService.processImage(video);
      return processedVideo;
    } catch (error) {
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }
}
