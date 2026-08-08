import { After, Before } from "@cucumber/cucumber";
import type { CustomWorld } from "./world";

Before(async function (this: CustomWorld) {
  await this.openAndroidChrome();
});

After(async function (this: CustomWorld) {
  await this.closeBrowser();
});
