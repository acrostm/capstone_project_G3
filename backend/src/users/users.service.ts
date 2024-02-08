import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async create(user: CreateUserDto): Promise<CreateUserDto> {
    const { email, password, username } = user;
    console.log('user:', user);
    if (!email || !username || !password) {
      throw new HttpException('Email and username are required', 400);
    }

    // 检查数据库中是否存在相同的用户名或电子邮件
    const existingUser = await this.usersRepository.findOne({
      where: [{ username, email }],
    });

    if (existingUser) {
      if (existingUser.password === password) {
        existingUser.last_login_time = new Date();
        return await this.usersRepository.save(existingUser);
      } else {
        throw new HttpException('Wrong password or username!', 400);
      }
    } else {
      // 如果不存在相同的用户，则设置注册时间并保存到数据库
      user.register_time = new Date();
      return await this.usersRepository.save(user);
    }
  }

  async findAll(): Promise<UsersEntity[]> {
    return await this.usersRepository.find();
  }

  async delete(id: number): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({ where: [{ id }] });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return await this.usersRepository.remove(user);
  }
}
