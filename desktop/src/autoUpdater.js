'use strict';

const { dialog, Notification } = require('electron');
const { autoUpdater } = require('electron-updater');

/**
 * Configures the electron-updater autoUpdater instance.
 * - Disables auto-download so the user can accept before downloading.
 * - Suppresses built-in dialogs in favor of custom notifications/dialogs.
 */
function configure() {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.on('update-available', (info) => {
    const version = info.version || 'unknown';

    // Show a system notification with the new version number
    if (Notification.isSupported()) {
      const notification = new Notification({
        title: 'Update Available',
        body: `A new version (v${version}) of Audira Route is available. Click to download.`,
      });

      notification.on('click', () => {
        downloadUpdate();
      });

      notification.show();
    } else {
      // Fallback: use a dialog if notifications are not supported
      dialog
        .showMessageBox({
          type: 'info',
          title: 'Update Available',
          message: `A new version (v${version}) of Audira Route is available.`,
          buttons: ['Download', 'Later'],
          defaultId: 0,
          cancelId: 1,
        })
        .then((result) => {
          if (result.response === 0) {
            downloadUpdate();
          }
        });
    }
  });

  autoUpdater.on('update-downloaded', (info) => {
    const version = info.version || 'unknown';

    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: `Version ${version} has been downloaded. Restart now to apply the update?`,
        buttons: ['Restart Now', 'Later'],
        defaultId: 0,
        cancelId: 1,
      })
      .then((result) => {
        if (result.response === 0) {
          quitAndInstall();
        }
      });
  });

  autoUpdater.on('error', (err) => {
    // Silently catch network errors and log to console.
    // The update will be retried on the next application launch.
    console.error('[AutoUpdater] Error checking for updates:', err.message);
  });
}

/**
 * Checks for available updates from the configured update server.
 * Should be called once on app ready. Network errors are silently caught.
 */
function checkForUpdates() {
  autoUpdater.checkForUpdates().catch((err) => {
    // Silently swallow network errors — retry on next launch
    console.error('[AutoUpdater] Failed to check for updates:', err.message);
  });
}

/**
 * Downloads the available update in the background.
 */
function downloadUpdate() {
  autoUpdater.downloadUpdate().catch((err) => {
    console.error('[AutoUpdater] Failed to download update:', err.message);
  });
}

/**
 * Quits the application and installs the downloaded update.
 */
function quitAndInstall() {
  autoUpdater.quitAndInstall();
}

// Run configuration immediately on module load
configure();

module.exports = {
  checkForUpdates,
  downloadUpdate,
  quitAndInstall,
};
