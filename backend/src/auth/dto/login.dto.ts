/*
 * @Descripttion :
 * @Author       : wuhaidong
 * @Date         : 2023-05-10 12:18:01
 * @LastEditors  : wuhaidong
 * @LastEditTime : 2023-07-20 16:58:33
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '邮箱' })
  @IsNotEmpty({ message: '请输入邮箱' })
  email: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '请输入密码' })
  password: string;
}
