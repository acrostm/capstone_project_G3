import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  // create user, register
  async create(user: UsersEntity): Promise<UsersEntity> {
    const { email, username } = user;
    if (!email || !username) {
      throw new HttpException('email and username are required', 400);
    }

    return await this.usersRepository.save(user);
  }
}
