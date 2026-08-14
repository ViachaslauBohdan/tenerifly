import { Then } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import type { CustomWorld } from "../support/world";

Then(
  "I should see the listing type {string}",
  async function (this: CustomWorld, label: string) {
    const listingType = this.page.getByText(label, { exact: true }).first();
    await listingType.waitFor({ timeout: 30_000 });
    assert.ok(
      (await listingType.count()) >= 1,
      `Missing listing type "${label}"`
    );
  }
);
