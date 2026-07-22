'use strict';

const { fork } = require('child_process');
const http = require('http');
const { getServerPath, getDataDir } = require('./utils/paths');

const SERVER_PORT = 20128;
const POLL_INTERVAL_MS = 500;
const POLL_TIMEOUT_MS = 30000;
const SHUTDOWN_TIMEOUT_MS = 5000;
const MAX_RESTART_RETRIES = 3;

/**
 * Server Process Manager
 *
 * Manages the lifecycle of the embedded Next.js standalone server:
 * - Spawns the server as a child process
 * - Polls for readiness
 * - Handles graceful shutdown
 * - Detects crashes and auto-restarts (up to MAX_RESTART_RETRIES)
 */

/** @type {import('child_process').ChildProcess | null} */
let serverProcess = null;

/** @type {boolean} */
let running = false;

/** @type {boolean} */
let stopping = false;

/** @type {number} */
let restartCount = 0;

/** @type {((cb: () => void) => void) | null} */
let readyCallback = null;

/** @type {((cb: (err: Error) => void) => void) | null} */
let errorCallback = null;

/**
 * Polls the server health endpoint until it responds with HTTP 200.
 * @returns {Promise<void>} Resolves when server is ready, rejects on timeout.
 */
function pollForReady() {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const poll = () => {
      if (Date.now() - startTime > POLL_TIMEOUT_MS) {
        reject(new Error(`Server failed to become ready within ${POLL_TIMEOUT_MS / 1000} seconds`));
        return;
      }

      const req = http.get(`http://127.0.0.1:${SERVER_PORT}/api/health`, (res) => {
        if (res.statusCode === 200) {
          // Consume response data to free up memory
          res.resume();
          resolve();
        } else {
          res.resume();
          setTimeout(poll, POLL_INTERVAL_MS);
        }
      });

      req.on('error', () => {
        // Server not ready yet, retry
        setTimeout(poll, POLL_INTERVAL_MS);
      });

      // Set a short timeout on the request itself to avoid hanging
      req.setTimeout(2000, () => {
        req.destroy();
        setTimeout(poll, POLL_INTERVAL_MS);
      });
    };

    poll();
  });
}

