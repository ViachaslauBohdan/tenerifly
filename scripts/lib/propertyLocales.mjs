import fs from "fs";
import path from "path";
import { TARGET_LOCALES, translateText } from "./cmsTranslate.mjs";

export { TARGET_LOCALES };

const BACKUP_DIR = path.join(
  process.cwd(),
  "scripts",
  ".property-locale-backups"
);

const SYSTEM_KEYS = new Set([
  "id",
  "documentId",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "locale",
  "localizations",
]);

function isMediaObject(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      (value.url || value.mime || value.provider || value.hash)
  );
}

export function stripSystemFields(value) {
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (isMediaObject(item) && item.id != null) return item.id;
      return stripSystemFields(item);
    });
  }
  if (!value || typeof value !== "object") return value;
  if (isMediaObject(value) && value.id != null) return value.id;

  const out = {};
  for (const [key, nested] of Object.entries(value)) {
    if (SYSTEM_KEYS.has(key)) continue;
    out[key] = stripSystemFields(nested);
  }
  return out;
}

export function buildLocalePayload(enDoc, { title, description }) {
  const payload = stripSystemFields(enDoc) || {};
  delete payload.slug;
  payload.title = title;
  payload.description = description;
  payload.publishedAt = new Date().toISOString();
  return payload;
}

export function hasRequiredLocaleFields(doc) {
  return Boolean(
    doc &&
      typeof doc.category === "string" &&
      doc.category.trim() &&
      doc.price &&
      typeof doc.price === "object" &&
      doc.specifications &&
      typeof doc.specifications === "object" &&
      doc.location &&
      typeof doc.location === "object" &&
      doc.contact &&
      typeof doc.contact === "object"
  );
}

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function textOf(value) {
  return typeof value === "string" ? value : "";
}

export function hasUsableText(value) {
  return textOf(value).trim().length > 0;
}

export async function fetchPropertyLocale(apiUrl, token, documentId, locale) {
  const params = new URLSearchParams({
    locale,
    "fields[0]": "title",
    "fields[1]": "description",
    "fields[2]": "locale",
    "fields[3]": "documentId",
  });
  const res = await fetch(
    `${apiUrl}/api/properties/${documentId}?${params}`,
    { headers: authHeaders(token) }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(
      `GET properties/${documentId}?locale=${locale} HTTP ${res.status}: ${await res.text()}`
    );
  }
  const json = await res.json();
  const row = json.data || null;
  if (!row) return null;
  if (row.locale && row.locale !== locale) return null;
  return row;
}

export async function fetchPropertyLocaleFull(apiUrl, token, documentId, locale) {
  const res = await fetch(
    `${apiUrl}/api/properties/${documentId}?populate=*&locale=${encodeURIComponent(locale)}`,
    { headers: authHeaders(token) }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(
      `GET properties/${documentId}?populate=*&locale=${locale} HTTP ${res.status}: ${await res.text()}`
    );
  }
  const json = await res.json();
  const row = json.data || null;
  if (!row) return null;
  if (row.locale && row.locale !== locale) return null;
  return row;
}

export async function putPropertyLocale(
  apiUrl,
  token,
  documentId,
  locale,
  data
) {
  const res = await fetch(
    `${apiUrl}/api/properties/${documentId}?locale=${encodeURIComponent(locale)}`,
    {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify({ data }),
    }
  );
  if (!res.ok) {
    throw new Error(
      `PUT properties/${documentId}?locale=${locale} HTTP ${res.status}: ${await res.text()}`
    );
  }
  return res.json();
}

export function snapshotText(row) {
  return {
    title: textOf(row?.title),
    description: textOf(row?.description),
    locale: row?.locale || null,
    documentId: row?.documentId || null,
  };
}

export function sameSnapshot(a, b) {
  return (
    textOf(a?.title).trim() === textOf(b?.title).trim() &&
    textOf(a?.description).trim() === textOf(b?.description).trim()
  );
}

