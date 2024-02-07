import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import envConfig from '../config/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        entities: [],
        host: configService.get('DB_HOST', 'localhost'), // host, default: localhost
        port: configService.get<number>('DB_PORT', 3306), // port, default: 3306
        username: configService.get('DB_USER', 'root'), // username, default: root
        password: configService.get('DB_PASSWD', 'root'), // password, default: root
        database: configService.get('DB_DATABASE', 'blog'), // schema, default: blog
        timezone: '-08:00', // timezone
        synchronize: true, // auto create table, turn off for production
      }),
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
