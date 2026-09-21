require('dotenv').config();
const { until } = require('selenium-webdriver');
const { buildDriver } = require('../lib/driver');
const { SELECTORS } = require('../lib/selectors');

const BANK_URL = process.env.BANK_URL;
const IMPLICIT_WAIT_MS = 10000;

module.exports = {
  name: 'invalid-login-rejected',
  description: 'Confirms an incorrect password shows an error and does not reach the welcome screen.',
  async run() {
    if (!BANK_URL) {
      throw new Error('Missing BANK_URL in .env');
    }

    const driver = await buildDriver();
    try {
      await driver.get(BANK_URL);
      await driver.manage().setTimeouts({ implicit: IMPLICIT_WAIT_MS });

      const usernameEl = await driver.wait(
        until.elementLocated(SELECTORS.usernameField),
        IMPLICIT_WAIT_MS
      );
      await usernameEl.sendKeys('not-a-real-user');

      const passwordEl = await driver.findElement(SELECTORS.passwordField);
      await passwordEl.sendKeys('definitely-wrong-password');

      const submitEl = await driver.findElement(SELECTORS.submitButton);
      await submitEl.click();

      const errorEl = await driver.wait(until.elementLocated(SELECTORS.errorMessage), 5000);
      const errorText = await errorEl.getText();

      return `Correctly rejected invalid credentials — error shown: "${errorText}"`;
    } finally {
      await driver.sleep(5000);
      await driver.quit();
    }
  },
};