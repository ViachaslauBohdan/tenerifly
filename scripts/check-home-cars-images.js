#!/usr/bin/env node

/**
 * Check home-page car picks from Strapi (same query as getHomeCars / useDataLoader).
 * Reports missing or broken images for the first 3 displayed cars per locale.
 */

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

const HOME_CARS_FETCH_LIMIT = 24;
const HOME_PREVIEW_LIMIT = 6;
const HOME_DISPLAY_LIMIT = 3;

const LOCALES = ["en", "ru", "pl", "fr", "uk", "de", "es"];

function localeContentKey(language) {
  return language === "ua" ? "uk" : language;
}

function homeListQuery(limit) {
  return `pagination[pageSize]=${limit}&publicationState=live`;
}

function homePopulateQuery() {
  return "populate=*";
}

function carHasHomeImage(car) {
  const rawUrl =
    typeof car.image === "string" ? car.image : car.images?.[0]?.url;
  return Boolean(rawUrl);
}

function compareHomeCarTitle(a, b) {
  return (a.title ?? "").localeCompare(b.title ?? "", undefined, {
    sensitivity: "base",
  });
}

function pickHomeCarsByLocale(rows, language) {
  const localeKey = localeContentKey(language);
  const withImages = rows.filter(carHasHomeImage).sort(compareHomeCarTitle);
  const forLocale = withImages.filter((car) => car.locale === localeKey);
  const pool =
    forLocale.length >= HOME_PREVIEW_LIMIT ? forLocale : withImages;
  return pool.slice(0, HOME_PREVIEW_LIMIT);
}

/** Same shape as ssgDataService toHomeCar */
function toHomeCar(car) {
  return {
    id: car.id,
    documentId: car.documentId,
    title:
      car.title ||
      `${car.specifications?.make || "Car"} ${car.specifications?.model || ""}`.trim(),
    images: car.images?.length ? [car.images[0]] : [],
    specifications: car.specifications,
    type: car.type,
    rental_prices: car.rental_prices,
  };
}

/** Same as LocalePageClient getCarImage */
function getCarImageSrc(car, apiUrlForRelative = API_URL) {
  const rawUrl = car.image || car.images?.[0]?.url;
  if (!rawUrl) return null;
  if (typeof rawUrl === "string" && rawUrl.startsWith("http")) return rawUrl;
  return `${apiUrlForRelative}${rawUrl}`;
}

function analyzeImagesField(images) {
  if (images == null) return { status: "null", count: 0, firstUrl: null };
  if (!Array.isArray(images)) {
    const data = images?.data;
    if (Array.isArray(data)) {
      return analyzeImagesArray(data);
    }
    return { status: "not-array", count: 0, firstUrl: null, rawType: typeof images };
  }
  return analyzeImagesArray(images);
}

function analyzeImagesArray(images) {
  if (images.length === 0) {
    return { status: "empty-array", count: 0, firstUrl: null };
  }
  const first = images[0];
  const url =
    first?.url ||
    first?.attributes?.url ||
    (typeof first === "string" ? first : null);
  if (!url) {
    return {
      status: "no-url-on-first",
      count: images.length,
      firstUrl: null,
      firstKeys: first && typeof first === "object" ? Object.keys(first) : [],
    };
  }
  return { status: "ok", count: images.length, firstUrl: url };
}

async function fetchHomeCarsRaw() {
  const endpoint = `/cars?${homePopulateQuery()}&${homeListQuery(HOME_CARS_FETCH_LIMIT)}&sort=title:ASC`;
  const url = `${API_URL}/api${endpoint}`;
  const headers = { "Content-Type": "application/json" };
  if (API_TOKEN) headers.Authorization = `Bearer ${API_TOKEN}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  const json = await res.json();
  return { rows: json.data || [], url };
}

async function probeUrl(url, timeoutMs = 8000) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, { method: "HEAD", signal: ctrl.signal });
    clearTimeout(t);
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function main() {
  console.log("Home cars image check (Strapi)\n");
  console.log(`API: ${API_URL}`);
  console.log(`Token: ${API_TOKEN ? "set" : "not set"}\n`);

  const { rows, url } = await fetchHomeCarsRaw();
  console.log(`Fetched ${rows.length} cars (home query)`);
  console.log(`URL: ${url}\n`);

  if (rows.length === 0) {
    console.log("No cars returned — nothing to check.");
    process.exit(1);
  }

  let anyMissingOnHome = false;

  for (const locale of LOCALES) {
    const picked = pickHomeCarsByLocale(rows, locale).map(toHomeCar);
    const displayed = picked.slice(0, HOME_DISPLAY_LIMIT);

    console.log(`--- Locale: ${locale} (display ${displayed.length} of ${picked.length} picked) ---`);

    for (let i = 0; i < displayed.length; i++) {
      const transformed = displayed[i];
      const raw = pickHomeCarsByLocale(rows, locale)[i];
      const rawImg = analyzeImagesField(raw?.images);
      const uiSrc = getCarImageSrc(transformed);
      const uiSrcWrongHost = getCarImageSrc(
        transformed,
        "https://tenerifly.io"
      );

      const missingOnTransformed =
        !transformed.images?.length || !transformed.images[0]?.url;
      const line = [
        `  [${i + 1}] ${transformed.title || "(no title)"}`,
        `documentId=${transformed.documentId}`,
        `locale=${raw?.locale}`,
      ].join(" | ");

      console.log(line);
      console.log(`       Strapi images: ${rawImg.status} (count=${rawImg.count})`);
      if (rawImg.firstUrl) console.log(`       Strapi first url: ${rawImg.firstUrl}`);
      if (rawImg.firstKeys?.length) {
        console.log(`       First image keys: ${rawImg.firstKeys.join(", ")}`);
      }

      console.log(
        `       After toHomeCar: images.length=${transformed.images?.length ?? 0}, has url=${Boolean(transformed.images?.[0]?.url)}`
      );
      console.log(
        `       getCarImage (STRAPI host): ${uiSrc ?? "MISSING → placeholder"}`
      );
      if (uiSrcWrongHost && uiSrcWrongHost !== uiSrc) {
        console.log(
          `       getCarImage (tenerifly.io host — LocalePageClient default): ${uiSrcWrongHost}`
        );
      }

      if (missingOnTransformed || !uiSrc) {
        anyMissingOnHome = true;
        console.log("       ⚠️  Would show placeholder on home page");
      } else {
        const probe = await probeUrl(uiSrc);
        if (probe.ok) {
          console.log(`       ✓ Image reachable (${probe.status})`);
        } else {
          anyMissingOnHome = true;
          console.log(
            `       ⚠️  Image URL not reachable: ${probe.status ?? probe.error}`
          );
        }
      }
    }
    console.log("");
  }

  // Global stats
  const allMissing = rows.filter((car) => {
    const a = analyzeImagesField(car.images);
    return a.status !== "ok";
  });

  console.log("=== All fetched cars (24) image summary ===");
  console.log(`With valid first image: ${rows.length - allMissing.length}`);
  console.log(`Missing / invalid images: ${allMissing.length}`);
  if (allMissing.length > 0) {
    console.log("\nCars without valid images in this batch:");
    for (const car of allMissing) {
      const a = analyzeImagesField(car.images);
      console.log(
        `  - ${car.title || car.documentId} [${car.locale}] status=${a.status} id=${car.documentId}`
      );
    }
  }

  console.log(
    anyMissingOnHome
      ? "\n❌ Some home-display cars have missing or unreachable images."
      : "\n✅ Home-display cars (first 3 per locale) have images from Strapi."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
