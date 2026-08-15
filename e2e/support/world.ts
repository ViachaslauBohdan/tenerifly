import {
  setWorldConstructor,
  World,
  IWorldOptions,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import {
  chromium,
  type Browser,
  type BrowserContext,
  type Page,
  devices,
} from "playwright";

setDefaultTimeout(60_000);

export type HeroWorld = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  baseUrl: string;
  previousSelectValue?: string;
  rememberedScrollY?: number;
};

export class CustomWorld extends World implements HeroWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  baseUrl = process.env.BROWSER_BASE_URL ?? "http://127.0.0.1:3000";
  previousSelectValue?: string;
  rememberedScrollY?: number;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async openAndroidChrome() {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext({
      ...devices["Pixel 5"],
    });
    this.page = await this.context.newPage();
  }

  async openIPhoneSafari() {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext({
      ...devices["iPhone 13"],
    });
    this.page = await this.context.newPage();
  }

  async closeBrowser() {
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);
