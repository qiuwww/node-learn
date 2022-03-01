// 同步任务
const middleware1 = (req, res, next) => {
  console.log("middleware1 start");
  next();
  // 这里会在middleware2 end前就结束了
  // 也就是middleware2只嵌套了其后的任务
  console.log("middleware1 end");
};

// 同步任务
const middleware2 = (req, res, next) => {
  console.log("middleware2 start");
  next();
  console.log("middleware2 end");
};

// 同步任务
const middleware3 = (req, res, next) => {
  console.log("middleware3 start");
  next();
  console.log("middleware3 end");
};

// 中间件数组，解析的时候，收集中间件的执行
const middlewares = [middleware1, middleware2, middleware3];

function run(req, res) {
  // 要递归的run方法
  const next = () => {
    // 获取中间件数组中第一个中间件
    const middleware = middlewares.shift();
    if (middleware) {
      // 这里在next之后的代码也是会执行的
      middleware(req, res, next);
    }
  };
  next();
}
run(); // 模拟一次请求发起
