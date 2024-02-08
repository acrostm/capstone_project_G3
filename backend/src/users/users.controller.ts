import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * create user
   */
  @ApiOperation({ summary: 'Create user' })
  @Post()
  async create(@Body() user: CreateUserDto) {
    return await this.usersService.create(user);
  }

  /**
   * get all users
   */
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  /**
   * delete user
   */
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.usersService.delete(id);
  }
}
