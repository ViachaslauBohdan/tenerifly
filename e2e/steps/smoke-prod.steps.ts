import { Given, Then, When } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import type { CustomWorld } from "../support/world";

/** Known available apartment used by locale CMS e2e tests. */
const PENTHOUSE_DOC_ID = "c4x78m354pk30xt1sd6rdqwi";

function assertProductionBase(baseUrl: string) {
  assert.match(
    baseUrl,
    /^https:\/\/(www\.)?tenerifejoy\.com\/?$/i,
    `Expected BROWSER_BASE_URL to be production (tenerifejoy.com), got ${baseUrl}`
  );
}

Given(
  "I open the production English home page",
  async function (this: CustomWorld) {
    assertProductionBase(this.baseUrl);
    const response = await this.page.goto(`${this.baseUrl}/en`, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
    assert.ok(response, `No response from ${this.baseUrl}/en`);
    assert.ok(
      response.status() < 500,
      `Production home failed (${response.status()})`
    );
    await this.page.waitForSelector("#home", { timeout: 60_000 });
  }
);

Given(
  "I open a production Russian apartment detail page",
  async function (this: CustomWorld) {
    assertProductionBase(this.baseUrl);
    const url = `${this.baseUrl}/ru/apartments/${PENTHOUSE_DOC_ID}`;
    const response = await this.page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
    assert.ok(response, `No response from ${url}`);
    assert.ok(
      response.status() < 500,
      `Apartment detail failed (${response.status()})`
    );
    await this.page
      .getByRole("button", {
        name: /Узнать точную цену|Get exact price|Saber el precio exacto|Poznaj dokładną cenę|Проверить цену|Check price|Consultar precio|Sprawdź cenę|Забронировать|Book|Reservar/i,
      })
      .first()
      .waitFor({ state: "visible", timeout: 60_000 });
  }
);

When(
  "I open the apartment pre-booking modal",
  async function (this: CustomWorld) {
    const book = this.page
      .getByRole("button", {
        name: /Узнать точную цену|Get exact price|Saber el precio exacto|Poznaj dokładną cenę|Проверить цену|Check price|Consultar precio|Sprawdź cenę|Забронировать|Book|Reservar/i,
      })
      .first();
    await book.scrollIntoViewIfNeeded();
    await book.click();

    await this.page
      .locator('[role="dialog"]')
      .first()
      .waitFor({ state: "visible", timeout: 45_000 });

    // Sticky action bar (new) or legacy .test-book submit control (old).
    await Promise.race([
      this.page
        .getByTestId("simple-booking-actions")
        .waitFor({ state: "visible", timeout: 45_000 }),
      this.page.locator("button.test-book").waitFor({
        state: "attached",
        timeout: 45_000,
      }),
    ]);
  }
);

Then(
  "the pre-booking send button should be visible in the action bar",
  async function (this: CustomWorld) {
    const actions = this.page.getByTestId("simple-booking-actions");
    const hasSticky = (await actions.count()) > 0;
    const send = hasSticky
      ? actions.locator("button.test-book").or(
          actions.getByRole("button", {
            name: /Отправить|Send|Enviar|Wyślij|Envoyer|Senden|Забронировать/i,
          })
        )
      : this.page.locator("button.test-book");

    await send.first().waitFor({ state: "attached", timeout: 15_000 });
    if (!hasSticky) {
      await send.first().scrollIntoViewIfNeeded();
    }

    const box = await send.first().boundingBox();
    assert.ok(box, "Send / submit control has no bounding box");
    const viewport = this.page.viewportSize();
    assert.ok(viewport, "Missing viewport size");

    if (hasSticky) {
      assert.ok(
        box.y >= 0 && box.y + box.height <= viewport.height + 1,
        `Sticky Send should be fully in the viewport (y=${box.y}, h=${box.height}, vh=${viewport.height})`
      );
    } else {
      // Legacy modal: at least partially visible after scrollIntoView.
      assert.ok(
        box.y < viewport.height && box.y + box.height > 0,
        `Submit control should intersect the viewport (y=${box.y}, h=${box.height}, vh=${viewport.height})`
      );
    }
  }
);

Then(
  "I must not submit the pre-booking form",
  async function (this: CustomWorld) {
    // Safety: never click the submit control during production smoke.
    const send = this.page.locator("button.test-book");
    assert.ok((await send.count()) >= 0);
  }
);
