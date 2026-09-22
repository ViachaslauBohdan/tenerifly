#!/usr/bin/env node
/**
 * Safe production smoke: click-through checks on https://tenerifejoy.com.
 * Does not start a local server. Never submits booking forms.
 *
 * Usage: npm run test:browser:prod
 * Override: BROWSER_BASE_URL=https://tenerifejoy.com npm run test:browser:prod
 */
const { spawn } = require("child_process");

const DEFAULT_PROD = "https://tenerifejoy.com";

async function main() {
  const baseUrl = (process.env.BROWSER_BASE_URL || DEFAULT_PROD).replace(
    /\/$/,
    ""
  );

  if (!/^https:\/\/(www\.)?tenerifejoy\.com$/i.test(baseUrl)) {
    console.error(
      `Refusing to run @smoke-prod against non-production URL: ${baseUrl}`
    );
    process.exit(1);
  }

  console.log(`Running @smoke-prod against ${baseUrl}`);

  const child = spawn(
    "npx",
    ["cucumber-js", "--tags", "@smoke-prod"],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        BROWSER_BASE_URL: baseUrl,
      },
    }
  );

  child.on("close", (code, signal) => {
    process.exit(code ?? (signal ? 1 : 0));
  });
}

main();
