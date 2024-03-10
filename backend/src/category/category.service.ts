/*
 * @Descripttion :
 * @Author       : wuhaidong
 * @Date         : 2023-05-12 12:22:34
 * @LastEditors  : wuhaidong
 * @LastEditTime : 2023-08-02 18:11:41
 */
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(name: string) {
    return await this.categoryRepository.save({ name });
  }

  async findById(id: string) {
    return await this.categoryRepository.findOne({ where: { id } });
  }
}
