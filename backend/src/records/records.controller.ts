import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { RecordsService } from './records.service';
import { CreateRecordDto, DateValidate } from './dto/record.dto';


@ApiTags('Record')
@Controller('record')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) { }

  @ApiOperation({ summary: 'Create Record' })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createRecordDto: CreateRecordDto, @Req() req) {
    return this.recordsService.create(req.user, createRecordDto);
  }

  @ApiOperation({ summary: 'Find Monthly Records' })
  @ApiBearerAuth()
  @Post('/monthly')
  @UseGuards(AuthGuard('jwt'))
  async findMonthlyRecords(@Body() params: DateValidate, @Req() req) {
    return this.recordsService.findMonthlyRecords(req.user, { date: new Date(params.date) })
  }


  @ApiOperation({ summary: 'Find Daily Records' })
  @ApiBearerAuth()
  @Post('/daily')
  @UseGuards(AuthGuard('jwt'))
  async findDailyRecords(@Body() params: DateValidate, @Req() req) {
    return this.recordsService.findDailyRecords(req.user, { date: new Date(params.date) })
  }




  // @Get()
  // findAll() {
  //   return this.recordsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.recordsService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.recordsService.remove(+id);
  // }
}
