// user/user.module.ts
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AppModule } from '../app.module';
import { AppService } from '../app.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AppModule)],
  controllers: [UserController],
  providers: [UserService, AppService],
  exports: [UserService],
})
export class UserModule {}
