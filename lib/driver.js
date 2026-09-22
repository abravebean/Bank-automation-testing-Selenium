const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const HEADLESS = process.env.HEADLESS !== 'false'; // default true

async function buildDriver() {
  const options = new chrome.Options();
  if (HEADLESS) {
    options.addArguments('--headless=new');
  }
  options.addArguments(
    '--disable-gpu',
    '--window-size=1024,768',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--single-process',
    '--no-zygote',
    '--disable-extensions',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-component-extensions-with-background-pages',
    '--disable-features=TranslateUI,BlinkGenPropertyTrees',
    '--disable-ipc-flooding-protection',
    '--disable-renderer-backgrounding',
    '--mute-audio'
  );

  if (process.env.CHROME_BIN) {
    options.setChromeBinaryPath(process.env.CHROME_BIN);
  }

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

module.exports = { buildDriver, HEADLESS };