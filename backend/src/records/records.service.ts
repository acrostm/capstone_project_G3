import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateRecordDto, RecordDto } from './dto/record.dto';
import { Record } from './entities/record.entity'
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>
  ) { }


  async create(user, createRecordDto: CreateRecordDto): Promise<number> {
    const recordParam = {
      ...createRecordDto,
      user: user
    }
    const newRecord: Record = await this.recordRepository.create(recordParam)
    const created = await this.recordRepository.save(newRecord);
    return created.id
  }

  // findAll() {
  //   return `This action returns all records`;
  // }

  getFirstAndLastDayOfMonth(date: Date): { start: Date, end: Date } {
    // 获取给定日期的年份和月份
    const year = date.getFullYear();
    const month = date.getMonth();

    // 获取当月第一天的日期
    const start = new Date(year, month, 1);

    // 获取下个月的第一天的日期，然后减去一天，就是当月的最后一天
    const end = new Date(year, month + 1, 1);
    end.setDate(end.getDate() - 1);
    end.setHours(23, 59, 59, 999); // 设置时间为当天的结束

    return { start, end };
  }

  getStartAndEndOfCrtDate(date: Date): { start: Date, end: Date } {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)
    return { start, end }
  }

  async findMonthlyRecords(user, query: {
    date: Date
  }): Promise<RecordDto[]> {
    const { start, end } = this.getFirstAndLastDayOfMonth(query.date)

    const records = await this.recordRepository
      .createQueryBuilder('record')
      .select('DATE_FORMAT(record.create_time, "%Y-%m-%d") AS create_time')
      .addSelect('SUM(record.curls_count) AS curls_count, SUM(record.squats_count) AS squats_count, SUM(record.bridges_count) AS bridges_count')
      .where('record.userId = :userId', { userId: user.id })
      .andWhere('record.create_time BETWEEN :start AND :end', { start, end })
      .groupBy('DATE_FORMAT(record.create_time, "%Y-%m-%d")')
      .orderBy('DATE_FORMAT(record.create_time, "%Y-%m-%d")', 'ASC')
      .getRawMany();

    const result: RecordDto[] = records.map((record) => {
      delete record.user
      return record
    })
    return result
  }

  async findDailyRecords(user, query: {
    date: Date
  }): Promise<RecordDto[]> {
    const { start, end } = this.getStartAndEndOfCrtDate(query.date)

    const records = await this.recordRepository
      .createQueryBuilder('record')
      .where('record.userId = :userId', { userId: user.id })
      .andWhere('record.create_time BETWEEN :start AND :end', { start, end })
      .orderBy('record.create_time', 'ASC')
      .getMany();

    const result: RecordDto[] = records.map((record) => {
      delete record.user
      return record
    })
    return result
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} record`;
  // }

  // update(id: number, updateRecordDto: UpdateRecordDto) {
  //   return `This action updates a #${id} record`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} record`;
  // }
}
