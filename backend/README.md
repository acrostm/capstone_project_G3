<!--
 * @Descripttion :
 * @Author       : acrostm
 * @Date         : 2024-03-10 13:44:13
 * @LastEditors  : acrostm
 * @LastEditTime : 2024-03-10 13:44:13
-->
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
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
nest g module <module name>

# controller
nest g controller <module name> --no-spec

# service**
nest g service <module name> --no-spec

# Create a entire module with interactive CLI at once
nest g resource <module name>
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [acrostm](https://github.com/acrostm)
- Website - [https://nestjs.com](https://nestjs.com/)

## License

Nest is [MIT licensed](LICENSE).
