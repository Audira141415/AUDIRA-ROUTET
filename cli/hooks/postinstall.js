#!/usr/bin/env node

// Postinstall: warm-up SQLite deps into ~/.audira-route/runtime so the first
// `audira-route` start doesn't need network. Failure here is non-fatal —
// cli.js will retry at runtime if anything is missing.
const { ensureSqliteRuntime } = require("./sqliteRuntime");
const { ensureTrayRuntime } = require("./trayRuntime");

try {
  ensureSqliteRuntime({ silent: false });
  console.log("[audira-route] runtime SQLite deps ready");
} catch (e) {
  console.warn(`[audira-route] runtime warm-up skipped: ${e.message}`);
}

try {
  ensureTrayRuntime({ silent: false });
} catch (e) {
  console.warn(`[audira-route] tray runtime skipped: ${e.message}`);
}

process.exit(0);
