const middleware1 = (req, res, next) => {
  console.log('middleware1 start');
  // 所有的中间件都应返回一个Promise对象
  // Promise.resolve()方法接收中间件返回的Promise对象，供下层中间件异步控制
  return next().then(() => {
    console.log('middleware1 end');
  });
};

// async函数自动返回Promise对象
const middleware2 = async (req, res, next) => {
  console.log('middleware2 start');
  await new Promise((resolve) => {
    setTimeout(() => resolve(), 1000);
  });
  await next();
  console.log('middleware2 end');
};

const middleware3 = async (req, res, next) => {
  console.log('middleware3 start');
  await next();
  console.log('middleware3 end');
};

// 中间件数组
const middlewares = [middleware1, middleware2, middleware3];
function run(req, res) {
  const next = () => {
    // 获取中间件数组中第一个中间件
    const middleware = middlewares.shift();
    if (middleware) {
      middleware(req, res, next);
    }
  };
  next();
}
run(); // 模拟一次请求发起