function checkIfAlreadyRunning() {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${SERVER_PORT}/api/health`, (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on('error', () => {
      resolve(false);
    });
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Spawns the Next.js standalone server as a child process.
 * Sets DATA_DIR, PORT, and NODE_ENV environment variables.
 * Polls for readiness and invokes the ready or error callback.
 *
 * @returns {Promise<void>} Resolves when the server is ready.
 */
async function start() {
  if (running) {
    return;
  }

  stopping = false;

  // Check if server is already running and healthy on the port
  const alreadyRunning = await checkIfAlreadyRunning();
  if (alreadyRunning) {
    console.log(`[Server] Found healthy instance already running on port ${SERVER_PORT}. Reusing.`);
    running = true;
    if (readyCallback) {
      readyCallback();
    }
    return;
  }
  const serverPath = getServerPath();
  const dataDir = getDataDir();

  const env = {
    ...process.env,
    DATA_DIR: dataDir,
    PORT: String(SERVER_PORT),
    NODE_ENV: 'production',
    ELECTRON_MODE: '1',
  };

  serverProcess = fork(serverPath, [], {
    env,
    stdio: 'pipe',
    silent: true,
  });

  serverProcess.on('message', (msg) => {
    if (msg && msg.type === 'ELECTRON_TRIGGER_UPDATE') {
      console.log('[Server Manager] Received ELECTRON_TRIGGER_UPDATE message from Next.js server');
      try {
        const autoUpdater = require('./autoUpdater');
        autoUpdater.checkForUpdates();
        autoUpdater.downloadUpdate();
      } catch (err) {
        console.error('[Server Manager] Failed to trigger electron autoUpdater:', err.message);
      }
    }
  });


  const fs = require('fs');
  const path = require('path');
  const logStream = fs.createWriteStream(path.join(dataDir, 'logs', 'server.log'), { flags: 'a' });

  serverProcess.stdout.on('data', (data) => {
    const msg = data.toString();
    console.log(`[Server STDOUT] ${msg.trim()}`);
    logStream.write(`[${new Date().toISOString()}] STDOUT: ${msg}`);
  });

  serverProcess.stderr.on('data', (data) => {
    const msg = data.toString();
    console.error(`[Server STDERR] ${msg.trim()}`);
    logStream.write(`[${new Date().toISOString()}] STDERR: ${msg}`);
  });

  // Handle child process exit for crash detection
  serverProcess.on('exit', (code, signal) => {
    running = false;
    serverProcess = null;

    // If we're intentionally stopping, don't restart
    if (stopping) {
      return;
    }

    // Crash detected — attempt auto-restart
    if (restartCount < MAX_RESTART_RETRIES) {
      restartCount++;
      start().catch((err) => {
        if (errorCallback) {
          errorCallback(err);
        }
      });
    } else {
      const err = new Error(
        `Server crashed ${MAX_RESTART_RETRIES} times. Last exit code: ${code}, signal: ${signal}`
      );
      if (errorCallback) {
        errorCallback(err);
      }
    }
  });

  // Handle spawn errors
  serverProcess.on('error', (err) => {
    running = false;
    serverProcess = null;
    if (errorCallback) {
      errorCallback(err);
    }
  });

  // Wait for the server to become ready
  try {
    await pollForReady();
    running = true;
    restartCount = 0; // Reset on successful start
    if (readyCallback) {
      readyCallback();
    }
  } catch (err) {
    // Timeout or polling failure — kill the process and report error
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
      serverProcess = null;
    }
    running = false;
    if (errorCallback) {
      errorCallback(err);
    }
    throw err;
  }
}

/**
 * Gracefully stops the server process.
 * Sends SIGTERM first, waits up to 5 seconds, then force-kills if still running.
 *
 * @returns {Promise<void>} Resolves when the server has stopped.
 */
function stop() {
  return new Promise((resolve) => {
    stopping = true;

    if (!serverProcess) {
      running = false;
      resolve();
      return;
    }

    const pid = serverProcess.pid;

    // Listen for the process to exit
    const onExit = () => {
      clearTimeout(killTimer);
      running = false;
      serverProcess = null;
      resolve();
    };

    serverProcess.once('exit', onExit);

    // Send SIGTERM for graceful shutdown
    try {
      serverProcess.kill('SIGTERM');
    } catch (e) {
      // Process may have already exited
      running = false;
      serverProcess = null;
      resolve();
      return;
    }

    // If still running after timeout, force kill
    const killTimer = setTimeout(() => {
      if (serverProcess) {
        serverProcess.removeListener('exit', onExit);
        try {
          // On Windows, process.kill with no signal sends SIGTERM.
          // Use taskkill for forceful termination on Windows.
          if (process.platform === 'win32') {
            const { execSync } = require('child_process');
            try {
              execSync(`taskkill /pid ${pid} /T /F`, { stdio: 'ignore' });
            } catch (e) {
              // Process may have already exited
            }
          } else {
            serverProcess.kill('SIGKILL');
          }
        } catch (e) {
          // Process may have already exited
        }
        running = false;
        serverProcess = null;
        resolve();
      }
    }, SHUTDOWN_TIMEOUT_MS);
  });
}

/**
 * Returns whether the server process is currently running and ready.
 * @returns {boolean}
 */
function isRunning() {
  return running;
}

/**
 * Registers a callback to be invoked when the server becomes ready.
 * @param {() => void} cb
 */
function onReady(cb) {
  readyCallback = cb;
}

/**
 * Registers a callback to be invoked when a server error occurs.
 * @param {(err: Error) => void} cb
 */
function onError(cb) {
  errorCallback = cb;
}

module.exports = {
  start,
  stop,
  isRunning,
  onReady,
  onError,
};
