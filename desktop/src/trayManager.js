'use strict';

const { Tray, Menu, app, nativeImage } = require('electron');
const path = require('path');
const windowManager = require('./windowManager');
const serverManager = require('./serverManager');

/** @type {Tray | null} */
let tray = null;

/**
 * Returns the path to the tray icon based on the current platform.
 * Windows uses .ico, macOS/Linux use .png.
 * @returns {string}
 */
function getIconPath() {
  const iconFile = process.platform === 'win32' ? 'icon.ico' : 'icon.png';
  return path.join(__dirname, '..', 'resources', iconFile);
}

/**
 * Builds the context menu template with the current auto-start state.
 * @param {boolean} autoStartEnabled - Whether auto-start is currently enabled
 * @returns {Electron.MenuItemConstructorOptions[]}
 */
function buildMenuTemplate(autoStartEnabled) {
  return [
    {
      label: 'Open Dashboard',
      click: () => {
        windowManager.show();
        windowManager.focus();
      },
    },
    {
      label: 'Auto-start',
      type: 'checkbox',
      checked: autoStartEnabled,
      click: (menuItem) => {
        app.setLoginItemSettings({ openAtLogin: menuItem.checked });
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: async () => {
        await serverManager.stop();
        app.quit();
      },
    },
  ];
}

/**
 * Creates the system tray icon and sets up the context menu and event handlers.
 * Uses the current login item settings to determine the initial auto-start state.
 */
function create() {
  const iconPath = getIconPath();
  const icon = nativeImage.createFromPath(iconPath);

  tray = new Tray(icon);
  tray.setToolTip('Audira Route');

  // Determine current auto-start state from OS settings
  const loginSettings = app.getLoginItemSettings();
  const autoStartEnabled = loginSettings.openAtLogin;

  const contextMenu = Menu.buildFromTemplate(buildMenuTemplate(autoStartEnabled));
  tray.setContextMenu(contextMenu);

  // Double-click on tray icon: show and focus window
  tray.on('double-click', () => {
    windowManager.show();
    windowManager.focus();
  });
}

/**
 * Destroys the tray icon and cleans up resources.
 * Safe to call even if the tray has not been created.
 */
function destroy() {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}

/**
 * Updates the context menu to reflect the current auto-start state.
 * @param {boolean} autoStartEnabled - Whether auto-start is currently enabled
 */
function updateMenu(autoStartEnabled) {
  if (!tray) {
    return;
  }

  const contextMenu = Menu.buildFromTemplate(buildMenuTemplate(autoStartEnabled));
  tray.setContextMenu(contextMenu);
}

module.exports = {
  create,
  destroy,
  updateMenu,
};
