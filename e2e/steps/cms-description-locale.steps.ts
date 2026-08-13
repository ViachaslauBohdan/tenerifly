import { Given, Then, When } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import type { CustomWorld } from "../support/world";

/** Known CMS document with UA/RU car descriptions (BMW 2024 Cabrio). */
const BMW_2024_DOC_ID = "hfkmlq9cufuyrdb8kw2xb7l7";
/** Known EN-only apartment used to assert UI label localization. */
const PENTHOUSE_DOC_ID = "c4x78m354pk30xt1sd6rdqwi";

Given(
  "I open the cars catalog on {string}",
  async function (this: CustomWorld, locale: string) {
    const response = await this.page.goto(`${this.baseUrl}/${locale}/cars`, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
    assert.ok(response, `No response from /${locale}/cars`);
    assert.ok(
      response.status() < 500,
      `Cars catalog not reachable (status ${response.status()})`
    );
  }
);

Given(
  "I open the apartments catalog on {string}",
  async function (this: CustomWorld, locale: string) {
    const response = await this.page.goto(
      `${this.baseUrl}/${locale}/apartments`,
      {
        waitUntil: "domcontentloaded",
        timeout: 120_000,
      }
    );
    assert.ok(response, `No response from /${locale}/apartments`);
    assert.ok(
      response.status() < 500,
      `Apartments catalog not reachable (status ${response.status()})`
    );
  }
);

When(
  "I open the first car detail from the catalog",
  async function (this: CustomWorld) {
    // Prefer a known localized car; fall back to first details control in the catalog.
    const locale = new URL(this.page.url()).pathname.split("/")[1] || "ua";
    const direct = await this.page.goto(
      `${this.baseUrl}/${locale}/cars/${BMW_2024_DOC_ID}`,
      { waitUntil: "domcontentloaded", timeout: 120_000 }
    );
    if (direct && direct.status() < 400) {
      await this.page.waitForSelector("h2", { timeout: 30_000 });
      return;
    }

    await this.page.goto(`${this.baseUrl}/${locale}/cars`, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
    const details = this.page
      .locator("button, a")
      .filter({ hasText: /Детальніше|Подробнее|View Details|Ver detalles/i })
      .first();
    await details.waitFor({ timeout: 30_000 });
    await details.click();
    await this.page.waitForURL(/\/cars\//, { timeout: 30_000 });
    await this.page.waitForSelector("h2", { timeout: 30_000 });
  }
);

When(
  "I open the first apartment detail from the catalog",
  async function (this: CustomWorld) {
    const locale = new URL(this.page.url()).pathname.split("/")[1] || "ua";
    const direct = await this.page.goto(
      `${this.baseUrl}/${locale}/apartments/${PENTHOUSE_DOC_ID}`,
      { waitUntil: "domcontentloaded", timeout: 120_000 }
    );
    if (direct && direct.status() < 400) {
      await this.page.waitForSelector("h2", { timeout: 30_000 });
      return;
    }

    await this.page.goto(`${this.baseUrl}/${locale}/apartments`, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
    const details = this.page
      .locator("button, a")
      .filter({ hasText: /Детальніше|Подробнее|View Details|Ver detalles/i })
      .first();
    await details.waitFor({ timeout: 30_000 });
    await details.click();
    await this.page.waitForURL(/\/apartments\//, { timeout: 30_000 });
    await this.page.waitForSelector("h2", { timeout: 30_000 });
  }
);

Then(
  "the detail description heading should be {string}",
  async function (this: CustomWorld, heading: string) {
    const h2 = this.page.getByRole("heading", { name: heading, exact: true });
    await h2.waitFor({ timeout: 30_000 });
    assert.equal(await h2.count(), 1);
  }
);

Then(
  "the detail description body should contain Cyrillic text",
  async function (this: CustomWorld) {
    const text = await this.page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll("h2")).find((el) =>
        /Опис|Описание|Description/i.test(el.textContent || "")
      );
      const body = heading?.parentElement?.querySelector("p");
      return (body?.textContent || "").trim();
    });
    assert.ok(text.length > 0, "Description body is empty");
    assert.match(
      text,
      /[\u0400-\u04FF]/,
      `Expected Cyrillic description, got: ${text.slice(0, 120)}`
    );
  }
);

Then(
  "the detail description body should not be empty",
  async function (this: CustomWorld) {
    const text = await this.page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll("h2")).find((el) =>
        /Опис|Описание|Description/i.test(el.textContent || "")
      );
      const body = heading?.parentElement?.querySelector("p");
      return (body?.textContent || "").trim();
    });
    assert.ok(text.length > 10, `Description body too short: "${text}"`);
  }
);
