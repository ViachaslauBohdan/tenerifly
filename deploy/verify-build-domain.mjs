#!/usr/bin/env node
/**
 * Verify build-time domain injection (no live server required).
 * Usage: NEXT_PUBLIC_SITE_URL=https://tenerife-tour.com node deploy/verify-build-domain.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const expectedHost = (() => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://tenerifly.io"
    ).hostname;
  } catch {
    console.error("Invalid NEXT_PUBLIC_SITE_URL");
    process.exit(1);
  }
})();

const mainPath = path.join(root, "src/i18n/main.json");
const main = JSON.parse(fs.readFileSync(mainPath, "utf8"));
const enNotice = main?.en?.footer?.legalNotice ?? "";

let failed = false;

if (!enNotice.includes(expectedHost)) {
  console.error(
    `FAIL main.json footer.legalNotice (en) does not contain "${expectedHost}"`
  );
  console.error(`  Got: ${enNotice.slice(0, 100)}...`);
  failed = true;
} else {
  console.log(`OK  main.json legal footer mentions ${expectedHost}`);
}

const legalPagePath = path.join(root, "src/i18n/legalPage.json");
if (fs.existsSync(legalPagePath)) {
  const legalPage = JSON.parse(fs.readFileSync(legalPagePath, "utf8"));
  if (legalPage?.en?.title) {
    console.log(`OK  legalPage.json present (${legalPage.en.title})`);
  }
}

const siteTs = fs.readFileSync(path.join(root, "src/lib/site.ts"), "utf8");
if (!siteTs.includes("NEXT_PUBLIC_SITE_URL")) {
  console.error("FAIL src/lib/site.ts missing NEXT_PUBLIC_SITE_URL");
  failed = true;
} else {
  console.log("OK  src/lib/site.ts reads NEXT_PUBLIC_SITE_URL");
}

if (failed) {
  console.error("\nRun: NEXT_PUBLIC_SITE_URL=https://tenerife-tour.com node scripts/fetch-translations.js");
  process.exit(1);
}

console.log("\nBuild-time domain checks passed.");
