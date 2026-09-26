import { Given, Then, When } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import type { CustomWorld } from "../support/world";

async function openEnglishHome(world: CustomWorld) {
  const response = await world.page.goto(`${world.baseUrl}/en`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  assert.ok(response, `No response from ${world.baseUrl}/en`);
  assert.ok(
    response.status() < 500,
    `App not reachable at ${world.baseUrl}/en (status ${response.status()})`
  );
}

function banner(page: CustomWorld["page"]) {
  return page.getByRole("dialog", { name: "Cookies" });
}

async function adsTagCount(page: CustomWorld["page"]) {
  return page.locator('script[src*="googletagmanager.com/gtag/js"]').count();
}

Given(
  "I open the English home page for cookie consent",
  async function (this: CustomWorld) {
    await openEnglishHome(this);
  }
);

Then(
  "the cookie consent banner should be visible",
  async function (this: CustomWorld) {
    await banner(this.page).waitFor({ state: "visible", timeout: 15_000 });
  }
);

Then(
  "the cookie consent banner should be hidden",
  async function (this: CustomWorld) {
    await banner(this.page).waitFor({ state: "hidden", timeout: 15_000 });
  }
);

Then(
  "the Google ads tag should not be loaded",
  async function (this: CustomWorld) {
    await this.page.waitForFunction(
      () => document.documentElement.dataset.cookieAds === "off",
      undefined,
      { timeout: 15_000 }
    );
    assert.equal(await adsTagCount(this.page), 0);
  }
);

Then("the Google ads tag should be loaded", async function (this: CustomWorld) {
  await this.page.waitForFunction(
    () => document.documentElement.dataset.cookieAds === "on",
    undefined,
    { timeout: 15_000 }
  );
  await this.page.waitForFunction(
    () =>
      [...document.scripts].some((script) =>
        script.src.includes("googletagmanager.com/gtag/js")
      ),
    undefined,
    { timeout: 15_000 }
  );
});

When("I accept cookies", async function (this: CustomWorld) {
  await banner(this.page).getByRole("button", { name: "Accept" }).click();
});

When("I reject cookies", async function (this: CustomWorld) {
  await banner(this.page).getByRole("button", { name: "Reject" }).click();
});

Then("cookie settings should be available", async function (this: CustomWorld) {
  await this.page
    .getByRole("button", { name: "Cookie settings" })
    .waitFor({ state: "visible", timeout: 15_000 });
});

When("I open cookie settings", async function (this: CustomWorld) {
  await this.page.getByRole("button", { name: "Cookie settings" }).click();
});

When("I reload the page", async function (this: CustomWorld) {
  await this.page.reload({ waitUntil: "domcontentloaded", timeout: 120_000 });
});
