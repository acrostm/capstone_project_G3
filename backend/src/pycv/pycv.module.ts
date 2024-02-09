import { Module } from '@nestjs/common';
import { PycvController } from './pycv.controller';
import { PycvService } from './pycv.service';

@Module({
  controllers: [PycvController],
  providers: [PycvService]
})
export class PycvModule {}
