// dto/create-post.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'email' })
  readonly email: string;

  @ApiProperty({ description: 'username ' })
  readonly username: string;

  @ApiProperty({ description: 'password' })
  readonly password: string;

  @ApiPropertyOptional({ description: 'register time(if not registered)' })
  register_time: Date;

  @ApiPropertyOptional({ description: 'last login time(if registered)' })
  readonly last_login_time: Date;
}
