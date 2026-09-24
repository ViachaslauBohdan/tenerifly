"use client";

import { useState } from "react";

type ProbeResult = {
  host?: string;
  event?: { status: number; name?: string };
  prices?: { status: number; body: string };
  confirm?: { status: number; body: string };
  error?: string;
};

export default function AtlanticoAdminPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<ProbeResult | null>(null);
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
        setMessage(body.error || "Login failed");
        return;
      }
      setUnlocked(true);
      setPassword("");
    } finally {
      setPending(false);
    }
  };

  const handleProbe = async () => {
    setPending(true);
    setMessage("");
    setResult(null);
    try {
      const response = await fetch("/api/admin/atlantico/probe", {
        method: "POST",
      });
      const body = (await response.json()) as ProbeResult;
      if (!response.ok) {
        setMessage(body.error || "Probe failed");
        if (response.status === 401) setUnlocked(false);
        return;
      }
      setResult(body);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-gray-900">
      <h1 className="text-2xl font-semibold">Atlantico test</h1>
      <p className="mt-2 text-sm text-gray-600">
        Только тестовый сервер поставщика. Боевые брони отсюда не уходят.
      </p>

      {unlocked ? (
        <button
          type="button"
          onClick={handleProbe}
          disabled={pending}
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
        >
          Проверить бронь
        </button>
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
      {result ? (
        <pre className="mt-6 overflow-auto rounded-lg bg-gray-100 p-4 text-xs">
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </main>
  );
}
