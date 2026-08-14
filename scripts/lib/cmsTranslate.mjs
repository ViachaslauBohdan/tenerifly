/** Locales stored in Strapi (URL `ua` maps to `uk` on the frontend). */
export const TARGET_LOCALES = ["ru", "uk", "pl", "de", "es", "fr"];

const GOOGLE_MAX = 1500;
const MYMEMORY_MAX = 450;

export function splitForTranslation(text, maxLen = GOOGLE_MAX) {
  const source = typeof text === "string" ? text.trim() : "";
  if (!source) return [];
  if (source.length <= maxLen) return [source];

  const parts = [];
  const paragraphs = source.split(/(\n{2,})/);
  let buffer = "";

  const flush = () => {
    if (buffer) {
      parts.push(buffer);
      buffer = "";
    }
  };

  for (const block of paragraphs) {
    if ((buffer + block).length <= maxLen) {
      buffer += block;
      continue;
    }
    flush();
    if (block.length <= maxLen) {
      buffer = block;
      continue;
    }
    const sentences = block.split(/(?<=[.!?])\s+/);
    for (const sentence of sentences) {
      if ((buffer + (buffer ? " " : "") + sentence).length <= maxLen) {
        buffer = buffer ? `${buffer} ${sentence}` : sentence;
      } else {
        flush();
        if (sentence.length <= maxLen) {
          buffer = sentence;
        } else {
          for (let i = 0; i < sentence.length; i += maxLen) {
            parts.push(sentence.slice(i, i + maxLen));
          }
        }
      }
    }
  }
  flush();
  return parts.filter((part) => part.trim().length > 0);
}

export function translationLooksValid(source, translated, locale) {
  if (typeof translated !== "string") return false;
  const text = translated.trim();
  if (!text) return false;
  if (/MYMEMORY WARNING/i.test(text)) return false;
  if (text.startsWith(`[${String(locale || "").toUpperCase()}]`)) return false;
  const original = (source || "").trim();
  if (original.length > 80 && text === original) return false;
  return true;
}

async function translateChunkGoogle(text, targetLocale, sourceLocale) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", sourceLocale);
  url.searchParams.set("tl", targetLocale);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Google translate HTTP ${res.status}`);
  const json = await res.json();
  const pieces = Array.isArray(json?.[0]) ? json[0] : [];
  return pieces.map((part) => part?.[0] || "").join("");
}

async function translateChunkMyMemory(text, targetLocale, sourceLocale) {
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", `${sourceLocale}|${targetLocale}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
  const json = await res.json();
  return json?.responseData?.translatedText || "";
}

async function translateChunk(text, targetLocale, sourceLocale) {
  try {
    const fromGoogle = await translateChunkGoogle(
      text,
      targetLocale,
      sourceLocale
    );
    if (translationLooksValid(text, fromGoogle, targetLocale)) return fromGoogle;
  } catch {
    // fall through to MyMemory
  }
  const fromMemory = await translateChunkMyMemory(
    text.slice(0, MYMEMORY_MAX),
    targetLocale,
    sourceLocale
  );
  return fromMemory;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function translateText(
  text,
  targetLocale,
  sourceLocale = "en",
  { delayMs = 250 } = {}
) {
  if (!text || typeof text !== "string" || !text.trim()) return "";
  if (!targetLocale || targetLocale === sourceLocale) return text;

  const chunks = splitForTranslation(text, GOOGLE_MAX);
  const translated = [];
  for (let i = 0; i < chunks.length; i += 1) {
    if (i > 0 && delayMs > 0) await sleep(delayMs);
    translated.push(await translateChunk(chunks[i], targetLocale, sourceLocale));
  }
  const result = translated.join("");
  if (!translationLooksValid(text, result, targetLocale)) {
    throw new Error(`Translation to ${targetLocale} looked invalid`);
  }
  return result;
}
