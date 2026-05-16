#!/usr/bin/env node

/**
 * Build Orchestration Script for Audira Route Desktop
 *
 * This script orchestrates the full build pipeline:
 * 1. Runs `next build` in the root project directory to produce standalone output
 * 2. Runs `electron-builder` to package the app into a platform-specific installer
 *
 * The electron-builder.yml already has extraResources configured to pull from:
 *   - ../.next/standalone → server/
 *   - ../.next/static → server/.next/static/
 *   - ../public → server/public/
 *
 * Code Signing (optional, for release builds):
 *   electron-builder automatically uses these environment variables when set:
 *   - CSC_LINK: Path to the code signing certificate (.p12 or .pfx file)
 *   - CSC_KEY_PASSWORD: Password for the code signing certificate
 *   - On macOS, you can also use CSC_NAME to specify the certificate name in Keychain
 *
 * Usage:
 *   node scripts/build.js
 *   CSC_LINK=./cert.pfx CSC_KEY_PASSWORD=secret node scripts/build.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const DESKTOP_DIR = path.resolve(__dirname, '..');

/**
 * Files and directories excluded from the final package.
 * electron-builder handles most exclusions via the `files` config in electron-builder.yml,
 * but the Next.js build itself should not include these in standalone output.
 */
const DEV_ONLY_PATHS = [
  '.git',
  'gitbook',
  'docs',
  'node_modules/.cache',
];

function log(message) {
  console.log(`[build] ${message}`);
}

function logStep(step, message) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`[build] Step ${step}: ${message}`);
  console.log(`${'='.repeat(60)}\n`);
}

/**
 * Step 1: Run Next.js build to produce standalone output
 */
function buildNextApp() {
  logStep(1, 'Building Next.js application (standalone output)');

  const nextBuildOutput = path.join(ROOT_DIR, '.next', 'standalone');

  log(`Root directory: ${ROOT_DIR}`);
  log('Running: npm run build');

  execSync('npm run build', {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
    },
  });

  // Verify standalone output was produced
  if (!fs.existsSync(nextBuildOutput)) {
    throw new Error(
      `Next.js standalone output not found at ${nextBuildOutput}. ` +
      'Ensure next.config has output: "standalone" configured.'
    );
  }

  // Verify static assets exist
  const staticDir = path.join(ROOT_DIR, '.next', 'static');
  if (!fs.existsSync(staticDir)) {
    throw new Error(
      `Next.js static assets not found at ${staticDir}. ` +
      'The build may have failed silently.'
    );
  }

  // Verify public directory exists
  const publicDir = path.join(ROOT_DIR, 'public');
  if (!fs.existsSync(publicDir)) {
    log('Warning: public/ directory not found. Continuing without public assets.');
  }

  log('Next.js build completed successfully.');
  log(`Standalone output: ${nextBuildOutput}`);
}

/**
 * Step 2: Clean dev-only files from standalone output to reduce package size
 */
function cleanDevFiles() {
  logStep(2, 'Cleaning dev-only files from build output');

  const standaloneDir = path.join(ROOT_DIR, '.next', 'standalone');

  for (const devPath of DEV_ONLY_PATHS) {
    const fullPath = path.join(standaloneDir, devPath);
    if (fs.existsSync(fullPath)) {
      log(`Removing: ${devPath}`);
      fs.rmSync(fullPath, { recursive: true, force: true });
    }
  }

  log('Dev-only files cleaned.');
}

/**
 * Step 3: Run electron-builder to produce platform-specific installer
 */
function buildElectronApp() {
  logStep(3, 'Packaging with electron-builder');

  log(`Desktop directory: ${DESKTOP_DIR}`);

  // Check for code signing environment variables
  if (process.env.CSC_LINK) {
    log('Code signing certificate detected (CSC_LINK is set).');
  } else {
    log('No code signing certificate found. Building unsigned package.');
    log('Set CSC_LINK and CSC_KEY_PASSWORD environment variables for signed builds.');
  }

  log('Running: npx electron-builder --config electron-builder.yml');

  execSync('npx electron-builder --config electron-builder.yml', {
    cwd: DESKTOP_DIR,
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
    },
  });

  log('electron-builder completed successfully.');

  // Report output location
  const distDir = path.join(DESKTOP_DIR, 'dist');
  if (fs.existsSync(distDir)) {
    const files = fs.readdirSync(distDir).filter(f => {
      return f.endsWith('.exe') || f.endsWith('.dmg') || f.endsWith('.AppImage') || f.endsWith('.deb');
    });
    if (files.length > 0) {
      log('Produced installers:');
      files.forEach(f => log(`  - dist/${f}`));
    }
  }
}

/**
 * Main build pipeline
 */
async function main() {
  const startTime = Date.now();

  console.log('\n');
  log('Audira Route Desktop - Build Pipeline');
  log(`Platform: ${process.platform} (${process.arch})`);
  log(`Node.js: ${process.version}`);
  console.log('');

  try {
    buildNextApp();
    cleanDevFiles();
    buildElectronApp();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n${'='.repeat(60)}`);
    log(`Build completed successfully in ${elapsed}s`);
    log(`Output: ${path.join(DESKTOP_DIR, 'dist')}`);
    console.log(`${'='.repeat(60)}\n`);
  } catch (error) {
    console.error(`\n[build] ERROR: ${error.message}`);
    if (error.status) {
      console.error(`[build] Process exited with code ${error.status}`);
    }
    process.exit(1);
  }
}

main();
