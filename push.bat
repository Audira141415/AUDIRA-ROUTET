@echo off
setlocal enabledelayedexpansion

REM Push script for Audira Route GitHub repository
REM Repository: https://github.com/Audira141415/AUDIRA-ROUTET.git

echo.
echo === Audira Route GitHub Push Script ===
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo Error: Git is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo Error: Not in a git repository
    pause
    exit /b 1
)

REM Get current branch
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set "BRANCH=%%i"
echo Current branch: %BRANCH%
echo.

REM Show status
echo Git status:
git status --short
echo.

REM Ask for commit message
set "COMMIT_MSG="
set /p COMMIT_MSG="Enter commit message (or press Enter to skip): "

if not defined COMMIT_MSG (
    echo Skipping commit (no message provided)
    echo.
    goto :push
)

echo.
echo Staging all changes...
git add .
if errorlevel 1 (
    echo Error: Failed to stage changes
    pause
    exit /b 1
)

echo Creating commit...
git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo Error: Failed to create commit
    pause
    exit /b 1
)

echo Commit created.
echo.

:push
REM Push to remote
echo Pushing to remote (%BRANCH%)...
git push origin %BRANCH%
if errorlevel 1 (
    echo Error: Failed to push to remote
    pause
    exit /b 1
)

echo.
echo Successfully pushed to GitHub!
echo Repository: https://github.com/Audira141415/AUDIRA-ROUTET.git
echo.
pause
