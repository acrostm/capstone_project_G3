/*
 * @Descripttion :
 * @Author       : wuhaidong
 * @Date         : 2023-09-22 16:18:17
 * @LastEditors  : wuhaidong
 * @LastEditTime : 2023-09-22 17:59:48
 */
import { Injectable } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import { isObject } from '../../utils/dataType';
type ObjectType = Record<string, any>;

@Injectable()
export class LoggerService {
  private logger;

  constructor() {
    // 定义日志的目录： dist/logs
    const logDir = path.resolve(__dirname, '..', '..', 'logs');
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
      ),
      defaultMeta: { service: 'nest-app' },
      transports: [
        new transports.File({
          filename: path.join(logDir, 'error.log'),
          level: 'error',
        }),
        new transports.File({
          filename: path.join(logDir, 'combined.log'),
        }),
      ],
    });
  }

  // log level 0
  public error(message: string | ObjectType, prefix = ''): void {
    this.logger.error(this.toString(message), { prefix });
  }

  // log level 1
  public warn(message: string | ObjectType, prefix = ''): void {
    this.logger.warn(this.toString(message), { prefix });
  }

  // log level 2
  public info(message: string | ObjectType, prefix = ''): void {
    this.logger.info(this.toString(message), { prefix });
  }

  // log level 3
  public http(message: string | ObjectType, prefix = ''): void {
    this.logger.http(this.toString(message), { prefix });
  }

  // log level 4
  public verbose(message: string | ObjectType, prefix = ''): void {
    this.logger.verbose(this.toString(message), { prefix });
  }

  // log level 5
  public debug(message: string | ObjectType, prefix = ''): void {
    this.logger.debug(this.toString(message), { prefix });
  }

  // log level 6
  public silly(message: string | ObjectType, prefix = ''): void {
    this.logger.silly(this.toString(message), { prefix });
  }

  private toString(message: string | ObjectType): string {
    if (isObject(message)) {
      return JSON.stringify(message, null, 2);
    } else {
      return message as string;
    }
  }
}
