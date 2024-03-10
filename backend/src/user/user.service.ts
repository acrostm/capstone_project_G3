/*
 * @Descripttion :
 * @Author       : wuhaidong
 * @Date         : 2023-05-04 16:14:29
 * @LastEditors  : wuhaidong
 * @LastEditTime : 2023-08-30 22:57:45
 */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import randomName from 'src/utils/randomName';
import * as bcrypt from 'bcryptjs';
import { WechatUserInfo } from '../auth/auth.interface';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
  ) {}

  /**
   * 注册：邮箱、验证码、密码
   * @param registerUser
   */
  async register(registerUser: RegisterUserDto) {
    const { verificationCode, password, email } = registerUser;

    const existUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existUser.status) {
      throw new HttpException('该邮箱已存在', HttpStatus.BAD_REQUEST);
    }

    if (!existUser || existUser.verificationCode !== verificationCode) {
      throw new HttpException('验证码不正确，请核对！', HttpStatus.BAD_REQUEST);
    }

    const user = {
      ...existUser,
      email,
      password: bcrypt.hashSync(password, 10),
      role: 'visitor',
      name: randomName(),
      status: true,
    };

    await this.userRepository.update(existUser.id, user);
    return await this.userRepository.findOne({ where: { email } });
  }

  async sendVerificationCode(email: string): Promise<void> {
    // 发邮件之前看当前这个邮箱是否已经注册
    const user = await this.userRepository.findOneBy({ email });
    if (user?.status) {
      throw new HttpException(
        '该邮箱已注册，如忘记密码，请通过“忘记密码”找回。',
        HttpStatus.BAD_REQUEST,
      );
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const mailOptions = {
      to: email,
      subject: '韭菜团账号注册',
      template: 'verification-code',
      context: {
        verificationCode,
      },
    };
    await this.mailerService.sendMail(mailOptions);
    // Save verification code to database
    if (!user) {
      await this.userRepository.save({
        email,
        verificationCode,
        status: false,
      });
    } else {
      user.verificationCode = verificationCode;
      user.status = false;
      await this.userRepository.save(user);
    }
  }

  // async validateUser(
  //   email: string,
  //   verificationCode: string,
  // ): Promise<User | null> {
  //   const user = await this.userRepository.findOneBy({ email });
  //   if (!user || user.verificationCode !== verificationCode) {
  //     return null;
  //   }
  //   user.status = true;
  //   await this.userRepository.save(user);
  //   return user;
  // }

  // 微信扫码登录注册
  async registerByWechat(userInfo: WechatUserInfo) {
    const { nickname, openid, headimgurl } = userInfo;
    const newUser = this.userRepository.create({
      name: nickname,
      openid,
      avatar: headimgurl,
    });

    return await this.userRepository.save(newUser);
  }

  async findByOpenid(openid: string) {
    return await this.userRepository.findOne({ where: { openid } });
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }
}
