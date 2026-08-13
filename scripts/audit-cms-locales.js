#!/usr/bin/env node

/**
 * Audit Strapi cars + properties title/description coverage per CMS locale.
 * URL locale `ua` maps to Strapi `uk` (same as localeContentKey / cmsLocale).
 *
 * Usage:
 *   node scripts/audit-cms-locales.js
 *   NEXT_PUBLIC_STRAPI_API_URL=... NEXT_PUBLIC_STRAPI_API_TOKEN=... node scripts/audit-cms-locales.js
 */

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "";

const CMS_LOCALES = ["en", "ru", "uk", "pl", "de", "es", "fr"];
const MISSING_EXAMPLES = 8;

async function fetchPage(collection, locale, page, pageSize) {
  const params = new URLSearchParams();
  params.set("locale", locale);
  params.set("pagination[page]", String(page));
  params.set("pagination[pageSize]", String(pageSize));
  params.set("fields[0]", "title");
  params.set("fields[1]", "description");
  params.set("fields[2]", "locale");
  params.set("fields[3]", "documentId");

  const headers = { "Content-Type": "application/json" };
  if (API_TOKEN) headers.Authorization = `Bearer ${API_TOKEN}`;

  const res = await fetch(`${API_URL}/api/${collection}?${params}`, {
    headers,
  });
  if (!res.ok) {
    throw new Error(
      `${collection} locale=${locale} page=${page}: HTTP ${res.status}`
    );
  }
  return res.json();
}

async function auditCollection(collection) {
  const report = {};

  for (const locale of CMS_LOCALES) {
    let page = 1;
    let total = 0;
    let withDescription = 0;
    let emptyDescription = 0;
    const missingExamples = [];

    while (true) {
      const json = await fetchPage(collection, locale, page, 100);
      const batch = json.data || [];
      for (const row of batch) {
        total += 1;
        const desc = (row.description || "").trim();
        if (desc) {
          withDescription += 1;
        } else {
          emptyDescription += 1;
          if (missingExamples.length < MISSING_EXAMPLES) {
            missingExamples.push({
              documentId: row.documentId,
              title: (row.title || "").slice(0, 80),
            });
          }
        }
      }
      const pageCount = json.meta?.pagination?.pageCount || 1;
      if (page >= pageCount) break;
      page += 1;
    }

    report[locale] = {
      total,
      withDescription,
      emptyDescription,
      missingExamples,
    };
  }

  return report;
}

function printReport(collection, report, enTotal) {
  console.log(`\n=== ${collection} ===`);
  console.log(
    "locale | total | withDesc | emptyDesc | vs EN missing entries (approx)"
  );
  for (const locale of CMS_LOCALES) {
    const r = report[locale];
    const missingEntries =
      locale === "en" ? 0 : Math.max(0, enTotal - r.total);
    console.log(
      `${locale.padEnd(6)} | ${String(r.total).padStart(5)} | ${String(
        r.withDescription
      ).padStart(8)} | ${String(r.emptyDescription).padStart(9)} | ${missingEntries}`
    );
  }

  for (const locale of CMS_LOCALES) {
    if (locale === "en") continue;
    const r = report[locale];
    if (r.total === 0) {
      console.log(
        `\n[${collection}/${locale}] No localized entries — UI should fall back to EN.`
      );
      continue;
    }
    if (r.missingExamples.length > 0) {
      console.log(
        `\n[${collection}/${locale}] Examples with empty description:`
      );
      for (const ex of r.missingExamples) {
        console.log(`  - ${ex.documentId} | ${ex.title || "(no title)"}`);
      }
    }
  }
}

async function main() {
  if (!API_TOKEN) {
    console.warn(
      "Warning: NEXT_PUBLIC_STRAPI_API_TOKEN is empty; public endpoints may fail."
    );
  }
  console.log(`Auditing CMS at ${API_URL}`);
  console.log(`Locales: ${CMS_LOCALES.join(", ")} (ua → uk in the app)`);

  const cars = await auditCollection("cars");
  const properties = await auditCollection("properties");

  printReport("cars", cars, cars.en.total);
  printReport("properties", properties, properties.en.total);

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
