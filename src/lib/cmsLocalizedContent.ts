import {
  cmsLocale,
  mergeCmsLocalizedText,
  type CmsTextFields,
} from "@/types/locale";

export type CmsLocalizedRow = CmsTextFields & {
  documentId?: string | null;
  id?: number | string;
  [key: string]: unknown;
};

/** True when localized CMS row is missing or lacks usable title/description. */
export function needsCmsEnTextFallback(
  localized: CmsTextFields | null | undefined
): boolean {
  if (!localized) return true;
  const hasDescription =
    typeof localized.description === "string" &&
    localized.description.trim().length > 0;
  const hasTitle =
    typeof localized.title === "string" && localized.title.trim().length > 0;
  return !hasDescription || !hasTitle;
}

/**
 * Resolve a single CMS document: prefer localized text, fill blanks from EN.
 */
export function resolveCmsDocument<T extends CmsTextFields>(
  localized: T | null | undefined,
  fallbackEn: T | null | undefined,
  locale?: string
): T | null {
  const key = cmsLocale(locale);
  if (key === "en") {
    return localized ?? fallbackEn ?? null;
  }
  if (!needsCmsEnTextFallback(localized)) {
    return localized ?? null;
  }
  if (!localized) return fallbackEn ?? null;
  if (!fallbackEn) return localized;
  return mergeCmsLocalizedText(localized, fallbackEn);
}

/**
 * Overlay localized title/description onto an EN (or base) catalog row.
 * Empty localized fields keep the base values.
 */
export function hybridLocalizedRow<T extends CmsLocalizedRow>(
  base: T,
  localization: CmsTextFields & {
    documentId?: string | null;
    locale?: string | null;
  }
): T {
  const textFields: CmsTextFields = {
    title: localization.title,
    description: localization.description,
    short_description: localization.short_description,
    locale: localization.locale,
  };
  const merged = mergeCmsLocalizedText(textFields, {
    title: base.title,
    description: base.description,
    short_description: base.short_description,
    locale: base.locale,
  });
  return {
    ...base,
    ...merged,
    locale: localization.locale ?? merged.locale,
    documentId: localization.documentId ?? base.documentId,
  };
}

/**
 * Keep the full EN catalog size; replace title/description when a matching
 * localized documentId exists. Append localized-only extras at the end.
 */
export function mergeLocalizedCatalog<T extends CmsLocalizedRow>(
  enRows: T[],
  localizedRows: T[]
): T[] {
  if (!localizedRows.length) return enRows;
  if (!enRows.length) return localizedRows;

  const byDocId = new Map<string, T>();
  for (const row of localizedRows) {
    if (row.documentId) byDocId.set(String(row.documentId), row);
  }

  const enDocIds = new Set(
    enRows
      .map((row) => (row.documentId ? String(row.documentId) : ""))
      .filter(Boolean)
  );

  const merged = enRows.map((en) => {
    const docId = en.documentId ? String(en.documentId) : "";
    const loc = docId ? byDocId.get(docId) : undefined;
    if (!loc) return en;
    return hybridLocalizedRow(en, loc);
  });

  const extras = localizedRows.filter((row) => {
    const docId = row.documentId ? String(row.documentId) : "";
    return docId && !enDocIds.has(docId);
  });

  return extras.length ? [...merged, ...extras] : merged;
}
