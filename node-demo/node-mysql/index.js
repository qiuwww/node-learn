const mysql = require('./mysql.js');
// 测试sql语句
// 查询所有的数据
const sql = 'SELECT * FROM demo';
(async () => {
  let res = await mysql.ROW(sql);
  console.log('链接查询数据库：', sql, res);
})();

// ('SELECT 1 + 1 AS solution', function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
// });
