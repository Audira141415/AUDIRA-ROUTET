'use strict';

const path = require('path');
const { app } = require('electron');

/**
 * Determines whether the application is running in packaged (production) mode.
 * Uses Electron's app.isPackaged property which returns true when the app is
 * running from a packaged build (installer) rather than from source.
 *
 * @returns {boolean} True if running in packaged mode, false in development.
 */
function isPackaged() {
  return app.isPackaged;
}

/**
 * Resolves the path to the Next.js standalone server entry point.
 *
 * In packaged mode, the server is bundled as an extraResource at
 * `process.resourcesPath/server/server.js` (configured in electron-builder.yml).
 *
 * In development mode, the server is at the project root's
 * `.next/standalone/server.js` relative to the desktop directory.
 *
 * @returns {string} Absolute path to server.js
 */
function getServerPath() {
  if (isPackaged()) {
    return path.join(process.resourcesPath, 'server', 'server.js');
  }
  // In dev mode, resolve relative to the desktop directory (where this code lives)
  // desktop/src/utils/paths.js -> ../../.. gets to project root
  return path.join(__dirname, '..', '..', '..', '.next', 'standalone', 'server.js');
}

/**
 * Resolves the path to the `.audira-route-data/` directory used for SQLite database,
 * logs, and MITM configuration storage.
 *
 * In packaged mode, the data directory is placed in Electron's userData path
 * (e.g., %APPDATA%/audira-route-desktop/ on Windows) to ensure write access
 * and proper OS conventions.
 *
 * In development mode, the data directory is at the project root to maintain
 * compatibility with the CLI tool and existing development workflow.
 *
 * @returns {string} Absolute path to the .audira-route-data/ directory
 */
function getDataDir() {
  if (isPackaged()) {
    return path.join(app.getPath('userData'), '.audira-route-data');
  }
  // In dev mode, resolve to project root's .audira-route-data/
  return path.join(__dirname, '..', '..', '..', '.audira-route-data');
}

module.exports = {
  isPackaged,
  getServerPath,
  getDataDir,
};
