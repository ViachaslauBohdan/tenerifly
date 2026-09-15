import { Given, Then, When } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import type { CustomWorld } from "../support/world";

async function openMobileMenuIfNeeded(page: CustomWorld["page"]) {
  const openButton = page.getByRole("button", { name: "Open menu" });
  if (await openButton.isVisible().catch(() => false)) {
    await openButton.click();
    await page.locator("#site-header-mobile-menu").waitFor({
      state: "visible",
      timeout: 10_000,
    });
  }
}

function visibleNavLink(page: CustomWorld["page"], selector: string) {
  return page.locator(selector).filter({ visible: true }).first();
}

Given(
  "I open the English home page for navigation",
  async function (this: CustomWorld) {
    const response = await this.page.goto(`${this.baseUrl}/en`, {
      waitUntil: "networkidle",
      timeout: 120_000,
    });
    assert.ok(response, `No response from ${this.baseUrl}/en`);
    assert.ok(
      response.status() < 500,
      `App not reachable at ${this.baseUrl}/en (status ${response.status()})`
    );
    await this.page.waitForSelector("#home", { timeout: 30_000 });
  }
);

Given(
  "I open the English tours catalog for navigation",
  async function (this: CustomWorld) {
    const response = await this.page.goto(`${this.baseUrl}/en/tours`, {
      waitUntil: "networkidle",
      timeout: 120_000,
    });
    assert.ok(response, `No response from ${this.baseUrl}/en/tours`);
    assert.ok(
      response.status() < 500,
      `App not reachable at ${this.baseUrl}/en/tours (status ${response.status()})`
    );
  }
);

When(
  "I open the Tours section from the header",
  async function (this: CustomWorld) {
    await openMobileMenuIfNeeded(this.page);
    const mobileLink = this.page.locator(
      '#site-header-mobile-menu a[href="#excursions"]'
    );
    const link =
      (await mobileLink.count()) > 0
        ? mobileLink
        : visibleNavLink(this.page, 'a[href="#excursions"]');
    await link.waitFor({ state: "visible", timeout: 15_000 });
    await link.click();
  }
);

When("I open the tours catalog page", async function (this: CustomWorld) {
  const response = await this.page.goto(`${this.baseUrl}/en/tours`, {
    waitUntil: "networkidle",
    timeout: 120_000,
  });
  assert.ok(response, `No response from ${this.baseUrl}/en/tours`);
  assert.ok(response.status() < 500);
});

When("I open Home from the header", async function (this: CustomWorld) {
  await openMobileMenuIfNeeded(this.page);
  const mobileLink = this.page.locator(
    '#site-header-mobile-menu a[href="/en"], #site-header-mobile-menu a[href="/en/"]'
  );
  const link =
    (await mobileLink.count()) > 0
      ? mobileLink.first()
      : visibleNavLink(this.page, 'a[href="/en"], a[href="/en/"]');
  await link.waitFor({ state: "visible", timeout: 15_000 });
  await Promise.all([
    this.page.waitForURL(/\/en\/?$/, { timeout: 30_000 }),
    link.click(),
  ]);
});

When(
  "I switch the header language to Spanish",
  async function (this: CustomWorld) {
    const select = this.page.getByLabel("Select language").first();
    await select.waitFor({ state: "visible", timeout: 15_000 });
    await Promise.all([
      this.page.waitForURL(/\/es(\/|$)/, { timeout: 30_000 }),
      select.selectOption("es"),
    ]);
  }
);

Then(
  "the excursions section should be in view",
  async function (this: CustomWorld) {
    await this.page.waitForSelector("#excursions", { timeout: 15_000 });
    await this.page.waitForFunction(() => {
      const el = document.querySelector("#excursions");
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    }, undefined, { timeout: 15_000 });
  }
);

Then(
  "the excursions section should show an Atlántico catalog surface",
  async function (this: CustomWorld) {
    const section = this.page.locator("#excursions");
    const iframe = section.locator("iframe");
    const tiles = section.locator("a[href*='/tours']");
    await Promise.race([
      iframe.first().waitFor({ state: "attached", timeout: 20_000 }),
      tiles.first().waitFor({ state: "attached", timeout: 20_000 }),
    ]).catch(() => undefined);

    const iframeCount = await iframe.count();
    const tileCount = await tiles.count();
    assert.ok(
      iframeCount > 0 || tileCount > 0,
      "Expected iframe catalog or tour category links inside #excursions"
    );
  }
);

Then(
  "the page URL should include {string}",
  async function (this: CustomWorld, part: string) {
    assert.ok(
      this.page.url().includes(part),
      `Expected URL to include ${part}, got ${this.page.url()}`
    );
  }
);

Then(
  "the tours catalog should show an Atlántico catalog surface",
  async function (this: CustomWorld) {
    const iframe = this.page.locator("iframe");
    const tiles = this.page.locator("a[href*='category='], a[href*='/tours/']");
    await Promise.race([
      iframe.first().waitFor({ state: "attached", timeout: 20_000 }),
      tiles.first().waitFor({ state: "attached", timeout: 20_000 }),
    ]).catch(() => undefined);

    const iframeCount = await iframe.count();
    const tileCount = await tiles.count();
    assert.ok(
      iframeCount > 0 || tileCount > 0,
      "Expected iframe catalog or tour links on /tours"
    );
  }
);

Then(
  "the page URL should be the English homepage",
  async function (this: CustomWorld) {
    const url = new URL(this.page.url());
    assert.match(url.pathname, /^\/en\/?$/);
  }
);

Then("the home hero section should be visible", async function (this: CustomWorld) {
  await this.page.waitForSelector("#home", { timeout: 30_000 });
  assert.equal(await this.page.locator("#home").isVisible(), true);
});
