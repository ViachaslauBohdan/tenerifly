import { parsePropertyImport, type PropertyDraft, type PropertyImportIssue } from "./propertyImport";

export type PropertyImportRow = {
  index: number;
  title: string;
  slug: string;
  status: "created" | "skipped" | "failed";
  detail: string;
};

export type PropertyImportOutcome =
  | { ok: false; issues: PropertyImportIssue[]; results: [] }
  | { ok: true; issues: []; results: PropertyImportRow[] };

type CreateOptions = {
  apiUrl: string;
  token: string;
  fetchImpl?: typeof fetch;
};

function strapiData(payload: unknown): { id?: number; documentId?: string } {
  if (!payload || typeof payload !== "object") return {};
  const data = (payload as { data?: unknown }).data;
  if (Array.isArray(data)) {
    const first = data[0];
    if (first && typeof first === "object") {
      return first as { id?: number; documentId?: string };
    }
    return {};
  }
  if (data && typeof data === "object") {
    return data as { id?: number; documentId?: string };
  }
  return {};
}

async function slugExists(
  apiUrl: string,
  token: string,
  slug: string,
  fetchImpl: typeof fetch
): Promise<boolean> {
  const url = new URL("/api/properties", apiUrl);
  url.searchParams.set("filters[slug][$eq]", slug);
  url.searchParams.set("pagination[pageSize]", "1");
  url.searchParams.set("locale", "en");
  const response = await fetchImpl(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Не удалось проверить существующие объекты (${response.status})`);
  }
  const body = (await response.json()) as unknown;
  const found = strapiData(body);
  return Boolean(found.id || found.documentId);
}

async function uploadImage(
  apiUrl: string,
  token: string,
  imageUrl: string,
  fetchImpl: typeof fetch
): Promise<number | null> {
  const source = await fetchImpl(imageUrl, { method: "GET" });
  if (!source.ok) return null;
  const bytes = await source.arrayBuffer();
  const fileName = imageUrl.split("?")[0]?.split("/").pop() || "photo.jpg";
  const form = new FormData();
  form.append("files", new Blob([bytes]), fileName);
  const uploaded = await fetchImpl(new URL("/api/upload", apiUrl), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!uploaded.ok) return null;
  const body = (await uploaded.json()) as Array<{ id?: number }>;
  return typeof body?.[0]?.id === "number" ? body[0].id : null;
}

async function createProperty(
  apiUrl: string,
  token: string,
  draft: PropertyDraft,
  fetchImpl: typeof fetch
): Promise<{ id?: number; documentId?: string }> {
  const images = Array.isArray(draft.images) ? draft.images : undefined;
  const imageIds: number[] = [];
  if (images) {
    for (const image of images) {
      if (typeof image === "number") {
        imageIds.push(image);
        continue;
      }
      const id = await uploadImage(apiUrl, token, image, fetchImpl);
      if (id) imageIds.push(id);
    }
  }

  const data = { ...draft };
  if (imageIds.length > 0) data.images = imageIds;
  else delete data.images;

  const response = await fetchImpl(new URL("/api/properties", apiUrl), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text.slice(0, 300) || `Strapi вернул ${response.status}`);
  }
  return strapiData(await response.json());
}

/** Creates missing properties. Never updates or deletes existing Strapi records. */
export async function createNewProperties(
  raw: string,
  options: CreateOptions
): Promise<PropertyImportOutcome> {
  const parsed = parsePropertyImport(raw);
  if (!parsed.ok) {
    return { ok: false, issues: parsed.issues, results: [] };
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const apiUrl = options.apiUrl.replace(/\/$/, "");
  const results: PropertyImportRow[] = [];

  for (let index = 0; index < parsed.properties.length; index += 1) {
    const draft = parsed.properties[index];
    const title = String(draft.title);
    const slug = String(draft.slug);
    try {
      const exists = await slugExists(apiUrl, options.token, slug, fetchImpl);
      if (exists) {
        results.push({
          index,
          title,
          slug,
          status: "skipped",
          detail: "Уже есть в Strapi, запись не изменена",
        });
        continue;
      }
      const created = await createProperty(apiUrl, options.token, draft, fetchImpl);
      results.push({
        index,
        title,
        slug,
        status: "created",
        detail: created.id ? `Создан, id ${created.id}` : "Создан",
      });
    } catch (error) {
      results.push({
        index,
        title,
        slug,
        status: "failed",
        detail: error instanceof Error ? error.message : "Не удалось создать",
      });
    }
  }

  return { ok: true, issues: [], results };
}
