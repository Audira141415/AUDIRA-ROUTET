# Implementation Plan: Desktop App

## Overview

This plan converts the Audira Route web application into a native Electron desktop application. The implementation creates a `desktop/` directory at the repository root containing the Electron main process, window management, system tray integration, auto-updater, and build pipeline. The existing Next.js standalone server is spawned as a child process and loaded into a BrowserWindow.

## Tasks

- [x] 1. Set up desktop project structure and dependencies
  - [x] 1.1 Create desktop directory with package.json and electron-builder config
    - Create `desktop/` directory at repository root
    - Create `desktop/package.json` with Electron, electron-builder, electron-updater, and cross-env dependencies
    - Create `desktop/electron-builder.yml` with platform-specific targets (NSIS, DMG, AppImage), extraResources for standalone server, and publish config
    - Create `desktop/resources/` directory and copy existing icons (icon.ico from cli/src/cli/tray/, icon.png)
    - Create `desktop/src/` and `desktop/src/utils/` directories
    - Create `desktop/scripts/` directory
    - _Requirements: 6.1, 6.5, 8.4, 1.4, 1.5_

  - [x] 1.2 Add root package.json scripts for desktop development and build
    - Add `dev:desktop` script that runs `cd desktop && npm run dev`
    - Add `build:desktop` script that runs `cd desktop && npm run build`
    - _Requirements: 6.4, 8.1_

- [x] 2. Implement utility modules
  - [x] 2.1 Implement path resolution utility (`desktop/src/utils/paths.js`)
    - Implement `getServerPath()` that resolves to `.next/standalone/server.js` in packaged mode (via `process.resourcesPath`) or relative path in development mode
    - Implement `getDataDir()` that resolves the `.9router-data/` directory path
    - Detect packaged vs development mode using `app.isPackaged`
    - _Requirements: 5.1, 5.3, 8.2_

  - [x] 2.2 Implement URL classifier utility (`desktop/src/utils/urlClassifier.js`)
    - Implement `isInternalUrl(url)` that returns true for URLs matching `http://localhost:20128/*`
    - All other URLs (different host, port, or protocol) should be classified as external
    - _Requirements: 3.5, 3.6_

  - [ ]* 2.3 Write property test for URL classifier
    - **Property 2: URL routing classification**
    - Generate random URL strings (internal localhost:20128 and external) and verify correct classification
    - Use fast-check with Vitest, minimum 100 iterations
    - **Validates: Requirements 3.5, 3.6**

- [x] 3. Implement Server Process Manager
  - [x] 3.1 Implement server manager (`desktop/src/serverManager.js`)
    - Implement `start()` that spawns the Next.js standalone server via `child_process.fork()` with `DATA_DIR`, `PORT=20128`, and `NODE_ENV=production` environment variables
    - Implement readiness polling: HTTP GET to `http://localhost:20128/api/settings` every 500ms, timeout after 30 seconds
    - Implement `stop()` with graceful shutdown: send SIGTERM, wait 5 seconds, then SIGKILL if still running
    - Implement `isRunning()` health check
    - Implement `onReady` and `onError` event callbacks
    - Handle child process `exit` event for crash detection and auto-restart (max 3 retries)
    - _Requirements: 2.1, 2.4, 2.6, 5.3_

  - [x] 3.2 Implement data directory initialization in server manager
    - Before starting the server, check if `.9router-data/` exists
    - If not, create the directory with subdirectories: `db/`, `logs/`, `mitm/`
    - Set `DATA_DIR` environment variable pointing to the resolved data directory
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 3.3 Write property test for data directory initialization
    - **Property 3: Data directory initialization**
    - Generate random initial directory states, run initialization, assert required structure (db/, logs/, mitm/) exists
    - Use fast-check with Vitest, minimum 100 iterations
    - **Validates: Requirements 5.2**

- [x] 4. Implement Window Manager
  - [x] 4.1 Implement window manager (`desktop/src/windowManager.js`)
    - Implement `createWindow()` that creates a BrowserWindow with minimum size 900x600, title "Audira Route"
    - Implement window state persistence: save position/dimensions to `desktop-window-state.json` in `app.getPath('userData')` on resize/move/close (debounced)
    - Implement `restoreState()` that reads saved state and validates bounds are within a visible display
    - Fall back to default dimensions (1280x800, centered) if state file is corrupted or missing
    - Implement `show()`, `hide()`, `focus()` methods
    - Intercept `will-navigate` and `new-window` events: internal URLs navigate in BrowserWindow, external URLs open via `shell.openExternal()`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 4.2 Write property test for window state persistence
    - **Property 1: Window state persistence round-trip**
    - Generate random valid window bounds (x, y, width, height, isMaximized), save to disk, restore, assert equality
    - Use fast-check with Vitest, minimum 100 iterations
    - **Validates: Requirements 3.2, 3.3**