export function writeEnBackup(documentId, enSnapshot) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const file = path.join(BACKUP_DIR, `${documentId}.json`);
  const payload = {
    documentId,
    savedAt: new Date().toISOString(),
    en: enSnapshot,
  };
  fs.writeFileSync(file, JSON.stringify(payload, null, 2));
  return file;
}

export async function restoreEnglish(
  apiUrl,
  token,
  documentId,
  enSnapshot
) {
  await putPropertyLocale(apiUrl, token, documentId, "en", {
    title: enSnapshot.title,
    description: enSnapshot.description,
  });
}

export async function assertEnglishUnchanged(
  apiUrl,
  token,
  documentId,
  enSnapshot
) {
  const current = await fetchPropertyLocale(apiUrl, token, documentId, "en");
  if (!current) {
    throw new Error(`English locale missing after write for ${documentId}`);
  }
  if (!sameSnapshot(enSnapshot, snapshotText(current))) {
    await restoreEnglish(apiUrl, token, documentId, enSnapshot);
    throw new Error(
      `English title/description changed for ${documentId}; restored from backup and aborted`
    );
  }
  return snapshotText(current);
}

/**
 * Translate EN title/description into one locale and PUT it.
 * Verifies English is untouched after the write; restores EN if not.
 */
export async function upsertTranslatedLocale({
  apiUrl,
  token,
  documentId,
  locale,
  enSnapshot,
  enDoc,
  dryRun = true,
}) {
  const existing = await fetchPropertyLocale(apiUrl, token, documentId, locale);
  if (
    existing &&
    hasUsableText(existing.title) &&
    hasUsableText(existing.description)
  ) {
    return { locale, status: "skipped-existing", title: existing.title };
  }

  const title = await translateText(enSnapshot.title, locale, "en");
  const description = await translateText(
    enSnapshot.description,
    locale,
    "en"
  );

  if (dryRun) {
    return {
      locale,
      status: "dry-run",
      title,
      descriptionPreview: description.slice(0, 120),
    };
  }

  const payload = buildLocalePayload(enDoc, { title, description });
  await putPropertyLocale(apiUrl, token, documentId, locale, payload);
  await assertEnglishUnchanged(apiUrl, token, documentId, enSnapshot);

  const written = await fetchPropertyLocale(apiUrl, token, documentId, locale);
  if (
    !written ||
    written.locale !== locale ||
    !hasUsableText(written.description)
  ) {
    throw new Error(
      `Locale ${locale} was not stored for ${documentId} (got locale=${written?.locale || "none"})`
    );
  }

  return { locale, status: "written", title: written.title };
}

/**
 * Create missing locales for one property. English is backed up first.
 */
export async function localizeProperty({
  apiUrl,
  token,
  documentId,
  locales = TARGET_LOCALES,
  dryRun = true,
  onProgress,
}) {
  const en = await fetchPropertyLocaleFull(apiUrl, token, documentId, "en");
  if (!en || !hasUsableText(en.title) || !hasUsableText(en.description)) {
    throw new Error(`Property ${documentId} has no usable English title/description`);
  }
  if (!hasRequiredLocaleFields(en)) {
    return {
      documentId,
      title: en.title,
      backupFile: null,
      results: locales
        .filter((locale) => locale !== "en")
        .map((locale) => ({
          locale,
          status: "skipped-incomplete",
          error: "EN record is missing category/price/specifications/location/contact",
        })),
    };
  }
  const enSnapshot = snapshotText(en);
  const backupFile = dryRun ? null : writeEnBackup(documentId, enSnapshot);
  const results = [];

  for (const locale of locales) {
    if (locale === "en") continue;
    onProgress?.({ locale, phase: "start" });
    try {
      const result = await upsertTranslatedLocale({
        apiUrl,
        token,
        documentId,
        locale,
        enSnapshot,
        enDoc: en,
        dryRun,
      });
      results.push(result);
      onProgress?.({ locale, phase: "done", result });
    } catch (error) {
      results.push({ locale, status: "error", error: error.message });
      onProgress?.({ locale, phase: "error", error });
      if (String(error.message).includes("aborted")) {
        throw error;
      }
    }
  }

  return { documentId, title: enSnapshot.title, backupFile, results };
}
