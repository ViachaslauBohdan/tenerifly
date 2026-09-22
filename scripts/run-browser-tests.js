#!/usr/bin/env node
/**
 * Starts Next.js on a free port, runs Cucumber, then stops the server.
 * Used by pre-commit so browser tests do not depend on an existing `next dev`.
 */
const { spawn } = require("child_process");
const http = require("http");
const net = require("net");

const HOST = "127.0.0.1";

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, HOST, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close((error) => {
        if (error) reject(error);
        else if (!port) reject(new Error("Could not allocate a free port"));
        else resolve(String(port));
      });
    });
    server.on("error", reject);
  });
}

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
  const port = process.env.BROWSER_PORT || (await getFreePort());
  const baseUrl = `http://${HOST}:${port}`;

  const server = spawn(
    "npx",
    ["next", "start", "--hostname", HOST, "--port", port],
    {
      stdio: "inherit",
      env: { ...process.env, PORT: port },
    }
  );

  let serverClosed = false;
  const stopServer = () => {
    if (serverClosed) return;
    serverClosed = true;
    if (!server.killed) {
      server.kill("SIGTERM");
    }
  };

  const serverExit = new Promise((_, reject) => {
    server.on("exit", (code, signal) => {
      if (serverClosed) return;
      reject(
        new Error(
          `next start exited early (code=${code ?? "null"}, signal=${signal ?? "null"})`
        )
      );
    });
  });

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
    await Promise.race([waitForServer(baseUrl), serverExit]);
    const { code } = await run("npx", ["cucumber-js", "--tags", "not @smoke-prod"], {
      BROWSER_BASE_URL: baseUrl,
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
