/*
 * @Descripttion : 项目的入口文件，里边包括项目的主模块和监听端口号
 * @Author       : acrostm
 * @Date         : 2024-03-10 17:34:24
 * @LastEditors  : acrostm
 * @LastEditTime : 2024-03-10 17:34:24
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as cors from 'cors';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/httpException';
import { TransformInterceptor } from './core/interceptor/transform';

function MiddleWareAll(req: any, res: any, next: any) {
  console.log('全局中间件: ');
  // next() 如果不加的话就不会执行后面的了
  next();
}

const PORT: string = process.env.PORT;
const PREFIX: string = process.env.PREFIX;
export const IS_DEV: boolean = process.env.NODE_ENV === 'development';
async function bootstrap() {
  const logger: Logger = new Logger('main.ts');
  const app = await NestFactory.create(AppModule, {
    // 开启日志级别打印
    logger: IS_DEV ? ['log', 'debug', 'error', 'warn'] : ['error', 'warn'],
  });
  // 设置全局前缀
  app.setGlobalPrefix(PREFIX);
  // 跨域中间件
  app.use(cors());
  // 全局中间件
  app.use(MiddleWareAll);
  // 全局接口返回过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 全局注册拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // swagger设置
  if (IS_DEV) {
    const config = new DocumentBuilder()
      .setTitle('管理后台')
      .setDescription('管理后台接口文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${PREFIX}/swagger`, app, document);
  }

  // 全局管道注入
  app.useGlobalPipes(new ValidationPipe());
  // 启动端口
  await app.listen(PORT, () => {
    logger.log(`NestJs Service started, listening on address - http://www.localhost:${PORT}${PREFIX}`);
    logger.log(
      `NestJs Swagger Api Documents: http://www.localhost:${PORT}${PREFIX}/swagger`,
    );
  });
  // 热更新
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
