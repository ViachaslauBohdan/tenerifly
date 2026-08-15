import { After, Before } from "@cucumber/cucumber";
import type { CustomWorld } from "./world";

Before({ tags: "not @iphone" }, async function (this: CustomWorld) {
  await this.openAndroidChrome();
});

Before({ tags: "@iphone" }, async function (this: CustomWorld) {
  await this.openIPhoneSafari();
});

After(async function (this: CustomWorld) {
  await this.closeBrowser();
});
