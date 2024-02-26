// user/user.service.ts
import { compareSync } from 'bcryptjs';
import { User } from './entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';

// import { WechatUserInfo } from '../auth/auth.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 账号密码注册
   * @param createUser
   */
  async register(createUser: CreateUserDto) {
    const { username } = createUser;
    console.log('createUser', createUser);
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (user) {
      throw new HttpException('username already exits', HttpStatus.BAD_REQUEST);
    }

    // 使用 fetch 从 API 获取图片链接
    const response = await fetch(
      'https://api.unsplash.com/photos/random/?client_id=ZIhCJTRReRPKlwavLyn1U9BOODcJeLGaemSweEbohm8&collections=eR9Yy1KH53o&count=1&content_filter=high&orientation=landscape',
    );
    if (!response.ok) {
      throw new HttpException(
        'Failed to fetch image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const data = await response.json();

    createUser.avatar = data[0].urls.small;

    const newUser = await this.userRepository.create(createUser);
    console.log('newUser', newUser);
    return await this.userRepository.save(newUser);
  }

  // async registerByWechat(userInfo: WechatUserInfo) {
  //   const { nickname, openid, headimgurl } = userInfo;
  //   const newUser = await this.userRepository.create({
  //     nickname,
  //     openid,
  //     avatar: headimgurl,
  //   });
  //   return await this.userRepository.save(newUser);
  // }

  //   async login(user: Partial<CreateUserDto>) {
  //     const { username, password } = user;

  //     const existUser = await this.userRepository
  //       .createQueryBuilder('user')
  //       .addSelect('user.password')
  //       .where('user.username=:username', { username })
  //       .getOne();

  //     console.log('existUser', existUser);
  //     if (
  //       !existUser ||
  //       !(await this.comparePassword(password, existUser.password))
  //     ) {
  //       throw new BadRequestException('用户名或者密码错误');
  //     }
  //     return existUser;
  //   }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  comparePassword(password, libPassword) {
    return compareSync(password, libPassword);
  }
}
