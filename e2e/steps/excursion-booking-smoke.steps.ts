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
    .getByRole("button", { name: "Book now" })
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

    await this.page.getByRole("button", { name: "Book now" }).click();

    const confirmed = this.page.getByRole("heading", { name: "Reservation confirmed" });
    const error = this.page.locator("form p.text-red-600").last();
    await Promise.race([
      confirmed.waitFor({ state: "visible", timeout: 45_000 }),
      error.waitFor({ state: "visible", timeout: 45_000 }),
    ]);

    if (await error.isVisible().catch(() => false)) {
      const message = (await error.textContent())?.trim() || "Booking failed";
      assert.fail(message);
    }
  }
);

Then("the excursion booking should be confirmed", async function (this: CustomWorld) {
  await this.page
    .getByRole("heading", { name: "Reservation confirmed" })
    .waitFor({ state: "visible" });
  const reference = this.page.locator("p.font-mono");
  const text = (await reference.textContent())?.trim() || "";
  const code = text.replace(/^Booking code:\s*/i, "").trim();
  assert.match(code, /\S+/, `Expected a booking code, got "${text}"`);
  assert.notEqual(code, "0");
  assert.notEqual(code, "1");
  this.bookingCode = code;
});

Then("the smoke-test booking should be cancelled", async function (this: CustomWorld) {
  const code = this.bookingCode;
  assert.ok(code, "No booking code to cancel");
  const note = encodeURIComponent("smoke test");
  const response = await fetch(
    `https://api.atlanticoexcursiones.com/cancelBooking/${encodeURIComponent(code)}/${note}`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
    }
  );
  const body = (await response.text()).slice(0, 300);
  assert.ok(
    response.ok,
    `Booking ${code} was created but cancel failed (${response.status}): ${body}`
  );
});
