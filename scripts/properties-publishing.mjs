#!/usr/bin/env node

/**
 * Create missing Strapi locale variants for properties (title + description).
 *
 * Safety:
 *   dry-run is the default
 *   --apply --limit=1   writes one apartment, backs up EN, aborts if EN changes
 *   --apply --yes       required to write more than one apartment
 *
 * Usage:
 *   node scripts/properties-publishing.mjs
 *   node scripts/properties-publishing.mjs --limit=1
 *   node scripts/properties-publishing.mjs --apply --limit=1
 *   node scripts/properties-publishing.mjs --apply --limit=1 --locales=uk
 *   node scripts/properties-publishing.mjs --apply --yes
 */

import fs from "fs";
import path from "path";
import { TARGET_LOCALES, localizeProperty } from "./lib/propertyLocales.mjs";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  process.env.STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN =
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  process.env.STRAPI_API_TOKEN ||
  "";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const raw of fs.readFileSync(envPath, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function parseArgs(argv) {
  const args = {
    apply: false,
    yes: false,
    limit: Infinity,
    documentId: "",
    locales: [...TARGET_LOCALES],
  };
  for (const arg of argv.slice(2)) {
    if (arg === "--apply") args.apply = true;
    else if (arg === "--dry-run") args.apply = false;
    else if (arg === "--yes") args.yes = true;
    else if (arg.startsWith("--limit=")) {
      args.limit = Number(arg.slice("--limit=".length));
    } else if (arg.startsWith("--documentId=")) {
      args.documentId = arg.slice("--documentId=".length).trim();
    } else if (arg.startsWith("--locales=")) {
      args.locales = arg
        .slice("--locales=".length)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!Number.isFinite(args.limit) || args.limit < 1) {
    args.limit = Infinity;
  }
  return args;
}

async function fetchEnglishProperties(apiUrl, token) {
  const rows = [];
  let page = 1;
  let pageCount = 1;
  while (page <= pageCount) {
    const params = new URLSearchParams({
      locale: "en",
      "pagination[page]": String(page),
      "pagination[pageSize]": "100",
      "fields[0]": "title",
      "fields[1]": "description",
      "fields[2]": "locale",
      "fields[3]": "documentId",
      "populate[localizations][fields][0]": "locale",
    });
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${apiUrl}/api/properties?${params}`, { headers });
    if (!res.ok) {
      throw new Error(`List properties HTTP ${res.status}: ${await res.text()}`);
    }
    const json = await res.json();
    rows.push(...(json.data || []));
    pageCount = json.meta?.pagination?.pageCount || 1;
    page += 1;
  }
  return rows;
}

function missingLocales(property, wanted) {
  const existing = new Set(
    (property.localizations || []).map((row) => row.locale).filter(Boolean)
  );
  existing.add(property.locale || "en");
  return wanted.filter((locale) => locale !== "en" && !existing.has(locale));
}

async function main() {
  loadEnvLocal();
  const apiUrl = (
    process.env.NEXT_PUBLIC_STRAPI_API_URL ||
    process.env.STRAPI_API_URL ||
    API_URL
  ).replace(/\/$/, "");
  const token =
    process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
    process.env.STRAPI_API_TOKEN ||
    API_TOKEN;

  if (!token) {
    throw new Error(
      "Missing NEXT_PUBLIC_STRAPI_API_TOKEN (or STRAPI_API_TOKEN)"
    );
  }

  const args = parseArgs(process.argv);
  const dryRun = !args.apply;
  console.log(
    dryRun
      ? "🔎 Dry-run (no writes). Pass --apply --limit=1 to write one apartment."
      : "✍️  Apply mode: will write locales, backup English, abort if EN changes."
  );
  console.log(`API: ${apiUrl}`);
  console.log(`Locales: ${args.locales.join(", ")}`);

  const all = await fetchEnglishProperties(apiUrl, token);
  let selected = args.documentId
    ? all.filter((row) => row.documentId === args.documentId)
    : all;

  if (args.documentId && selected.length === 0) {
    selected = [{ documentId: args.documentId, title: args.documentId }];
  }

  const work = [];
  for (const property of selected) {
    const missing = missingLocales(property, args.locales);
    if (missing.length === 0 && !args.documentId) continue;
    work.push({
      documentId: property.documentId,
      title: property.title,
      missing: missing.length ? missing : args.locales,
    });
    if (work.length >= args.limit) break;
  }

  if (work.length === 0) {
    console.log("✅ Nothing to do: every listed property already has these locales.");
    return;
  }

  if (args.apply && work.length > 1 && !args.yes) {
    throw new Error(
      `Refusing to write ${work.length} properties. Re-run with --apply --limit=1 first, then --apply --yes.`
    );
  }

  console.log(`Properties to process: ${work.length}`);
  for (const item of work) {
    console.log(`\n—— ${item.title} (${item.documentId})`);
    console.log(`   missing: ${item.missing.join(", ")}`);
    const outcome = await localizeProperty({
      apiUrl,
      token,
      documentId: item.documentId,
      locales: item.missing,
      dryRun,
      onProgress: ({ locale, phase, result, error }) => {
        if (phase === "done") {
          console.log(`   ${locale}: ${result.status}${result.title ? ` — ${result.title}` : ""}`);
        } else if (phase === "error") {
          console.log(`   ${locale}: ERROR ${error.message}`);
        }
      },
    });
    if (outcome.backupFile) {
      console.log(`   EN backup: ${outcome.backupFile}`);
    }
    const written = outcome.results.filter((row) => row.status === "written");
    const skippedIncomplete = outcome.results.filter(
      (row) => row.status === "skipped-incomplete"
    );
    const errors = outcome.results.filter((row) => row.status === "error");
    if (skippedIncomplete.length) {
      console.log(
        `   skipped-incomplete: EN missing required fields (${skippedIncomplete[0].error})`
      );
    }
    if (errors.length) {
      console.log(`   ⚠️  ${errors.length} locale(s) failed; English was left unchanged.`);
    }
    if (args.apply && work.length === 1 && written.length === 0 && errors.length) {
      throw new Error("First apartment wrote 0 locales; stopping.");
    }
  }

  console.log(dryRun ? "\n✅ Dry-run finished." : "\n✅ Apply finished.");
}

main().catch((error) => {
  console.error(`\n💥 ${error.message}`);
  process.exit(1);
});
