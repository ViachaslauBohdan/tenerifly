import { Given, Then, When } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import type { CustomWorld } from "../support/world";

async function fieldInfo(page: CustomWorld["page"], controlId: string) {
  return page.evaluate((id) => {
    const label = document.querySelector(`label[for="${id}"]`);
    const control = document.querySelector(`#${id}`);
    if (!label || !control) return null;
    const labelRect = label.getBoundingClientRect();
    const controlRect = control.getBoundingClientRect();
    return {
      containsControl: label.contains(control),
      labelHeight: Math.round(labelRect.height),
      controlWidth: Math.round(controlRect.width),
      controlHeight: Math.round(controlRect.height),
      tag: control.tagName,
    };
  }, controlId);
}

Given("I open the home page on Android Chrome", async function (this: CustomWorld) {
  const response = await this.page.goto(`${this.baseUrl}/ua`, {
    waitUntil: "networkidle",
    timeout: 120_000,
  });
  assert.ok(response, `No response from ${this.baseUrl}/ua`);
  assert.ok(
    response.status() < 500,
    `App not reachable at ${this.baseUrl}/ua (status ${response.status()}). Start the server first.`
  );
});

Given("the hero search section is visible", async function (this: CustomWorld) {
  await this.page.waitForSelector("#home", { timeout: 30_000 });
  await this.page.waitForSelector("#hero-leisure", { timeout: 30_000 });
});

Then(
  "the {string} field should be a full-width labeled select",
  async function (this: CustomWorld, controlId: string) {
    const info = await fieldInfo(this.page, controlId);
    assert.ok(info, `Missing label/control for #${controlId}`);
    assert.equal(info.tag, "SELECT");
    assert.equal(info.containsControl, true);
    assert.ok(info.labelHeight > 40, `Expected tall label hit area for #${controlId}`);
    assert.ok(
      info.controlWidth > 200,
      `Expected wide select hit area for #${controlId}`
    );
  }
);

Then(
  "the hero search should not show chevron icons",
  async function (this: CustomWorld) {
    const count = await this.page.locator("#home svg.lucide-chevron-down").count();
    assert.equal(count, 0);
  }
);

When(
  "I tap the label of the {string} field",
  async function (this: CustomWorld, controlId: string) {
    const label = this.page.locator(`label[for="${controlId}"]`);
    await label.tap();
  }
);

When(
  "I choose {string} in the {string} select",
  async function (this: CustomWorld, value: string, controlId: string) {
    await this.page.selectOption(`#${controlId}`, value);
  }
);

Then(
  "the {string} select value should be {string}",
  async function (this: CustomWorld, controlId: string, value: string) {
    const current = await this.page.locator(`#${controlId}`).inputValue();
    assert.equal(current, value);
  }
);

Then(
  "the hero date inputs should have no border",
  async function (this: CustomWorld) {
    const borders = await this.page.evaluate(() =>
      [
        ...document.querySelectorAll(
          "#home .mantine-DatePickerInput-input, #home input.compact-date-input"
        ),
      ].map((el) => ({
        borderWidth: getComputedStyle(el).borderWidth,
        boxShadow: getComputedStyle(el).boxShadow,
      }))
    );
    assert.ok(borders.length >= 2, "Expected pickup/dropoff date inputs");
    for (const style of borders) {
      assert.equal(style.borderWidth, "0px");
      assert.equal(style.boxShadow, "none");
    }
  }
);

When(
  "I choose another option in the {string} select",
  async function (this: CustomWorld, controlId: string) {
    const select = this.page.locator(`#${controlId}`);
    this.previousSelectValue = await select.inputValue();
    const nextValue = await select.evaluate((el: HTMLSelectElement) => {
      const options = [...el.options];
      return options.find((opt) => opt.value !== el.value)?.value ?? el.value;
    });
    await select.selectOption(nextValue);
  }
);

Then(
  "the {string} select value should have changed",
  async function (this: CustomWorld, controlId: string) {
    const current = await this.page.locator(`#${controlId}`).inputValue();
    assert.ok(this.previousSelectValue, "Previous select value was not stored");
    assert.notEqual(current, this.previousSelectValue);
  }
);
