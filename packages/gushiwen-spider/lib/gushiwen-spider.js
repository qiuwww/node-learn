"use strict";

var http = require("http"); // http 网路
var cheerio = require("cheerio"); // html 解析
var fs = require("fs"); // 流
var path = require("path"); // 路径操作
var axios = require("axios"); // 借助请求库
var url = require("url");

module.exports = gushiwenSpider;

function gushiwenSpider() {
  // TODO
}

/**
 * 解析index页面，保存数据到数据库
 * 目标url，https://so.gushiwen.cn/guwen/book_46653FD803893E4F33D126D4A6B656E2.aspx
 */

function parseBookIndexPage(bookIndexUrl) {
  var location = url.parse(bookIndexUrl);
  var origin = location.protocol + "//" + location.hostname;

  // 基本信息
  // 单表，存一条
  var bookInfo = {
    url: bookIndexUrl,
    date: new Date(),
    title: "",
    description: "",
    cover: "",
    origin: origin,
  };

  // 章节信息
  // 单表，逐条存储，type标识所处的类别
  var chapters = [
    {
      type: "",
      title: "",
      href: "",
      content: {},
    },
  ];

  axios.get(bookIndexUrl).then((resp) => {
    var $ = cheerio.load(resp.data);
    var cont = $(".sonspic .cont");
    bookInfo = Object.assign(bookInfo, {
      cover: cont.find(".divimg img").attr("src"),
      title: cont.find("h1 b").text(),
      description: cont.find("p").html(),
    });
    console.log("####bookInfo: ", bookInfo);
    var bookconts = $(".sons .bookcont");

    bookconts.each((index, item) => {
      var type = $(item).find(".bookMl strong").text();
      var chapterList = $(item).find("div:nth-child(2) span");
      chapterList.each(async (_index, _item) => {
        var chapter = $(_item).find("a");
        var href = origin + chapter.attr("href");
        var content = await parseChapterPage(href);

        await chapters.push({
          type: type,
          title: chapter.text(),
          href,
          content,
          // content: await parseChapterPage(href),
        });
      });
      // writeFile(chapters);
    });
    console.log("####chapters ", chapters);
  });
}

function parseChapterPage(pageUrl) {
  return new Promise((resolve, reject) => {
    // 当前章节的内容
    var chapter = {
      content: "",
      modernChinese: "",
      translation: "",
    };

    axios.get(pageUrl).then(async (resp) => {
      var $ = cheerio.load(resp.data);
      var id = $(".main3 .left").attr("id").slice(4);
      var html = await axios.get(
        `https://so.gushiwen.cn/guwen/ajaxbfanyi.aspx?id=${id}`
      );
      var $modernChinese = cheerio.load(html.data);
      chapter = Object.assign(chapter, {
        id: id,
        content: $(".left .cont .contson").text().trim(),
        modernChinese: $modernChinese(".sons p").text().trim(),
        translation: "",
      });
      setTimeout(() => {
        resolve(chapter);
      }, 1000);
    });
  });
}

parseBookIndexPage(
  "https://so.gushiwen.cn/guwen/book_46653FD803893E4F33D126D4A6B656E2.aspx"
);
// parseChapterPage(
//   `https://so.gushiwen.cn/guwen/bookv_46653FD803893E4FE654D96B4C8997DC.aspx`
// );

