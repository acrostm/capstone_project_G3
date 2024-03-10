// user/user.service.ts
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { AppService } from '../app.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly appService: AppService,
  ) {}

  /**
   * 账号密码注册
   * @param createUser
   */
  async register(createUser: CreateUserDto) {
    const { username } = createUser;
    console.log('createUser', createUser);
    const user: User = await this.userRepository.findOne({
      where: { username },
    });
    if (user) {
      throw new HttpException('username already exits', HttpStatus.BAD_REQUEST);
    }

    // 使用 fetch 从 API 获取图片链接
    const response: Response = await fetch(
      'https://api.unsplash.com/photos/random/?client_id=ZIhCJTRReRPKlwavLyn1U9BOODcJeLGaemSweEbohm8&collections=3678902&count=1',
    );
    if (!response.ok) {
      throw new HttpException(
        'Failed to fetch image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const data = await response.json();

    createUser.avatar = data[0].urls.small;

    const newUser: User = this.userRepository.create(createUser);
    console.log('newUser', newUser);
    return await this.userRepository.save(newUser);
  }

  async findAllUsers() {
    const users: User[] = await this.userRepository.find();
    return users.map((user: User) => ({
      username: user.username,
      avatar: user.avatar,
    }));
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // 检查是否有更新用户信息的请求
    const { username, password, email, role } = updateUserDto;
    if (username) user.username = username;
    if (password) user.password = await this.encryptPassword(password);
    if (email) user.email = email;
    if (role) user.role = role;

    // 如果没有任何字段收到，则重新获取用户头像
    if (!(username || password || email || role)) {
      user.avatar = await this.fetchUserAvatar();
    }

    // 更新user update_time
    user.updateTime = new Date();

    // 保存更新后的用户信息
    return this.userRepository.save(user);
  }

  async uploadAvatar(id: string, file: Express.Multer.File): Promise<any> {
    const filePrefix = 'Avatar-';
    console.log('file', file, filePrefix, '<-file, filePrefix')
    const user: User = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!file) {
      throw new HttpException('文件上传失败', HttpStatus.BAD_REQUEST);
    }

    // 调用 AppService 的 uploadFile 方法上传文件
    const data = await this.appService.uploadFile(file, filePrefix);

    // 将返回的 imageUrl 保存到 user 的 avatarUrl 字段中
    user.avatar = data.imageUrl;

    return this.userRepository.save(user);
  }

  private async encryptPassword(password: string) {
    return bcrypt.hashSync(password, 10);
  }

  private async fetchUserAvatar() {
    const response: Response = await fetch(
      'https://api.unsplash.com/photos/random/?client_id=ZIhCJTRReRPKlwavLyn1U9BOODcJeLGaemSweEbohm8&collections=3678902&count=1',
    );
    if (!response.ok) {
      throw new HttpException(
        'Failed to fetch image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const data = await response.json();
    return data[0].urls.small;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // comparePassword(password, libPassword) {
  //   return compareSync(password, libPassword);
  // }
}
