import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as dayjs from 'dayjs';
import { LoggerService } from '../../logger/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly loggerService = new LoggerService();
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const res = exception.getResponse() as { message: string[] };

    const errorResponse = {
      data: null,
      message: res?.message?.join ? res?.message?.join(',') : exception.message, // exception.message,
      code: status,
      path: request.url,
    };

    // 打印日志
    this.loggerService.error(errorResponse, '报错信息');
    Logger.error(
      `【${dayjs().format('YYYY-MM-DD HH:mm:ss:SSS')}】${request.method} ${
        request.url
      }`,
      JSON.stringify(errorResponse),
      'HttpExceptionFilter',
    );

    response.status(status).json(errorResponse);
  }
}