function writeFile(obj) {
  fs.writeFileSync("./message.json", JSON.stringify(obj));
}
// function getHtml(number) {
//   var href = 'http://www.dili360.com/gallery/' + number + '.htm';
//   console.log('正在获取第 ' + number + '个相册的图片信息...');
//   var pageData = '';
//   http.get(href, function (res) {
//     if (!res) {
//       return;
//     }
//     res.setEncoding('utf8');
//     res.on('data', function (chunk) {
//       pageData += chunk;
//     });
//     res.on('end', function () {
//       $ = cheerio.load(pageData);
//       var title = $('.title span').text();
//       title = title.replace(/[\"—\.\']/g, '_');
//       title = number + '_' + title.replace(/\s/gi, '_'); //替换空格为可识别的_
//       var date = $('.title .date').text();
//       var descript = $('#text-gallery-desc').text();
//       descript = descript.replace(/(^\s*)|(\s*$)/g, '');
//       var picObj = $('.thumb ul.slider li'); //每个轮播的数据实体
//       var url = '';
//       var urls = [];
//       picObj.each(function (index, item) {
//         url = item.attribs['data-source']; //data-source保存的是大图的src
//         urls.push(url);
//       });
//       //字符串拼接
//       w_data =
//         'title: ' +
//         title +
//         '\r\n' +
//         'date: ' +
//         date +
//         '\r\n' +
//         'descript: ' +
//         descript +
//         '\r\n' +
//         'href: ' +
//         href +
//         '\r\n' +
//         'urls: ' +
//         '\r\n' +
//         urls.toString().replace(/,/g, '\r\n');
//       //创建文件夹，创建简介，下载图片
//       setTimeout(mkdir(title, w_data, urls), 1000);
//     });
//   });
// } //getHtml(number) end

// /**
//  * 2、mkdir
//  * 创建保存文件的目录，不用自己去创建
//  * fs.mkdir
//  */
// function mkdir(fileName, w_data, imgurls) {
//   var newPath = path.join(__dirname, 'national-geographic', fileName);
//   fs.mkdir(newPath, function (err) {
//     if (err) {
//       throw err;
//     } else {
//       console.log('创建目录成功！');
//       writeFile(fileName, w_data); //写简介
//       downloadImg(imgurls, fileName); //下载图片
//     }
//   });
// } //mkdir(fileName,w_data,imgurls) end

// //写入简介文件
// function writeFile(fileName, w_data) {
//   var w_data = new Buffer(w_data);
//   /**
//    * fileName, 必选参数，文件名
//    * data, 写入的数据，可以字符或一个Buffer对象
//    * [options],flag,mode(权限),encoding
//    * callback 读取文件后的回调函数，参数默认第一个err,第二个data 数据
//    */
//   var newPath = path.join(
//     __dirname,
//     'national-geographic',
//     fileName,
//     '相册简介.txt'
//   );
//   fs.writeFile(newPath, w_data, { flag: 'a' }, function (err) {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log('相册简介.txt创建成功！');
//     }
//   });
// }
// /**
//  * 3、downloadImg
//  * 下载图片,在创建文件目录之后
//  * @param {String} imgurls：图片地址的数组
//  */
// function downloadImg(imgurls, fileName) {
//   imgurls.forEach(function (item, index) {
//     var itemSplit = item.split('.');
//     type = itemSplit[itemSplit.length - 1];
//     http.get(item, function (res) {
//       var imgData = '';
//       //一定要设置response的编码为binary否则会下载下来的图片打不开
//       res.setEncoding('binary');
//       res.on('data', function (chunk) {
//         imgData += chunk;
//       });
//       res.on('end', function () {
//         var imgName = index + 1 + '.' + type;
//         imgName = fileName + '_' + imgName;
//         var savePath = path.join(
//           __dirname,
//           'national-geographic',
//           fileName,
//           imgName
//         );
//         console.log(savePath);
//         // 写文件操作
//         fs.writeFile(savePath, imgData, 'binary', function (err) {
//           if (err) {
//             console.log(err);
//           } else {
//             console.log('图片' + imgName + '下载完成！');
//           }
//         });
//       });
//     });
//   });
// } //downloadImg end

// function start(startIndex, endIndex) {
//   for (var i = startIndex; i <= endIndex; i++) {
//     console.log('开始获取' + i + '相册的图片信息...');
//     getHtml(i); //每次爬取一个相册，保存好简介以及图片
//   }
// }

// var startIndex = 500;

// var endIndex = 520;
// //go
// start(startIndex, endIndex);
