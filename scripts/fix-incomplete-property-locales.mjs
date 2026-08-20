#!/usr/bin/env node

/**
 * Fill EN category/location/specs for properties that were imported
 * without components (they stay English on /pl and show "—"), then
 * create missing locale title/description via localizeProperty.
 *
 *   node scripts/fix-incomplete-property-locales.mjs
 *   node scripts/fix-incomplete-property-locales.mjs --apply
 */
import fs from "fs";
import path from "path";
import {
  fetchPropertyLocaleFull,
  localizeProperty,
  putPropertyLocale,
} from "./lib/propertyLocales.mjs";

const CONTACT = {
  name: "Adam Savytskyi",
  email: "adamsavitskiy@gmail.com",
  phone: "+34604972372",
  whatsapp: "+34604972372",
  telegram: "@adamsvts",
  preferred_contact: "telegram",
};

const PATCHES = {
  wjtitfp8r915qw8pcr3dgkru: {
    category: "apartment",
    price: { amount: 850, currency: "EUR", period: "month" },
    location: {
      address: "Playa de San Juan",
      city: "Playa de San Juan",
      region: "Tenerife",
    },
    specifications: { bedrooms: 2, bathrooms: 1, total_area: 75 },
    features: {
      has_pool: false,
      has_garden: false,
      has_garage: false,
      has_terrace: true,
      has_security: false,
      has_air_conditioning: false,
      has_heating: false,
      has_internet: true,
      furnished: true,
    },
    contact: CONTACT,
  },
  xj2x8ifjcwg7ryr5wq99ag2j: {
    category: "apartment",
    price: { amount: 90, currency: "EUR", period: "day" },
    location: {
      address: "Orlando Complex",
      city: "Las Americas",
      region: "Tenerife",
    },
    specifications: { bedrooms: 2, bathrooms: 1, total_area: 70 },
    features: {
      has_pool: true,
      has_garden: false,
      has_garage: false,
      has_terrace: true,
      has_security: false,
      has_air_conditioning: false,
      has_heating: false,
      has_internet: true,
      furnished: true,
    },
    contact: CONTACT,
  },
  uv6bmf3ozx1nt7fgbgag0y0c: {
    category: "apartment",
    price: { amount: 90, currency: "EUR", period: "day" },
    location: {
      address: "San Juan",
      city: "Playa de San Juan",
      region: "Tenerife",
    },
    specifications: { bedrooms: 2, bathrooms: 2, total_area: 80 },
    features: {
      has_pool: false,
      has_garden: false,
      has_garage: false,
      has_terrace: true,
      has_security: false,
      has_air_conditioning: false,
      has_heating: false,
      has_internet: true,
      furnished: true,
    },
    contact: CONTACT,
  },
  colni4312ukn8h7sf9cod9mw: {
    category: "apartment",
    price: { amount: 70, currency: "EUR", period: "day" },
    location: {
      address: "Los Cristianos",
      city: "Los Cristianos",
      region: "Tenerife",
    },
    specifications: { bedrooms: 1, bathrooms: 1, total_area: 30 },
    features: {
      has_pool: false,
      has_garden: false,
      has_garage: false,
      has_terrace: false,
      has_security: false,
      has_air_conditioning: false,
      has_heating: false,
      has_internet: false,
      furnished: true,
    },
    contact: CONTACT,
  },
};

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

async function main() {
  loadEnvLocal();
  const apply = process.argv.includes("--apply");
  const apiUrl = (
    process.env.NEXT_PUBLIC_STRAPI_API_URL ||
    "https://tenerifly-strapi-production.up.railway.app"
  ).replace(/\/$/, "");
  const token =
    process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || process.env.STRAPI_API_TOKEN;
  if (!token) throw new Error("Missing STRAPI API token");

  console.log(apply ? "✍️  Apply" : "🔎 Dry-run");

  for (const [documentId, data] of Object.entries(PATCHES)) {
    const en = await fetchPropertyLocaleFull(apiUrl, token, documentId, "en");
    if (!en) throw new Error(`Missing EN ${documentId}`);
    console.log(`\n—— ${en.title} (${documentId})`);
    console.log(
      `   before: category=${en.category} city=${en.location?.city || "—"} beds=${en.specifications?.bedrooms ?? "—"}`
    );
    if (!apply) continue;

    await putPropertyLocale(apiUrl, token, documentId, "en", data);
    const after = await fetchPropertyLocaleFull(apiUrl, token, documentId, "en");
    if (after.title !== en.title || after.description !== en.description) {
      throw new Error(`EN title/description changed for ${documentId}`);
    }
    console.log(
      `   after: category=${after.category} city=${after.location?.city} beds=${after.specifications?.bedrooms}`
    );

    const outcome = await localizeProperty({
      apiUrl,
      token,
      documentId,
      dryRun: false,
      onProgress: ({ locale, phase, result, error }) => {
        if (phase === "done") {
          console.log(
            `   ${locale}: ${result.status}${result.title ? ` — ${result.title}` : ""}`
          );
        } else if (phase === "error") {
          console.log(`   ${locale}: ERROR ${error.message}`);
        }
      },
    });
    const errors = outcome.results.filter((row) => row.status === "error");
    if (errors.length) {
      throw new Error(`${documentId} failed ${errors.length} locale(s)`);
    }
  }

  console.log(apply ? "\n✅ Done." : "\n✅ Dry-run. Pass --apply to write.");
}

main().catch((error) => {
  console.error(`\n💥 ${error.message}`);
  process.exit(1);
});