- [x] 5. Checkpoint - Core components verified
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement Tray Manager
  - [x] 6.1 Implement tray manager (`desktop/src/trayManager.js`)
    - Implement `create()` that creates a system tray icon using the application icon
    - Build context menu with items: "Open Dashboard", "Auto-start" (checkbox toggle), "Quit"
    - "Open Dashboard" action: call `windowManager.show()` and `windowManager.focus()`
    - "Auto-start" toggle: call `app.setLoginItemSettings({ openAtLogin: toggle })`
    - "Quit" action: call `serverManager.stop()` then `app.quit()`
    - Handle double-click on tray icon: show and focus window
    - Implement `destroy()` for cleanup on shutdown
    - Implement `updateMenu(autoStartEnabled)` to reflect current auto-start state
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 7. Implement Auto-Updater
  - [x] 7.1 Implement auto-updater wrapper (`desktop/src/autoUpdater.js`)
    - Import and configure `electron-updater`'s `autoUpdater`
    - Implement `checkForUpdates()` called on app ready
    - On `update-available` event: show notification with new version number
    - On user acceptance: call `autoUpdater.downloadUpdate()`
    - On `update-downloaded` event: show dialog prompting restart to apply update
    - On user confirm: call `autoUpdater.quitAndInstall()`
    - On network error: silently catch, log to console, retry on next launch
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 8. Implement Lifecycle Manager (main entry point)
  - [x] 8.1 Implement main entry point (`desktop/main.js`)
    - Import all managers: serverManager, windowManager, trayManager, autoUpdater
    - On `app.whenReady()`: request single-instance lock, start server, create window on server ready, create tray, check for updates
    - If single-instance lock denied: focus existing window via `second-instance` event, exit new instance
    - Implement close-to-tray: on window `close` event, prevent default and hide window (unless `isQuitting` flag is set)
    - Implement `gracefulShutdown()`: set `isQuitting = true`, stop server, destroy tray, call `app.exit(0)`
    - Handle OS shutdown signals (`before-quit` event): trigger graceful shutdown
    - If server fails to start: show error dialog with failure reason, offer retry or quit buttons
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 5.4, 5.5_

  - [x] 8.2 Implement development mode support in main entry point
    - When `NODE_ENV=development`: skip spawning embedded server, connect to `http://localhost:20128` from existing dev server
    - When in development mode: open DevTools automatically on window creation
    - _Requirements: 8.1, 8.2, 8.3_

- [x] 9. Implement build script
  - [x] 9.1 Create build orchestration script (`desktop/scripts/build.js`)
    - Run `next build` in the root project directory to produce standalone output
    - Copy `.next/standalone/`, `.next/static/`, and `public/` to expected locations for electron-builder
    - Run `electron-builder` to produce platform-specific installer
    - Exclude dev-only files: `node_modules` dev dependencies, `.git`, `gitbook/`, `docs/`
    - Support code signing via environment variables (optional, for release builds)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 1.1, 1.2, 1.3_

- [x] 10. Checkpoint - Full integration verified
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Wire everything together and final integration
  - [x] 11.1 Verify end-to-end application flow
    - Ensure `dev:desktop` script launches Electron in dev mode connecting to local Next.js dev server
    - Ensure `build:desktop` script produces platform-specific installer with all resources bundled
    - Verify server startup → window display → tray creation → auto-update check sequence
    - Verify close-to-tray → tray "Open Dashboard" → window restore flow
    - Verify "Quit" from tray → graceful server shutdown → app exit flow
    - Verify single-instance enforcement: second launch focuses existing window
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 4.3, 4.4, 5.5, 8.1_

  - [ ]* 11.2 Write unit tests for server manager
    - Test readiness polling logic with mocked HTTP responses
    - Test graceful shutdown sequencing (SIGTERM → timeout → SIGKILL)
    - Test crash detection and auto-restart (max 3 retries)
    - Test error dialog display on startup failure after 30s timeout
    - _Requirements: 2.1, 2.5, 2.6_

  - [ ]* 11.3 Write unit tests for window manager
    - Test window state save/restore with edge cases (negative coords, zero dimensions, multi-monitor)
    - Test corrupted state file fallback to defaults
    - Test navigation interception (internal vs external URLs)
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6_

  - [ ]* 11.4 Write unit tests for tray manager
    - Test context menu item actions
    - Test auto-start toggle state persistence
    - Test tray icon double-click behavior
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 12. Final checkpoint - All tests pass and build produces artifacts
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The implementation uses JavaScript (Node.js) consistent with the existing codebase
- Testing uses Vitest with fast-check for property-based tests as specified in the design
- The `desktop/` directory is self-contained with its own package.json to avoid interfering with the existing Next.js and CLI builds

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1", "2.2"] },
    { "id": 2, "tasks": ["2.3", "3.1", "3.2"] },
    { "id": 3, "tasks": ["3.3", "4.1"] },
    { "id": 4, "tasks": ["4.2", "6.1"] },
    { "id": 5, "tasks": ["7.1", "8.1"] },
    { "id": 6, "tasks": ["8.2", "9.1"] },
    { "id": 7, "tasks": ["11.1"] },
    { "id": 8, "tasks": ["11.2", "11.3", "11.4"] }
  ]
}
```
