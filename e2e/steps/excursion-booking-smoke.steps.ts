import { Given, Then, When } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import type { CustomWorld } from "../support/world";

function assertBookingSmokeBase(baseUrl: string) {
  assert.match(
    baseUrl,
    /^https:\/\/(tenerife-tour\.vercel\.app|(www\.)?tenerifejoy\.com)\/?$/i,
    `Expected BROWSER_BASE_URL to be the dev site or tenerifejoy.com, got ${baseUrl}`
  );
}

async function dismissCookieBanner(page: CustomWorld["page"]) {
  const reject = page.getByRole("button", { name: "Reject" });
  if (await reject.isVisible().catch(() => false)) {
    await reject.click();
  }
}

Given(
  "I open the dev English tours catalog",
  async function (this: CustomWorld) {
    assertBookingSmokeBase(this.baseUrl);
    const response = await this.page.goto(`${this.baseUrl}/en/tours`, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
    assert.ok(response, `No response from ${this.baseUrl}/en/tours`);
    assert.ok(response.status() < 500, `Tours catalog failed (${response.status()})`);
    await dismissCookieBanner(this.page);
    await this.page
      .getByRole("link", { name: "Coach Tours" })
      .waitFor({ state: "visible", timeout: 60_000 });
  }
);

When("I open the Coach Tours category", async function (this: CustomWorld) {
  await this.page.getByRole("link", { name: "Coach Tours" }).click();
  await this.page.waitForURL(/category=/, { timeout: 30_000 });
  await this.page
    .locator("article")
    .filter({ hasText: "Teide Half Day" })
    .waitFor({ state: "visible", timeout: 60_000 });
});

When("I open the Teide Half Day tour", async function (this: CustomWorld) {
  const card = this.page.locator("article").filter({ hasText: "Teide Half Day" });
  await card.getByRole("link", { name: "View details" }).click();
  await this.page.waitForURL(/\/en\/tours\/\d+/, { timeout: 60_000 });
  await this.page
    .getByRole("button", { name: "Pay now" })
    .waitFor({ state: "visible", timeout: 60_000 });
});

Then(
  "the Atlántico booking form should offer a date",
  async function (this: CustomWorld) {
    const date = this.page.locator("label").filter({ hasText: "Date" }).locator("select");
    await date.waitFor({ state: "visible", timeout: 45_000 });
    const options = await date.locator("option").count();
    assert.ok(options > 0, "Expected at least one bookable date");
  }
);

When(
  "I submit a smoke-test excursion booking",
  async function (this: CustomWorld) {
    await this.page.locator("label").filter({ hasText: "Full name" }).locator("input").fill("Smoke Test");
    await this.page.locator("label").filter({ hasText: "Email" }).locator("input").fill("api-test@tenerifejoy.com");
    await this.page.getByPlaceholder("612 345 678").fill("612345678");
    await this.page
      .locator("label")
      .filter({ hasText: "Notes" })
      .locator("textarea")
      .fill("Automated smoke test. Please cancel.");

    const paymentResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes("/api/atlantico/book") &&
        response.request().method() === "POST",
      { timeout: 45_000 }
    );
    await this.page.getByRole("button", { name: "Pay now" }).click();
    const response = await paymentResponse;
    const payload = (await response.json()) as { paymentUrl?: string; error?: string };
    assert.equal(
      response.status(),
      200,
      payload.error || `Payment request failed (${response.status()})`
    );
    assert.match(
      payload.paymentUrl || "",
      /^https?:\/\//,
      `Expected a payment URL, got ${JSON.stringify(payload)}`
    );
    this.paymentUrl = payload.paymentUrl;
  }
);

Then("the excursion booking should open card payment", async function (this: CustomWorld) {
  assert.match(this.paymentUrl || "", /^https?:\/\//);
});
