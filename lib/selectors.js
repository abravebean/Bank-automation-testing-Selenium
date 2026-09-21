const { By } = require('selenium-webdriver');

// Central place to keep your bank's page selectors so every test file
// references the same source of truth.
const SELECTORS = {
  usernameField: By.css('[data-testid="input-username"]'),
  passwordField: By.css('[data-testid="input-password"]'),
  submitButton: By.xpath("//span[text()='Login']"),
  mfaIndicator: By.css('[data-testid="mfa-challenge"]'),
  postLoginElement: By.xpath("//h1[contains(text(), 'Welcome back')]"),
  errorMessage: By.css('[data-testid="alert-error"]'),
  logoutButton: By.css('[data-testid="btn-logout"]'),
};

module.exports = { SELECTORS };