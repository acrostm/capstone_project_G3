/*
 * @Descripttion : 接口过滤器
 * @Author       : wuhaidong
 * @Date         : 2023-04-27 15:02:47
 * @LastEditors  : wuhaidong
 * @LastEditTime : 2023-05-04 15:48:10
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 200,
          message: '请求成功',
        };
      }),
    );
  }
}
