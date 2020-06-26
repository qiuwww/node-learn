const buf = Buffer.from('node', 'ascii');

console.log(buf.toString('hex'));

console.log(buf.toString('base64'));

console.log(`********************`);

var buf2 = Buffer.alloc(26);
for (var i = 0; i < 26; i++) {
  buf2[i] = i + 97;
}

console.log(buf2.toString('ascii')); // 输出: abcdefghijklmnopqrstuvwxyz
console.log(buf2.toString('ascii', 0, 5)); //使用 'ascii' 编码, 并输出: abcde
console.log(buf2.toString('utf8', 0, 5)); // 使用 'utf8' 编码, 并输出: abcde
console.log(buf2.toString(undefined, 0, 5)); // 使用默认的 'utf8' 编码, 并输出: abcde
