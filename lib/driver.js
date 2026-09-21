const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const HEADLESS = process.env.HEADLESS !== 'false'; // default true

async function buildDriver() {
  const options = new chrome.Options();
  if (HEADLESS) {
    options.addArguments('--headless=new');
  }
  options.addArguments('--disable-gpu', '--window-size=1280,900', '--no-sandbox');

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

module.exports = { buildDriver, HEADLESS };
