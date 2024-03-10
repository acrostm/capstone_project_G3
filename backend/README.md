<!--
 * @Descripttion :
 * @Author       : wuhaidong
 * @Date         : 2022-12-15 17:14:31
 * @LastEditors  : wuhaidong
 * @LastEditTime : 2023-10-31 22:50:54
-->

## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

### 使用webpack缓存可以把命令换成："start:dev": "nest build --webpack --webpackPath webpack-hmr.config.js --watch",

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

### nest g

#### 可以创建模块、过滤器、拦截器、中间件

```bash
# 创建一个模块
nest g res order --no-spec

# 创建一个控制器和该控制器的单元测试文件
nest g co posts

# 生成局部中间件
nest g mi counter

# module
nest g module gir

# controller
nest g controller girl --no-spec

# service**
nest g service girl --no-spec
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [hayden](https://github.com/wuhaidong-me)
- Website - [https://nestjs.com](https://nestjs.com/)

## License

Nest is [MIT licensed](LICENSE).
