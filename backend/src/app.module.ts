import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PycvModule } from './pycv/pycv.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '20.168.124.231',
      port: 3306,
      username: 'capstone_dev',
      password: 'yi4GxdtkRFiKdSrN',
      database: 'capstone_dev',
      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: false, // 自动链接被 forFeature 注册的实体
      synchronize: false, // 实体与表同步 调试模式下开始。不然会有强替换导致数据丢是
    }),
    UsersModule,
    PycvModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
