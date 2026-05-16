@echo off
title Audira Route - Stopping...
echo ============================================
echo   Audira Route - Stop
echo ============================================
echo.

:: Kill processes on port 20128
echo [1/2] Killing processes on port 20128...
set "found=0"
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":20128" ^| findstr "LISTENING"') do (
    echo       Killing PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    set "found=1"
)
if "%found%"=="0" (
    echo       No process found on port 20128.
) else (
    echo       Done.
)
echo.

:: Also kill any remaining node processes from this project
echo [2/2] Cleaning up related node processes...
taskkill /F /IM "node.exe" /FI "WINDOWTITLE eq Audira Route*" >nul 2>&1
echo       Done.
echo.

echo ============================================
echo   Audira Route stopped successfully.
echo ============================================
pause
