/*
 * @Descripttion :
 * @Author       : wuhaidong
 * @Date         : 2023-05-12 12:22:34
 * @LastEditors  : wuhaidong
 * @LastEditTime : 2023-07-12 11:28:42
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: '分类名称' })
  @IsNotEmpty({ message: '请输入分类名称' })
  @IsString()
  name: string;
}
