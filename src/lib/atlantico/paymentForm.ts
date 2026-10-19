import type { AtlanticoPaymentForm } from "./types";

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function tagAttr(tag: string, name: string): string | null {
  const match = tag.match(
    new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>]+))`, "i")
  );
  if (!match) return null;
  return decodeHtml(match[1] ?? match[2] ?? match[3] ?? "");
}

function looksLikeGatewayForm(html: string): boolean {
  return (
    /<form\b/i.test(html) &&
    (/document\.forms\[\s*0\s*\]\.submit\s*\(/i.test(html) ||
      /Ds_MerchantParameters/i.test(html) ||
      /Ds_Signature/i.test(html))
  );
}

/** Redsys and the Atlántico test terminal return an auto-submit HTML form, not a URL. */
export function parsePaymentForm(
  html: string,
  baseUrl: string
): AtlanticoPaymentForm | null {
  if (!looksLikeGatewayForm(html)) return null;
  const formMatch =
    html.match(/<form\b([^>]*)>([\s\S]*?)<\/form>/i) ||
    html.match(/<form\b([^>]*)>([\s\S]*)/i);
  if (!formMatch) return null;
  const action = tagAttr(formMatch[1], "action");
  if (!action) return null;

  let actionUrl: URL;
  try {
    actionUrl = new URL(action, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  } catch {
    return null;
  }
  if (actionUrl.protocol !== "https:" && actionUrl.protocol !== "http:") return null;

  const method = (tagAttr(formMatch[1], "method") || "POST").toUpperCase();
  const fields: AtlanticoPaymentForm["fields"] = [];
  const inputRe = /<(?:input|textarea)\b([^>]*)>/gi;
  for (const match of formMatch[2].matchAll(inputRe)) {
    const name = tagAttr(match[1], "name");
    if (!name) continue;
    fields.push({ name, value: tagAttr(match[1], "value") || "" });
  }

  return {
    action: actionUrl.toString(),
    method: method === "GET" ? "GET" : "POST",
    fields,
  };
}

export function submitPaymentForm(form: AtlanticoPaymentForm): void {
  const live = document.createElement("form");
  live.method = form.method;
  live.action = form.action;
  live.acceptCharset = "UTF-8";
  live.style.display = "none";
  for (const field of form.fields) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = field.name;
    input.value = field.value;
    live.appendChild(input);
  }
  document.body.appendChild(live);
  live.submit();
}
