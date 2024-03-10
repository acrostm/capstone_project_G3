import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStorage } from './local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStorage } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { LoggerService } from '../core/logger/logger.service';

const jwtModule: DynamicModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('SECRET', 'test123456'),
      signOptions: { expiresIn: '4h' },
    };
  },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    PassportModule,
    jwtModule,
    UserModule,
  ],
  exports: [jwtModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStorage, JwtStorage, LoggerService],
})
export class AuthModule {}
