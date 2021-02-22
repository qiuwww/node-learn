# NEST

[website](https://docs.nestjs.cn/7/firststeps)

1. Nest 旨在成为一个与平台无关的框架。 通过平台，可以创建可重用的逻辑部件，开发人员可以利用这些部件来跨越多种不同类型的应用程序。 从技术上讲，Nest 可以在创建适配器后使用任何 Node HTTP 框架。 有两个支持开箱即用的 HTTP 平台：express 和 fastify。
2. **与 angularjs 很像**；
3. [常用 cli](https://docs.nestjs.cn/7/cli)
   1. `nest g controller cats`;
   2. 要使用 CLI 创建服务类，只需执行 `$ nest g service cats` 命令。
   3. 要使用 CLI 创建模块，只需执行 `$ nest g module cats` 命令。
4. [生命周期](https://docs.nestjs.cn/7/fundamentals?id=%e7%94%9f%e5%91%bd%e5%91%a8%e6%9c%9f)

## 启动服务

`yarn start`， `http://localhost:3000/`。

## 开发

### controller

#### [路由](https://docs.nestjs.cn/7/controllers?id=%e8%b7%af%e7%94%b1)

1. 控制器的目的是接收应用的特定请求。路由机制控制哪个控制器接收哪些请求。通常，每个控制器有多个路由，不同的路由可以执行不同的操作。
2. 为了创建一个基本的控制器，我们使用类和装饰器。装饰器将类与所需的元数据相关联，并使 Nest 能够创建路由映射（将请求绑定到相应的控制器）。
3. 快捷命令`$ nest g controller cats`。
4. 例如，customers 与装饰器组合的路由前缀 `@Get('profile')` 会为请求生成路由映射 `GET /customers/profile`。
5. **controller 变动需要重启**，`yarn start`模式。

#### [Request](https://docs.nestjs.cn/7/controllers?id=request)

1. 强制 Nest 使用 @Req() 装饰器将请求对象注入处理程序。
2. [常用到的 req 的参数](https://docs.nestjs.cn/7/controllers?id=request)，可以全部通过`@Request`来取。
3. 在方法处理程序中注入 @Res()或 @Response() 时，将 Nest 置于该处理程序的特定于库的模式中，并负责管理响应。这样做时，必须通过调用响应对象(例如，**res.json(…)或 res.send(…))发出某种响应**，否则 HTTP 服务器将挂起。
4. `@Req() request: Request`，表示的意思是：使用 @Req() 装饰器将请求对象注入处理程序，类型是 Request。
5. 参数解析：
   1. query：直接添加查询 query 是没什么问题的；
   2. @Get('all/:id')：添加参数；
   3. body，应该也是与 express 一致；

#### 资源

1. Nest 以相同的方式提供其余的端点装饰器- @Put() 、 @Delete()、 @Patch()、 @Options()、 @Head()和 @All()。这些表示各自的 HTTP 请求方法。

#### 状态码

1. @HttpCode(204)

#### 重定向

1. @Redirect('https://nestjs.com', 301)，可以重定向页面和接口；

#### 异步处理（Async / await）

1. 通过返回 RxJS observable 流。 Nest 路由处理程序更强大。Nest 将自动订阅下面的源并获取最后发出的值（在流完成后）。
2. 可以选择 （Async / await ｜ rxjs）你可以选择你喜欢的方式。

#### [完整实例](https://docs.nestjs.cn/7/controllers?id=%e5%ae%8c%e6%95%b4%e7%a4%ba%e4%be%8b)

### Providers

Providers 是 Nest 的一个基本概念。许多基本的 Nest 类可能被视为 provider - service, repository, factory, helper 等等。 他们都可以通过 constructor **注入依赖关系**。 这意味着对象可以彼此创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给 Nest 运行时系统。 **Provider 只是一个用 @Injectable() 装饰器注释的类**。

### 模块

模块是具有 @Module() 装饰器的类。 @Module() 装饰器提供了元数据，Nest 用它来组织应用程序结构。

1. 事实上，根模块可能是应用程序中唯一的模块，特别是当应用程序很小时，但是对于**大型程序来说这是没有意义的**。在大多数情况下，您将拥有多个模块，每个模块都有一组紧密相关的功能。

### 中间件

中间件是在**路由处理程序 之前 调用的函数**。 **中间件函数可以访问请求和响应对象，以及应用程序请求响应周期中的 next() 中间件函数。** next() 中间件函数通常由名为 next 的变量表示。

Nest 中间件实际上等价于 express 中间件。

### 管道

管道是具有 @Injectable() 装饰器的类。管道应实现 PipeTransform 接口。

管道有两个类型:

1. 转换：管道将输入数据转换为所需的数据输出
2. 验证：对输入数据进行验证，如果验证成功继续传递; 验证失败则抛出异常;

### 自定义路由参数装饰器

Nest 是基于装饰器这种语言特性而创建的。它是许多常用编程语言中众所周知的概念，但在 JavaScript 世界中，这个概念仍然相对较新。

## 基本原理

### [应用上下文](https://docs.nestjs.cn/7/fundamentals?id=%e5%ba%94%e7%94%a8%e4%b8%8a%e4%b8%8b%e6%96%87)

Nest 上下文是 Nest 容器的一个包装，它包含所有实例化的类。我们可以**直接使用 application 对象从任何导入的模块中获取现有实例**。

## 技术

### 认证（Authentication）

1. passport 是目前最流行的 node.js 认证库，为社区所熟知。

### 数据库

1. **Nest 与数据库无关**，**允许您轻松地与任何 SQL 或 NoSQL 数据库集成**。根据您的偏好，您有许多可用的选项。一般来说，将 Nest 连接到数据库只需为数据库加载一个适当的 Node.js 驱动程序，就像使用 Express 或 Fastify 一样。

#### TypeORM 集成

1. 为了与 SQL 和 NoSQL 数据库集成，Nest 提供了 @nestjs/typeorm 包。**Nest 使用 TypeORM 是因为它是 TypeScript 中最成熟的对象关系映射器( ORM )**。因为它是用 TypeScript 编写的，所以可以很好地与 Nest 框架集成。

2. TypeORM 支持存储库设计模式，因此每个实体都有自己的存储库。可以从数据库连接获得这些存储库。
3. 