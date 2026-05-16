'use strict';

const { BrowserWindow, screen, shell, app } = require('electron');
const path = require('path');
const fs = require('fs');
const { isInternalUrl } = require('./utils/urlClassifier');

const SERVER_URL = 'http://localhost:20128';
const STATE_FILE = 'desktop-window-state.json';
const DEBOUNCE_MS = 500;

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 800;
const MIN_WIDTH = 900;
const MIN_HEIGHT = 600;

/** @type {BrowserWindow | null} */
let mainWindow = null;

/** @type {NodeJS.Timeout | null} */
let saveTimer = null;

/**
 * Returns the full path to the window state file.
 * @returns {string}
 */
function getStateFilePath() {
  return path.join(app.getPath('userData'), STATE_FILE);
}

/**
 * @typedef {Object} WindowState
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {boolean} isMaximized
 */

/**
 * Reads saved window state from disk and validates that the bounds
 * fall within a visible display. Returns null if the file is missing,
 * corrupted, or the bounds are off-screen.
 *
 * @returns {WindowState | null}
 */
function restoreState() {
  const filePath = getStateFilePath();

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const state = JSON.parse(raw);

    // Validate required fields and types
    if (
      typeof state.x !== 'number' ||
      typeof state.y !== 'number' ||
      typeof state.width !== 'number' ||
      typeof state.height !== 'number'
    ) {
      return null;
    }

    // Enforce minimum dimensions
    if (state.width < MIN_WIDTH || state.height < MIN_HEIGHT) {
      return null;
    }

    // Validate bounds are within a visible display
    const displays = screen.getAllDisplays();
    const isVisible = displays.some((display) => {
      const { x, y, width, height } = display.bounds;
      // Check that at least a portion of the window is within this display
      return (
        state.x < x + width &&
        state.x + state.width > x &&
        state.y < y + height &&
        state.y + state.height > y
      );
    });

    if (!isVisible) {
      return null;
    }

    return {
      x: state.x,
      y: state.y,
      width: state.width,
      height: state.height,
      isMaximized: Boolean(state.isMaximized),
    };
  } catch {
    // File missing, corrupted JSON, or read error — fall back to defaults
    return null;
  }
}

/**
 * Saves the current window state to disk. Called on a debounced basis
 * during resize/move events and immediately on close.
 */
function saveState() {
  if (!mainWindow) {
    return;
  }

  const isMaximized = mainWindow.isMaximized();

  // When maximized, save the restore bounds (pre-maximize position/size)
  let bounds;
  if (isMaximized) {
    bounds = mainWindow.getNormalBounds();
  } else {
    bounds = mainWindow.getBounds();
  }

  /** @type {WindowState} */
  const state = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    isMaximized,
  };

  const filePath = getStateFilePath();

  try {
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf-8');
  } catch {
    // Silently ignore write errors (e.g., disk full, permissions)
  }
}

/**
 * Debounced save — schedules a state save after DEBOUNCE_MS of inactivity.
 */
function debouncedSave() {
  if (saveTimer) {
    clearTimeout(saveTimer);
  }
  saveTimer = setTimeout(() => {
    saveState();
    saveTimer = null;
  }, DEBOUNCE_MS);
}

/**
 * Creates the main BrowserWindow with restored or default dimensions.
 * Sets up event listeners for state persistence and navigation policy.
 *
 * @returns {BrowserWindow}
 */
function createWindow() {
  const savedState = restoreState();

  const windowOptions = {
    width: savedState ? savedState.width : DEFAULT_WIDTH,
    height: savedState ? savedState.height : DEFAULT_HEIGHT,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    title: 'Audira Route',
    show: false, // Show after ready-to-show to avoid flicker
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  };

  // Restore position if we have valid saved state
  if (savedState) {
    windowOptions.x = savedState.x;
    windowOptions.y = savedState.y;
  } else {
    // Center on primary display
    windowOptions.center = true;
  }

  mainWindow = new BrowserWindow(windowOptions);

  // Restore maximized state
  if (savedState && savedState.isMaximized) {
    mainWindow.maximize();
  }

  // Show window when ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // --- State persistence events (debounced) ---
  mainWindow.on('resize', debouncedSave);
  mainWindow.on('move', debouncedSave);
  mainWindow.on('close', () => {
    // Flush any pending debounced save immediately
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    saveState();
  });

  // --- Navigation policy ---
  // Intercept in-page navigation
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isInternalUrl(url)) {
      event.preventDefault();
      shell.openExternal(url);
    }
    // Internal URLs navigate normally within the BrowserWindow
  });

  // Intercept new window requests (target="_blank", window.open, etc.)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isInternalUrl(url)) {
      // Load internal URLs in the same window
      mainWindow.loadURL(url);
    } else {
      shell.openExternal(url);
    }
    // Deny creating a new window in all cases
    return { action: 'deny' };
  });

  // Load the dashboard
  mainWindow.loadURL(SERVER_URL);

  return mainWindow;
}

/**
 * Shows the main window (restores from minimized/hidden state).
 */
function show() {
  if (mainWindow) {
    mainWindow.show();
  }
}

/**
 * Hides the main window (minimize to tray).
 */
function hide() {
  if (mainWindow) {
    mainWindow.hide();
  }
}

/**
 * Focuses the main window (brings to front).
 */
function focus() {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  }
}

/**
 * Returns the current BrowserWindow instance (or null if not created).
 * @returns {BrowserWindow | null}
 */
function getWindow() {
  return mainWindow;
}

module.exports = {
  createWindow,
  show,
  hide,
  focus,
  getWindow,
  restoreState,
  saveState,
};
