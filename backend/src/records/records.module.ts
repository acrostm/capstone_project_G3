import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Record]), AuthModule],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
