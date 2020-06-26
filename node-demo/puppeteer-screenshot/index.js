const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({
    width: 1200,
    height: 1000,
  });
  await page.goto('https://www.baidu.com/');
  await page.screenshot({ path: './screenshot.png' });
  // Get the "viewport" of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio,
    };
  });
  console.log('Dimensions:', dimensions);
  await browser.close();
})();
