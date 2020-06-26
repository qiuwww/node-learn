var fs = require('fs');
var data = '';

// 这里要在当前文件夹下执行 node stream.js
// 创建可读流
var readerStream = fs.createReadStream('buffer.js');

// 设置编码为 utf8。
readerStream.setEncoding('UTF8');

// 处理流事件 --> data, end, and error
readerStream.on('data', function (chunk) {
  data += chunk;
});

readerStream.on('end', function () {
  console.log('buffer.js:', data);
});

readerStream.on('error', function (err) {
  console.log(err, err.stack);
});

console.log('程序执行完毕');
