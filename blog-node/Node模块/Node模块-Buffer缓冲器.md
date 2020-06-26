---
title: Buffer缓冲器
---

[TOC]

## Buffer 缓冲器，是什么

1. JavaScript 语言自身**只有字符串数据类型**，没有二进制数据类型。

2. 但在处理像 TCP 流或文件流时，必须使用到二进制数据。因此在 Node.js 中，定义了一个 **Buffer 类**，该类用来创建一个**专门存放二进制数据的缓存区**。

3. 在 Node.js 中，Buffer 类是随 Node 内核一起发布的**核心库**。Buffer 库为 Node.js 带来了一种存储原始数据的方法，可以让 Node.js 处理二进制数据，**每当需要在 Node.js 中处理 I/O 操作中移动的数据时，就有可能使用 Buffer 库**。原始数据存储在 Buffer 类的实例中。一个 Buffer 类似于一个整数数组，但它对应于 V8 堆内存之外的一块原始内存。

## 常用操作

### Buffer 与字符编码

Buffer 实例一般用于表示编码字符的序列，比如 UTF-8 、 UCS2 、 Base64 、或十六进制编码的数据。 通过**使用显式的字符编码**，就可以在 Buffer 实例与普通的 JavaScript 字符串之间进行**相互转换**。

### 写入缓冲区

`buf.write(string[, offset[, length]][, encoding])`

### 从缓冲区读取数据

`buf.toString([encoding[, start[, end]]])`

### 将 Buffer 转换为 JSON 对象

`buf.toJSON()`

## 参考资料

[Node.js Buffer(缓冲区)](https://www.runoob.com/nodejs/nodejs-buffer.html)
