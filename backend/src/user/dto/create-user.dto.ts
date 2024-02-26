// dto/create-post.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'username' })
  @IsNotEmpty({ message: 'Please type in username' })
  username: string;

  @ApiProperty({ description: 'password' })
  @IsNotEmpty({ message: 'Please type in password' })
  password: string;

  @ApiProperty({ description: 'user role' })
  role: string;

  @ApiProperty({ description: 'user avatar' })
  avatar: string;

  @ApiProperty({ description: 'email' })
  email: string;
}
