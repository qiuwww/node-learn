# 深入理解 Node.js 进程与线程(8000 长文彻底搞懂)

[参考文章](https://segmentfault.com/a/1190000020077274)

## Node.js 开启服务进程例子

```js
const http = require("http");

const server = http.createServer();
server.listen(3000, () => {
  process.title = "程序员成长指北测试进程";
  console.log("进程id", process.pid);
});
```

## 进程

进程 Process 是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位，是操作系统结构的基础，进程是线程的容器（来自百科）。进程是资源分配的最小单位。我们启动一个服务、运行一个实例，就是开一个服务进程，例如 Java 里的 JVM 本身就是一个进程，Node.js 里通过 node app.js 开启一个服务进程，多进程就是进程的复制（fork），fork 出来的每个进程都拥有自己的独立空间地址、数据栈，一个进程无法访问另外一个进程里定义的变量、数据结构，只有建立了 IPC 通信，进程之间才可数据共享。

1. 当你的项目中需要有大量计算，CPU 耗时的操作时候，要注意考虑开启多进程来完成了。

### process 模块

Node.js 中的进程 Process 是一个全局对象，无需 require 直接使用，给我们提供了当前进程中的相关信息。官方文档提供了详细的说明，感兴趣的可以亲自实践下 Process 文档。

process.env：环境变量，例如通过 process.env.NODE_ENV 获取不同环境项目配置信息
process.nextTick：这个在谈及 Event Loop 时经常为会提到
process.pid：获取当前进程 id
process.ppid：当前进程对应的父进程
process.cwd()：获取当前进程工作目录，
process.platform：获取当前进程运行的操作系统平台
process.uptime()：当前进程已运行时间，例如：pm2 守护进程的 uptime 值
进程事件：process.on(‘uncaughtException’, cb) 捕获异常信息、process.on(‘exit’, cb）进程推出监听
三个标准流：process.stdout 标准输出、process.stdin 标准输入、process.stderr 标准错误输出
process.title 指定进程名称，有的时候需要给进程指定一个名称

## 线程

1. 线程是操作系统能够进行运算调度的最小单位，首先我们要清楚线程是隶属于进程的，被包含于进程之中。一个线程只能隶属于一个进程，但是一个进程是可以拥有多个线程的。
2. **单线程**就是一个进程只开一个线程；
