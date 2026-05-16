'use strict';

const { app, dialog } = require('electron');
const serverManager = require('./src/serverManager');
const windowManager = require('./src/windowManager');
const trayManager = require('./src/trayManager');
const autoUpdater = require('./src/autoUpdater');
const { ensureDataDir } = require('./src/utils/dataDir');

/**
 * Whether the application is running in development mode.
 * In dev mode, the embedded server is not spawned — an external dev server is expected at http://localhost:20128.
 * @type {boolean}
 */
const isDev = process.env.NODE_ENV === 'development';

/**
 * Flag indicating the application is in the process of quitting.
 * When true, the window close event will not be intercepted (close-to-tray disabled).
 * @type {boolean}
 */
let isQuitting = false;

/**
 * Gracefully shuts down the application:
 * 1. Sets isQuitting flag to prevent close-to-tray interception
 * 2. Stops the embedded server (production only)
 * 3. Destroys the tray icon
 * 4. Exits the application
 */
async function gracefulShutdown() {
  if (isQuitting) {
    return;
  }

  isQuitting = true;

  if (!isDev) {
    try {
      await serverManager.stop();
    } catch {
      // Best-effort shutdown — continue even if server stop fails
    }
  }

  trayManager.destroy();
  app.exit(0);
}

/**
 * Displays an error dialog when the server fails to start.
 * Offers the user a choice to retry starting the server or quit the application.
 *
 * @param {Error} err - The error that caused the server start failure
 */
async function showServerErrorDialog(err) {
  const result = await dialog.showMessageBox({
    type: 'error',
    title: 'Server Start Failed',
    message: 'Audira Route server failed to start.',
    detail: err.message || 'Unknown error occurred.',
    buttons: ['Retry', 'Quit'],
    defaultId: 0,
    cancelId: 1,
  });

  if (result.response === 0) {
    // Retry
    await startServer();
  } else {
    // Quit
    app.exit(1);
  }
}

/**
 * Starts the embedded server and creates the window once ready.
 * In development mode, skips server spawning and connects to the external dev server.
 * If the server fails to start, shows an error dialog with retry/quit options.
 */
async function startServer() {
  try {
    if (!isDev) {
      ensureDataDir();
      await serverManager.start();
    }

    const win = windowManager.createWindow();
    setupCloseToTray(win);

    if (isDev) {
      win.webContents.openDevTools();
    }
  } catch (err) {
    await showServerErrorDialog(err);
  }
}

/**
 * Sets up close-to-tray behavior on the window.
 * When the user closes the window, it is hidden instead of destroyed,
 * unless the isQuitting flag is set (indicating a real quit).
 *
 * @param {Electron.BrowserWindow} win
 */
function setupCloseToTray(win) {
  win.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      windowManager.hide();
    }
  });
}

/**
 * Main application startup sequence.
 * Requests single-instance lock, starts server, creates window, tray, and checks for updates.
 */
function main() {
  // Single-instance lock: only one instance of the app should run at a time
  const gotLock = app.requestSingleInstanceLock();

  if (!gotLock) {
    // Another instance is already running — exit immediately
    app.quit();
    return;
  }

  // When a second instance is launched, focus the existing window
  app.on('second-instance', () => {
    windowManager.show();
    windowManager.focus();
  });

  // Handle OS shutdown / user-initiated quit
  app.on('before-quit', (event) => {
    event.preventDefault();
    gracefulShutdown();
  });

  app.whenReady().then(async () => {
    // Start the server and create the window
    await startServer();

    // Create system tray icon and menu
    trayManager.create();

    // Check for updates
    autoUpdater.checkForUpdates();
  });
}

main();
