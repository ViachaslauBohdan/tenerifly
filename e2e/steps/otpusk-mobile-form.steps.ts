import { Given, Then } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import type { CustomWorld } from "../support/world";

const OTPUSK_DESKTOP_FORM_HTML = `
  <div class="new_f-wrapper">
    <div class="new_f-title">Tour search</div>
    <div class="new_f-form">
      <div class="clearfix">
        <div class="new_f-form-field">Country, resort, hotel</div>
        <div class="new_f-form-field">From</div>
        <div class="new_f-form-field">Dates</div>
        <button class="new_f-form-submit" type="button">Search</button>
      </div>
    </div>
  </div>
`;

const OTPUSK_DESKTOP_FORM_CSS = `
  .new_f-form > .clearfix { width: 890px; }
  .new_f-form-field { float: left; width: 280px; height: 44px; }
  .new_f-form .new_f-form-submit { float: left; width: 120px; height: 44px; }
`;

Given("I open the world tours page on iPhone", async function (this: CustomWorld) {
  await this.page.route("https://export.otpusk.com/**", (route) => route.abort());
  await this.page.route("https://api.otpusk.com/**", (route) => route.abort());

  const response = await this.page.goto(`${this.baseUrl}/en/world-tours`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  assert.ok(response, `No response from ${this.baseUrl}/en/world-tours`);
  assert.ok(
    response.status() < 500,
    `App not reachable at ${this.baseUrl}/en/world-tours (status ${response.status()}).`
  );
  await this.page.waitForSelector("#otpusk-world-search-container", {
    timeout: 30_000,
  });
});

Given(
  "the Otpusk desktop tour form is injected into the world-tours host",
  async function (this: CustomWorld) {
    await this.page.evaluate(
      ({ html, css }) => {
        const style = document.createElement("style");
        style.setAttribute("data-testid", "otpusk-desktop-css");
        style.textContent = css;
        document.head.appendChild(style);

        const host = document.querySelector("#otpusk-world-search-container");
        if (!host) {
          throw new Error("Missing #otpusk-world-search-container");
        }
        host.innerHTML = html;
      },
      { html: OTPUSK_DESKTOP_FORM_HTML, css: OTPUSK_DESKTOP_FORM_CSS }
    );
  }
);

Then("the Otpusk form row should not be locked at 890px", async function (this: CustomWorld) {
  const width = await this.page.evaluate(() => {
    const row = document.querySelector(
      "#otpusk-world-search-container .new_f-form > .clearfix"
    );
    if (!row) return null;
    return Math.round(row.getBoundingClientRect().width);
  });
  assert.ok(width, "Otpusk form row is missing");
  assert.ok(
    width < 500,
    `Expected the Otpusk row to fit a phone, got ${width}px`
  );
});

Then(
  "the Otpusk tour fields should stay inside the host",
  async function (this: CustomWorld) {
    const overflow = await this.page.evaluate(() => {
      const host = document.querySelector("#otpusk-world-search-container");
      if (!host) return { missing: true, overflowing: [] as string[] };
      const hostRect = host.getBoundingClientRect();
      const overflowing = [
        ...host.querySelectorAll(".new_f-form-field, .new_f-form-submit"),
      ]
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          return rect.right > hostRect.right + 2 || rect.left < hostRect.left - 2;
        })
        .map((el) => el.textContent?.trim() || el.className);
      return { missing: false, overflowing };
    });
    assert.equal(overflow.missing, false);
    assert.deepEqual(
      overflow.overflowing,
      [],
      `Fields overflow the host: ${overflow.overflowing.join(", ")}`
    );
  }
);

Then(
  "the Otpusk tour fields should not overlap each other",
  async function (this: CustomWorld) {
    const overlaps = await this.page.evaluate(() => {
      const fields = [
        ...document.querySelectorAll(
          "#otpusk-world-search-container .new_f-form-field, #otpusk-world-search-container .new_f-form-submit"
        ),
      ];
      const hits: string[] = [];
      for (let i = 0; i < fields.length; i += 1) {
        for (let j = i + 1; j < fields.length; j += 1) {
          const a = fields[i].getBoundingClientRect();
          const b = fields[j].getBoundingClientRect();
          const overlap =
            a.left < b.right - 1 &&
            a.right > b.left + 1 &&
            a.top < b.bottom - 1 &&
            a.bottom > b.top + 1;
          if (overlap) {
            hits.push(
              `${fields[i].textContent?.trim()} overlaps ${fields[j].textContent?.trim()}`
            );
          }
        }
      }
      return hits;
    });
    assert.deepEqual(overlaps, [], overlaps.join("; "));
  }
);

Then(
  "the document should use the Otpusk phone form class",
  async function (this: CustomWorld) {
    await this.page.waitForFunction(() => {
      const host = document.querySelector("#otpusk-world-search-container");
      return (
        document.body.classList.contains("new_mobile-form") ||
        host?.classList.contains("new_mobile-form") === true
      );
    }, { timeout: 10_000 });
  }
);
