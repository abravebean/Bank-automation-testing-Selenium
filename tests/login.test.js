require('dotenv').config();
const { until } = require('selenium-webdriver');
const { buildDriver } = require('../lib/driver');
const { SELECTORS } = require('../lib/selectors');

const BANK_URL = process.env.BANK_URL;
const USERNAME = process.env.BANK_USERNAME;
const PASSWORD = process.env.BANK_PASSWORD;
const IMPLICIT_WAIT_MS = 10000;

module.exports = {
  name: 'login',
  description: 'Logs in with valid credentials and confirms the welcome screen appears.',
  async run() {
    if (!BANK_URL || !USERNAME || !PASSWORD) {
      throw new Error('Missing BANK_URL / BANK_USERNAME / BANK_PASSWORD in .env');
    }

    const driver = await buildDriver();
    try {
      await driver.get(BANK_URL);
      await driver.manage().setTimeouts({ implicit: IMPLICIT_WAIT_MS });

      const usernameEl = await driver.wait(
        until.elementLocated(SELECTORS.usernameField),
        IMPLICIT_WAIT_MS
      );
      await usernameEl.sendKeys(USERNAME);

      const passwordEl = await driver.findElement(SELECTORS.passwordField);
      await passwordEl.sendKeys(PASSWORD);

      const submitEl = await driver.findElement(SELECTORS.submitButton);
      await submitEl.click();

      await driver.wait(until.elementLocated(SELECTORS.postLoginElement), 15000);

      // Clean up by logging out before closing.
      const logoutEl = await driver.findElement(SELECTORS.logoutButton);
      await logoutEl.click();

      return 'Login succeeded — welcome screen detected, logged out.';
    } finally {
      await driver.sleep(5000);
      await driver.quit();
    }
  },
};