const SITE_ORIGIN = "https://www.atlanticoexcursiones.com";
const CATEGORY_IMAGE_BASE = `${SITE_ORIGIN}/images/evtypes/`;
const ALT_EXTENSIONS = [".webp", ".jpg", ".jpeg", ".png"] as const;

export function getAtlanticoImageBaseUrl(): string {
  const fromEnv = process.env.ATLANTICO_IMAGE_BASE_URL?.trim();
  const base = fromEnv || CATEGORY_IMAGE_BASE;
  return base.endsWith("/") ? base : `${base}/`;
}

function normalizeFile(image: string | undefined | null): string | null {
  if (!image) return null;
  const trimmed = image.trim();
  if (!trimmed) return null;
  return trimmed.replace(/^\/+/, "");
}

function encodeFileName(file: string): string {
  if (/%[0-9A-Fa-f]{2}/.test(file)) return file;
  return encodeURIComponent(file);
}

function atlanticoGrpFileUrl(tourCode: string, file: string): string {
  return `${SITE_ORIGIN}/zeus/pictures/GRP${tourCode}/${encodeFileName(file)}`;
}

export function atlanticoImageUrl(
  image: string | undefined | null
): string | null {
  const file = normalizeFile(image);
  if (!file) return null;
  if (/^https?:\/\//i.test(file)) return file;
  if (file.startsWith("images/") || file.startsWith("zeus/")) {
    return `${SITE_ORIGIN}/${file}`;
  }
  return `${getAtlanticoImageBaseUrl()}${file}`;
}

function fileStem(file: string): string {
  const dot = file.lastIndexOf(".");
  return dot > 0 ? file.slice(0, dot) : file;
}

/** Product photos live in `/zeus/pictures/GRP{tourCode}/`. */
export function atlanticoTourImageUrl(
  image: string | undefined | null,
  tourCode?: string | number | null
): string | null {
  return atlanticoTourImageCandidates(image, tourCode)[0] ?? null;
}

/**
 * API filenames often use the wrong extension (png vs jpg).
 * Only retry the same filename stem — never a different photo.
 */
export function atlanticoTourImageCandidates(
  image: string | undefined | null,
  tourCode?: string | number | null
): string[] {
  const file = normalizeFile(image);
  if (!file) return [];
  if (/^https?:\/\//i.test(file)) return [file];

  const code = String(tourCode ?? "").trim();
  if (!code) {
    const fallback = atlanticoImageUrl(file);
    return fallback ? [fallback] : [];
  }

  const names = new Set<string>([file]);
  const stem = fileStem(file);
  for (const ext of ALT_EXTENSIONS) {
    names.add(`${stem}${ext}`);
  }
  return [...names].map((name) => atlanticoGrpFileUrl(code, name));
}
