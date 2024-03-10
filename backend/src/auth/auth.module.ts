/*
 * @Descripttion :
 * @Author       : wuhaidong
 * @Date         : 2023-05-10 12:11:24
 * @LastEditors  : wuhaidong
 * @LastEditTime : 2023-08-30 22:55:19
 */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { UserEntity } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { LocalStorage } from './local.strategy';
import { JwtStorage } from './jwt.strategy';
import { LoggerService } from '../core/logger/logger.service';

const jwtModule = JwtModule.register({
  secret: 'test123456',
  signOptions: { expiresIn: '7d' }, // 12小时： 12h
});

// 实际开发 从环境变量中获取
// const jwtModule = JwtModule.registerAsync({
//   inject: [ConfigService],
//   useFactory: async (configService: ConfigService) => {
//     return {
//       secret: configService.get('SECRET', 'test123456'),
//       signOptions: { expiresIn: '4h' },
//     };
//   },
// });

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    PassportModule,
    jwtModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStorage, JwtStorage, LoggerService],
  exports: [jwtModule],
})
export class AuthModule {}
