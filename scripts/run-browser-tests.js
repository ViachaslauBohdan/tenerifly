#!/usr/bin/env node
/**
 * Starts Next.js on a dedicated port, runs Cucumber, then stops the server.
 * Used by pre-commit so browser tests do not depend on an existing `next dev`.
 */
const { spawn } = require("child_process");
const http = require("http");

const HOST = "127.0.0.1";
const PORT = process.env.BROWSER_PORT || "3100";
const BASE_URL = `http://${HOST}:${PORT}`;

function waitForServer(url, timeoutMs = 90_000) {
  const started = Date.now();

  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });

      req.on("error", () => {
        if (Date.now() - started >= timeoutMs) {
          reject(new Error(`Server not ready at ${url} within ${timeoutMs}ms`));
          return;
        }
        setTimeout(attempt, 400);
      });

      req.setTimeout(2_000, () => {
        req.destroy();
      });
    };

    attempt();
  });
}

function run(command, args, env = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      env: { ...process.env, ...env },
    });
    child.on("close", (code, signal) => {
      resolve({ child, code: code ?? (signal ? 1 : 0) });
    });
  });
}

async function main() {
  const server = spawn(
    "npx",
    ["next", "start", "--hostname", HOST, "--port", PORT],
    {
      stdio: "inherit",
      env: { ...process.env, PORT },
    },
  );

  let serverClosed = false;
  const stopServer = () => {
    if (serverClosed) return;
    serverClosed = true;
    if (!server.killed) {
      server.kill("SIGTERM");
    }
  };

  process.on("exit", stopServer);
  process.on("SIGINT", () => {
    stopServer();
    process.exit(130);
  });
  process.on("SIGTERM", () => {
    stopServer();
    process.exit(143);
  });

  try {
    await waitForServer(BASE_URL);
    const { code } = await run("npx", ["cucumber-js"], {
      BROWSER_BASE_URL: BASE_URL,
    });
    stopServer();
    process.exit(code);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    stopServer();
    process.exit(1);
  }
}

main();
