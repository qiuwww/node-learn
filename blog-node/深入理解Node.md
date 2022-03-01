---
title: 深入理解Node
date: 2016-3-6
tags:
  - Node
  - Node的事件循环机制
categories:
  - Node
---

[TOC]

## Node 是什么

1. Node.js 是服务器端的 JavaScript 运行环境，它具有无阻塞(non-blocking)和事件驱动(event-driven)等的特色，Node.js 采用 V8 引擎，同样，Node.js 实现了类似 Apache 和 nginx 的 web 服务，让你可以通过它来搭建基于 JavaScript 的 Web App。

2. Node.js 是一个事件驱动 I/O 服务端 JavaScript 环境，基于 Google 的 V8 引擎，V8 引擎执行 Javascript 的速度非常快，性能非常好。

3. 而 I/O 处理方面使用了自己设计的 libuv，libuv 是一个基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的 API，事件循环机制也是它里面的实现。

类比：

1. node.js 可以看成是 apache/tomcat；
2. JavaScript 可以对应看成是 php/jsp 语言；
3. google v8 引擎被嵌入到 node.js 当中，用来解释 JavaScript 语言。

## Node.js 运行机制

1. V8 引擎**解析 JavaScript 脚本**；
2. 解析之后的代码调用 Node API；
3. **libuv 库负责 Node API 的执行**。它将不同的任务分配给不同的线程，形成一个
   **Event Loop**，以异步的方式将任务的执行结果返回给 V8 引擎；
4. V8 引擎再将结果返回给用户。

### Node 的特点

官网上对其特点描述为：

1. 它是一个 Javascript 运行环境
2. 依赖于 Chrome V8 引擎进行代码解释
3. 事件驱动
4. 非阻塞 I/O
5. 轻量、可伸缩，适于实时数据交互应用
6. 单进程，单线程

## Nodejs 的架构

nodejs 的架构是分为三层的：

1. 第一层就是我们的**用户代码**，用户代码即我们编写的应用程序代码、npm 包、nodejs 内置的 js 模块等，我们日常工作中的大部分时间都是编写这个层面的代码；

2. 第二层是**胶水代码或第三方插件层**，**能够让 js 调用 c/c++的代码**。我们可以将其理解为一个桥，桥这头是 js，另一边是 c 或者 c++，通过这个桥可以让 js 调用 c 或者 c++。第三方插件是我们自己实现的 c 或 c++库，同时需要我们自己实现胶水代码，将 js 和 c/c++链接；

3. 第三层就是**底层库**。**nodejs 的 依赖库，有 v8、linuv...**
   1. v8 是 google 开发的一套高效的 **js 引擎**，nodejs 能够高效执行 js 的代码的很大的原因就在它；
   2. libuv：**是用 c 语言实现的一套异步功能库**，nodejs 高效的异步编程模型很大程度上归功于 libuv 的实现。
   3. 还有一些其他的依赖库：http-parser,npm......

### libuv 架构

1. nodejs 实现异步编程的**核心就是 libuv**，libuv 承担着 nodejs 与文件，网络等异步任务的沟通桥梁。
2. nodejs 中的异步事件：
   1. 非 I/O：
      1. 定时器(setTimeout,setInterval)
      2. mircroTask(promise.then)
      3. process.nextTick()
      4. setImmediate
      5. DNS.lookup
   2. I/O：
      1. 网络
      2. 文件
      3. DNS 操作

### 多异步线程

node 可以**多线程执行异步事件**，相对于浏览器，只会有 setTimeout 定时器线程，libuv 内部还维护着一个**默认 4 个线程的线程池**，这些线程负责执行文件 I/O 操作，DNS 操作，用于异步代码。每当 js 层传递给 libuv 一个操作任务时，libuv 就会把这个任务**添加到队列中**，之后分为两种情况：

1. 线程池内的线程**都被占用的时候**，队列中任务就要**进行排队等待空闲线程**；
2. 线程池中**有可用线程时，从队列中取出这个任务执行**，执行完毕后，线程归还给线程池，等待下一个任务到来，**同时以事件的方式通知 event-loop**,event-loop 接收到事件后，执行该事件的回调函数。

### EventLoop

在 EventLoop 完成一个阶段，到下一个阶段之前，Event Loop 将会执行这

1. nextTick Queue 以及
2. microTask queue 里面的回调，

直到这两个队列为空，一旦这两个队列为空之后，就会进入下一个阶段。

相对于浏览器的微任务，这里**多出来一个 nextTick Queue**。

### 测试 node 执行

先执行 process.nextTick，再执行微任务 then。

```js
Promise.resolve().then(() => {
  console.log("resolve1");
});

process.nextTick(function () {
  console.log("tick1");
  process.nextTick(function () {
    console.log("tick2");
  });
  process.nextTick(function () {
    console.log("tick3");
  });
});

Promise.resolve().then(() => {
  console.log("resolve2");
});

process.nextTick(function () {
  console.log("tick4");
});

Promise.resolve().then(() => {
  console.log("resolve3");
});

process.nextTick(function () {
  console.log("tick5");
});

// tick1
// tick4
// tick5

// tick2
// tick3

// resolve1
// resolve2
// resolve3
```

#### process.nextTick 永远大于 promise.then

原因其实很简单。。。在 Node 中，\_tickCallback 在每一次执行完 TaskQueue 中的一个任务后被调用，而这个\_tickCallback 中实质上干了两件事：

1. nextTickQueue 中所有任务执行掉(长度最大 1e4，Node 版本 v6.9.1)
2. 第一步执行完后执行\_runMicrotasks 函数，执行 microtask 中的部分(promise.then 注册的回调)

## 参考文章

[Node.js 教程](https://www.runoob.com/nodejs/nodejs-tutorial.html)
[Node.js v14.1.0 文档](http://nodejs.cn/api/)
[关于 Nodejs 的运行机制](https://blog.csdn.net/chengxuyuansanshi/article/details/92000968)
[Node 与浏览器的事件循环有什么区别](https://blog.csdn.net/qq_41257129/article/details/100743394)
