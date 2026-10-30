"use client";

import { useState } from "react";
import { PropertyImportEditor } from "./PropertyImportEditor";
import type { PropertyImportIssue } from "@/lib/propertyImport";
import type { PropertyImportRow } from "@/lib/propertyImportCreate";

export default function PropertyImportPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const handleLogin = async () => {
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/atlantico/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setMessage(body.error || "Не удалось войти");
        return;
      }
      setUnlocked(true);
      setPassword("");
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-gray-900">
      <h1 className="text-2xl font-semibold">Загрузка апартаментов</h1>
      <p className="mt-2 text-sm text-gray-600">
        Вставьте JSON или выберите файлы. Новые объекты создаются в Strapi. Уже
        существующие по slug пропускаются. Старые записи не изменяются и не удаляются.
      </p>

      {unlocked ? (
        <PropertyImportEditor
          onUpload={async (json) => {
            const response = await fetch("/api/admin/properties/import", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ json }),
            });
            const body = (await response.json()) as {
              error?: string;
              ok?: boolean;
              issues?: PropertyImportIssue[];
              results?: PropertyImportRow[];
            };
            if (response.status === 401) {
              setUnlocked(false);
              return { ok: false, error: body.error || "Нужно войти" };
            }
            if (!response.ok || !body.ok) {
              return { ok: false, error: "Ничего не загружено. Исправьте подсвеченные поля." };
            }
            return { ok: true, results: body.results || [] };
          }}
        />
      ) : (
        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void handleLogin();
          }}
        >
          <label className="text-sm font-medium" htmlFor="admin-password">
            Пароль
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2"
          />
          <button
            type="submit"
            disabled={pending || !password}
            className="w-fit rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
          >
            Войти
          </button>
        </form>
      )}

      {message ? <p className="mt-4 text-sm text-red-700">{message}</p> : null}
    </main>
  );
}
