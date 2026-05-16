# Requirements Document

## Introduction

Audira Route is currently a Next.js web application that runs as a local server (port 20128) with a CLI tool for management and system tray integration. This feature packages the existing web application as a native desktop application using Electron, providing a self-contained window experience without requiring a separate browser, while preserving the existing Next.js server, SQLite database, and API routing infrastructure.

## Glossary

- **Desktop_App**: The native desktop application that wraps the Audira Route web dashboard in an Electron BrowserWindow and manages the embedded Next.js server lifecycle
- **Main_Process**: The Electron main process responsible for window management, application lifecycle, system tray integration, and spawning the Next.js server
- **Renderer_Process**: The Electron renderer process (BrowserWindow) that displays the Audira Route web dashboard
- **Embedded_Server**: The Next.js standalone server bundled within the desktop application that serves the dashboard and API routes on localhost
- **App_Window**: The primary BrowserWindow instance displaying the Audira Route dashboard
- **Installer**: The platform-specific distribution package (NSIS for Windows, DMG for macOS, AppImage/deb for Linux) that installs the Desktop_App
- **Auto_Updater**: The module responsible for checking, downloading, and applying application updates
- **Data_Directory**: The `.9router-data/` directory containing the SQLite database, logs, and MITM configuration

## Requirements

### Requirement 1: Application Packaging

**User Story:** As a user, I want to install Audira Route as a native desktop application, so that I can run it without manually starting a CLI server or opening a browser.

#### Acceptance Criteria

1. THE Installer SHALL produce platform-specific packages for Windows (NSIS installer), macOS (DMG), and Linux (AppImage)
2. WHEN the Desktop_App is installed, THE Installer SHALL register the application in the operating system's application registry (Start Menu on Windows, Applications folder on macOS, desktop entry on Linux)
3. THE Desktop_App SHALL bundle the Next.js standalone build output, node_modules dependencies, and SQLite binaries into a single distributable package
4. THE Desktop_App SHALL target Electron as the desktop framework to leverage existing Node.js compatibility with the Next.js server and better-sqlite3 native modules
5. WHEN the Desktop_App is packaged, THE Main_Process SHALL include the application icon (existing icon.ico for Windows, icon.png for macOS/Linux)

### Requirement 2: Application Lifecycle

**User Story:** As a user, I want the desktop application to start the server automatically when I launch it, so that I can use the dashboard immediately without additional steps.

#### Acceptance Criteria

1. WHEN the Desktop_App is launched, THE Main_Process SHALL start the Embedded_Server on port 20128 before displaying the App_Window
2. WHEN the Embedded_Server reports readiness, THE Main_Process SHALL create and display the App_Window loading `http://localhost:20128/dashboard`
3. WHEN the user closes the App_Window, THE Main_Process SHALL minimize the application to the system tray instead of terminating
4. WHEN the user selects "Quit" from the system tray menu, THE Main_Process SHALL gracefully shut down the Embedded_Server and terminate the application
5. IF the Embedded_Server fails to start within 30 seconds, THEN THE Main_Process SHALL display an error dialog with the failure reason and offer to retry or quit
6. WHEN the operating system sends a shutdown signal, THE Main_Process SHALL gracefully stop the Embedded_Server before exiting

### Requirement 3: Window Management

**User Story:** As a user, I want the desktop application to behave like a native window, so that I can resize, minimize, and manage it like other desktop applications.

#### Acceptance Criteria

1. THE App_Window SHALL have a minimum size of 900x600 pixels
2. THE App_Window SHALL persist its position and dimensions between sessions
3. WHEN the App_Window is created, THE Main_Process SHALL restore the previously saved window position and dimensions
4. THE App_Window SHALL display "Audira Route" as the window title
5. WHEN the user navigates within the dashboard, THE App_Window SHALL handle navigation internally without opening external browser windows
6. WHEN a link targets an external URL (outside localhost:20128), THE Main_Process SHALL open the link in the user's default browser

### Requirement 4: System Tray Integration

**User Story:** As a user, I want the application to run in the system tray, so that it stays accessible without occupying taskbar space.

#### Acceptance Criteria

1. WHEN the Desktop_App starts, THE Main_Process SHALL create a system tray icon using the existing application icon
2. THE Main_Process SHALL display a tray context menu with items: "Open Dashboard", "Auto-start" toggle, and "Quit"
3. WHEN the user clicks "Open Dashboard" in the tray menu, THE Main_Process SHALL show and focus the App_Window
4. WHEN the user double-clicks the tray icon, THE Main_Process SHALL show and focus the App_Window
5. WHEN the user toggles "Auto-start", THE Main_Process SHALL enable or disable the application launch at operating system startup

### Requirement 5: Data Persistence and Isolation

**User Story:** As a user, I want the desktop application to use the same data directory as the CLI version, so that my providers, settings, and usage history are preserved.

#### Acceptance Criteria

1. THE Desktop_App SHALL use the existing Data_Directory (`.9router-data/`) relative to the application's working directory for SQLite database storage
2. WHEN the Desktop_App starts for the first time and no Data_Directory exists, THE Main_Process SHALL create the Data_Directory with the required subdirectory structure (db/, logs/, mitm/)
3. THE Desktop_App SHALL set the `DATA_DIR` environment variable to point to the Data_Directory before starting the Embedded_Server
4. WHILE the Desktop_App is running, THE Embedded_Server SHALL have exclusive write access to the SQLite database file
5. IF another instance of the Desktop_App is already running, THEN THE Main_Process SHALL focus the existing instance window and terminate the new instance

### Requirement 6: Build and Distribution Pipeline

**User Story:** As a developer, I want an automated build process for the desktop application, so that I can produce distributable packages for all platforms.

#### Acceptance Criteria

1. THE Desktop_App SHALL use electron-builder as the packaging and distribution tool
2. WHEN the build script is executed, THE build process SHALL first run `next build` to produce the standalone output, then package it with Electron
3. THE build process SHALL produce unsigned development builds by default and support code signing via environment variables for release builds
4. THE Desktop_App SHALL include a `package.json` script named `build:desktop` that produces the platform-specific installer for the current operating system
5. THE build process SHALL exclude development-only files (node_modules dev dependencies, .git, gitbook/, docs/) from the final package

### Requirement 7: Auto-Update Mechanism

**User Story:** As a user, I want the desktop application to update itself, so that I always have the latest features and fixes without manual reinstallation.

#### Acceptance Criteria

1. WHEN the Desktop_App starts, THE Auto_Updater SHALL check for available updates from the configured update server
2. WHEN an update is available, THE Auto_Updater SHALL display a notification to the user with the new version number
3. WHEN the user accepts the update, THE Auto_Updater SHALL download and install the update in the background
4. WHEN the update download completes, THE Auto_Updater SHALL prompt the user to restart the application to apply the update
5. IF the update check fails due to network issues, THEN THE Auto_Updater SHALL silently retry on the next application launch without displaying an error

### Requirement 8: Developer Experience

**User Story:** As a developer, I want to run the desktop application in development mode, so that I can iterate on the Electron integration without rebuilding the full package.

#### Acceptance Criteria

1. THE Desktop_App SHALL include a `package.json` script named `dev:desktop` that launches Electron in development mode pointing to the local Next.js dev server
2. WHEN running in development mode, THE Main_Process SHALL connect to `http://localhost:20128` served by the existing `npm run dev` process instead of starting an Embedded_Server
3. WHEN running in development mode, THE App_Window SHALL open Chromium DevTools automatically for debugging
4. THE Desktop_App project structure SHALL reside in a `desktop/` directory at the repository root, separate from the existing `cli/` and `src/` directories
