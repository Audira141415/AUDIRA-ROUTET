@echo off
title Audira Route - Starting...
echo ============================================
echo   Audira Route - Start
echo ============================================
echo.

:: Kill existing processes on port 20128 first
echo [1/4] Killing existing processes on port 20128...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":20128" ^| findstr "LISTENING"') do (
    echo       Killing PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)
echo       Done.
echo.

:: Kill any existing node processes related to this project
echo [2/4] Killing old node processes...
taskkill /F /IM "node.exe" /FI "WINDOWTITLE eq Audira Route*" >nul 2>&1
echo       Done.
echo.

:: Install desktop dependencies if needed
echo [3/4] Checking desktop dependencies...
if not exist "desktop\node_modules" (
    echo       Installing desktop dependencies...
    cd desktop
    npm install
    cd ..
)
echo       Done.
echo.

:: Start the Next.js dev server in background
echo [4/4] Starting Audira Route...
echo.
title Audira Route - Running (port 20128)

:: Start Next.js dev server in a hidden window
start "Audira Route Server" /MIN cmd /c "npm run dev"

:: Wait for server to be ready
echo       Waiting for server to start...
:wait_loop
timeout /t 2 /nobreak >nul
curl -s -o nul http://localhost:20128/api/settings >nul 2>&1
if errorlevel 1 goto wait_loop
echo       Server is ready!
echo.

:: Launch Electron desktop app
echo ============================================
echo   Server running on port 20128
echo   Launching Desktop App...
echo ============================================
echo.

cd desktop
npx cross-env NODE_ENV=development npx electron .
cd ..

:: When Electron closes, stop the server
echo.
echo Shutting down server...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":20128" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo Done. Goodbye!
