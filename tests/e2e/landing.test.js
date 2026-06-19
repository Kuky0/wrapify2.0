const test = require("node:test");
const assert = require("node:assert");
const { Builder, By, until } = require("selenium-webdriver");

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";

test("Wrapify landing page loads", async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get(BASE_URL);

    const title = await driver.wait(
      until.elementLocated(By.css("h1")),
      10000
    );

    const titleText = await title.getText();

    assert.strictEqual(titleText, "Spotify Stats");

    const loginButton = await driver.findElement(
      By.linkText("Login with Spotify")
    );

    assert.ok(loginButton);
  } finally {
    await driver.quit();
  }
});

test("preview card opens and closes modal", async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get(BASE_URL);

    const firstPreviewCard = await driver.wait(
      until.elementLocated(By.css('[aria-label="Time range previews"] [role="button"]')),
      10000
    );

    await firstPreviewCard.click();

    const modal = await driver.wait(
      until.elementLocated(By.css('[role="dialog"]')),
      10000
    );

    const modalText = await modal.getText();

    assert.ok(modalText.includes("Playlist Settings"));

    const closeButton = await driver.findElement(
      By.css('[aria-label="Close preview"]')
    );

    await closeButton.click();

    await driver.wait(async () => {
      const modals = await driver.findElements(By.css('[role="dialog"]'));
      return modals.length === 0;
    }, 10000);
  } finally {
    await driver.quit();
  }
});