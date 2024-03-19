import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { TagModule } from './tag/tag.module';
import { CategoryModule } from './category/category.module';
import { PycvModule } from './pycv/pycv.module';

@Module({
  imports: [
    // 配置加载配置文件
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    // mysql连接
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        host: configService.get('DB_HOST'), // 数据库的连接地址host
        port: configService.get('DB_PORT'), // 数据库的端口 3306
        username: configService.get('DB_USERNAME'), // 连接账号
        password: configService.get('DB_PASSWORD'), // 连接密码
        database: configService.get('DB_DATABASE'), // 连接的表名
        synchronize: configService.get('DB_SYNCHRONIZE'), // 是否将实体同步到数据库
        retryDelay: 500, // 重试连接数据库间隔
        retryAttempts: 10, // 充实次数
        autoLoadEntities: true,
      }),
    }),
    MulterModule,
    PycvModule,
    PostsModule,
    UserModule,
    AuthModule,
    TagModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
