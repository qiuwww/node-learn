// 定向获取百度百科的历史上的今天的数据，保存在数据库内
// const href = `http://baike.baidu.com/cms/home/eventsOnHistory/02.json?_=158886471913099`;

const http = require('http');
const baseUrl = `http://baike.baidu.com/cms/home/eventsOnHistory/`;
const timeStamp = new Date().getTime();

const hrefArr = Array.from({ length: 12 }).map((item, index) => {
  index += 1;
  return `${index >= 10 ? index : '0' + index}.json?=${timeStamp + index}`;
});
console.log('base params:', baseUrl, timeStamp, hrefArr);

const getDataByMonth = (href) => {
  href = `${baseUrl}${href}`;
  return new Promise(function (resolve, reject) {
    http
      .get(href, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;

        if (statusCode !== 200) {
          error = new Error('请求失败\n' + `状态码: ${statusCode}`);
        } else if (!/^text\/json/.test(contentType)) {
          error = new Error(
            '无效的 content-type.\n' +
              `期望的是 text/json 但接收到的是 ${contentType}`
          );
        }
        if (error) {
          console.error(error.message);
          // 消费响应数据来释放内存。
          res.resume();
          return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (e) {
            reject(e);
            console.error(e.message);
          }
        });
      })
      .on('error', (e) => {
        console.error(`出现错误: ${e.message}`);
      });
  });
};

const runList = hrefArr.slice();
function run() {
  let href = runList.shift();
  if (!href) {
    return;
  }
  setTimeout(() => {
    console.log(href);
    getDataByMonth(href).then((data) => {
      console.log(Object.keys(data[Object.keys(data)[0]]));

      run();
    });
  }, 2000);
}

run();
// getDataByMonth(`02.json?_=158886471913099`).then((data) => {
//   console.log(Object.keys(data['02']));
// });
