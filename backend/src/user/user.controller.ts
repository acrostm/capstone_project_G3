// user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserInfoDto } from './dto/user-info.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'register user' })
  @ApiResponse({ status: 201, type: UserInfoDto })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  register(@Body() createUser: CreateUserDto) {
    return this.userService.register(createUser);
  }

  @ApiOperation({ summary: '获取用户信息' })
  @ApiBearerAuth() // swagger文档设置token
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUserInfo(@Req() req) {
    console.log(req.user, '<-req.user');
    return req.user;
  }

  @ApiOperation({ summary: '获取所有用户列表' })
  @ApiBearerAuth() // swagger文档设置token
  @UseGuards(AuthGuard('jwt'))
  @Get('/all')
  getAllUserList() {
    return this.userService.findAllUsers();
  }

  @ApiOperation({ summary: '更新用户信息' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/update') // 使用 Patch 装饰器定义路由
  updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const id = req.user.id; // 获取用户ID
    return this.userService.updateUser(id, updateUserDto);
  }
}
