"use client";

import { useMemo, useState } from "react";
import { parsePropertyImport, type PropertyImportIssue } from "@/lib/propertyImport";
import type { PropertyImportRow } from "@/lib/propertyImportCreate";

const SAMPLE = `[
  {
    "title": "Brand new apartment in Parque Royal",
    "slug": "brand-new-apartment-parque-royal",
    "description": "1-bedroom apartment in Costa Adeje.",
    "type": "rent",
    "property_status": "available",
    "category": "apartment",
    "price": { "amount": 850, "currency": "EUR", "period": "day" },
    "location": { "city": "Costa Adeje", "region": "Tenerife" }
  }
]`;

function issueLabel(item: PropertyImportIssue): string {
  const where = item.index >= 0 ? `Объект ${item.index + 1}` : "JSON";
  return item.path ? `${where} · ${item.path}` : where;
}

type PropertyImportEditorProps = {
  onUpload: (json: string) => Promise<{
    ok: boolean;
    error?: string;
    results?: PropertyImportRow[];
  }>;
};

export function PropertyImportEditor({ onUpload }: PropertyImportEditorProps) {
  const [json, setJson] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [results, setResults] = useState<PropertyImportRow[] | null>(null);
  const preview = useMemo(() => parsePropertyImport(json), [json]);
  const invalid = json.trim().length > 0 && !preview.ok;

  const handleUpload = async () => {
    setPending(true);
    setMessage("");
    setResults(null);
    try {
      const body = await onUpload(json);
      if (!body.ok) {
        setMessage(body.error || "Ничего не загружено. Исправьте подсвеченные поля.");
        return;
      }
      setResults(body.results || []);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-4">
      <label className="text-sm font-medium" htmlFor="property-json">
        JSON апартаментов
      </label>
      <textarea
        id="property-json"
        value={json}
        onChange={(event) => {
          setJson(event.target.value);
          setResults(null);
          setMessage("");
        }}
        spellCheck={false}
        aria-invalid={invalid}
        placeholder={SAMPLE}
        className={`min-h-80 rounded-xl border px-3 py-3 font-mono text-sm outline-none ${
          invalid
            ? "border-red-500 bg-red-50 ring-2 ring-red-200"
            : preview.ok
              ? "border-green-600 bg-white ring-2 ring-green-100"
              : "border-gray-300 bg-white"
        }`}
      />

      {preview.ok ? (
        <p className="text-sm text-green-700">
          Формат верный: {preview.properties.length}{" "}
          {preview.properties.length === 1 ? "объект" : "объектов"} можно загружать.
        </p>
      ) : null}

      {invalid ? (
        <ul className="flex flex-col gap-2" aria-live="polite">
          {preview.issues.map((item) => (
            <li
              key={`${item.index}-${item.path}-${item.message}`}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            >
              <span className="font-medium">{issueLabel(item)}.</span> {item.message}
            </li>
          ))}
        </ul>
      ) : null}

      <button
        type="button"
        onClick={() => void handleUpload()}
        disabled={pending || !preview.ok}
        className="w-fit rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
      >
        Загрузить новые
      </button>

      {message ? <p className="text-sm text-red-700">{message}</p> : null}

      {results ? (
        <ul className="flex flex-col gap-2">
          {results.map((row) => (
            <li
              key={`${row.slug}-${row.index}`}
              className={`rounded-lg border px-3 py-2 text-sm ${
                row.status === "created"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : row.status === "skipped"
                    ? "border-amber-200 bg-amber-50 text-amber-900"
                    : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              <span className="font-medium">{row.title}.</span> {row.detail}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
