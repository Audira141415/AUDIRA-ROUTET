'use strict';

const fs = require('fs');
const path = require('path');
const { getDataDir } = require('./paths');

/**
 * Required subdirectories within the data directory.
 * These are created on first launch to ensure the server has the expected
 * filesystem structure for database, logs, and MITM configuration.
 */
const REQUIRED_SUBDIRS = ['db', 'logs', 'mitm'];

/**
 * Ensures the `.9router-data/` directory and its required subdirectories exist.
 *
 * Called before spawning the server process to guarantee the data directory
 * structure is in place. If the directory already exists, this is a no-op
 * (recursive mkdir does not throw for existing directories).
 *
 * @returns {string} The resolved absolute path to the data directory.
 */
function ensureDataDir() {
  const dataDir = getDataDir();

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  for (const subdir of REQUIRED_SUBDIRS) {
    const subdirPath = path.join(dataDir, subdir);
    if (!fs.existsSync(subdirPath)) {
      fs.mkdirSync(subdirPath, { recursive: true });
    }
  }

  return dataDir;
}

module.exports = {
  ensureDataDir,
  REQUIRED_SUBDIRS,
};
