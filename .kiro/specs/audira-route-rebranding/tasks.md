# Implementation Plan: Audira Route Rebranding

## Overview

This plan implements the systematic rebranding of the application from "9Router" to "Audira Route" across the entire codebase. The work is organized into independent transformation layers, each targeting a specific category of changes. Asset renames are performed first to avoid broken references in subsequent documentation updates.

## Tasks

- [x] 1. Rename image and logo assets
  - [x] 1.1 Rename image files containing "9router" to "audira-route"
    - Rename `images/9router.png` to `images/audira-route.png`
    - Rename any public directory assets containing "9router" to use "audira-route"
    - _Requirements: 7.1, 7.3_

- [x] 2. Update package identity
  - [x] 2.1 Update root package.json fields
    - Change `name` from "9router-app" to "audira-route-app"
    - Change `description` to reference "Audira Route" instead of "9Router"
    - _Requirements: 1.1, 1.2_

  - [x] 2.2 Update CLI package.json fields
    - Change `name` from "9router" to "audira-route"
    - Change `description` to reference "Audira Route"
    - Change `bin` entry key from "9router" to "audira-route"
    - Replace "9router" in `keywords` array with "audira-route"
    - _Requirements: 1.3, 1.4, 1.5, 1.6_

- [x] 3. Rebrand Dashboard UI
  - [x] 3.1 Update layout metadata and page titles
    - Change `metadata.title` in `src/app/layout.js` from "9Router" to "Audira Route"
    - Update `src/app/manifest.js` `name` and `short_name` fields
    - _Requirements: 2.1, 2.2_

  - [x] 3.2 Update login and landing page branding
    - Change login page heading from "9Router" to "Audira Route"
    - Update landing page text and GitHub URL references
    - _Requirements: 2.3, 2.4_

  - [x] 3.3 Update image references in Dashboard components
    - Update all component references from old logo file to `audira-route.png`
    - _Requirements: 2.5, 7.4_

- [x] 4. Rebrand CLI output and paths
  - [x] 4.1 Update CLI process identifiers and data directory paths
    - Change `PROCESS_IDENTIFIERS` from `['9router']` to `['audira-route']`
    - Change `getAppDataDir()` from `".9router"` / `"9router"` to `".audira-route"` / `"audira-route"`
    - Update `src/mitm/paths.js` `APP_NAME` from `"9router"` to `"audira-route"`
    - _Requirements: 3.1, 3.5, 4.1, 4.2_

  - [x] 4.2 Update CLI terminal UI text and breadcrumbs
    - Change Terminal UI title from `"📡 9Router Terminal UI"` to `"📡 Audira Route Terminal UI"`
    - Change breadcrumb base path from `["9Router"]` to `["Audira Route"]`
    - Update background mode message to reference "Audira Route"
    - _Requirements: 3.2, 3.3, 3.4_

  - [x] 4.3 Update CLI hooks and postinstall paths
    - Update `cli/hooks/postinstall.js` runtime directory path to `~/.audira-route/runtime/node_modules`
    - Update any other hook files referencing old brand paths
    - _Requirements: 4.3_

- [x] 5. Checkpoint - Verify core application changes
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Update Docker and CI/CD configuration
  - [x] 6.1 Update Dockerfile labels and paths
    - Change `org.opencontainers.image.title` label from "9router" to "audira-route"
    - Change symlink path from `/root/.9router` to `/root/.audira-route`
    - _Requirements: 5.1, 4.4_

  - [x] 6.2 Update GitHub Actions workflow
    - Change `DOCKERHUB_IMAGE` env var from `decolua/9router` to `decolua/audira-route`
    - Update any other workflow references to old brand
    - _Requirements: 5.2, 5.3_

  - [x] 6.3 Update DOCKER.md documentation
    - Replace all "9Router" / "9router" references with "Audira Route" / "audira-route"
    - _Requirements: 5.4_

- [x] 7. Update documentation files
  - [x] 7.1 Update README.md and i18n README files
    - Replace all "9Router" with "Audira Route" and "9router" with "audira-route" in README.md
    - Apply same replacements to README.zh-CN.md and all `i18n/README.*.md` files
    - Update npm badge URLs and GitHub repository references
    - _Requirements: 6.1, 6.2, 6.3, 10.3, 10.4_

  - [x] 7.2 Update gitbook content across all languages
    - Replace all brand references in `gitbook/content/en/`, `gitbook/content/es/`, `gitbook/content/ja/`, `gitbook/content/vi/`, `gitbook/content/zh-CN/`
    - Preserve grammatical structure of translated sentences
    - _Requirements: 6.4, 11.2, 11.3_

  - [x] 7.3 Update CHANGELOG.md and ARCHITECTURE.md
    - Replace all "9Router" / "9router" references in CHANGELOG.md
    - Replace all "9Router" / "9router" references in docs/ARCHITECTURE.md
    - _Requirements: 6.5, 6.6_

  - [x] 7.4 Update image references in all documentation
    - Change all markdown image paths from `images/9router.png` to `images/audira-route.png`
    - _Requirements: 7.2_

- [x] 8. Update License files
  - [x] 8.1 Add new copyright line to LICENSE files
    - Add `Copyright (c) 2025 Audira Route contributors` below existing copyright line in root LICENSE
    - Apply same change to `cli/LICENSE`
    - Preserve existing `Copyright (c) 2024-2026 decolua and contributors` line
    - _Requirements: 8.1, 8.2, 8.3_

- [x] 9. Update cloud sync, environment, and source comments
  - [x] 9.1 Update cloud sync URL references
    - Replace `CLOUD_URL=https://9router.com` with `CLOUD_URL=https://audira-route.com`
    - Replace `NEXT_PUBLIC_CLOUD_URL=https://9router.com` with `NEXT_PUBLIC_CLOUD_URL=https://audira-route.com`
    - Update any branding text in cloud sync logic
    - _Requirements: 9.1, 9.2_

  - [x] 9.2 Update environment configuration files
    - Update `.env.example` header comment, `DATA_DIR`, `INSTANCE_NAME`, and cloud URL values
    - Update `start.sh` references from "9router" to "audira-route"
    - _Requirements: 12.1, 12.2, 12.3_

  - [x] 9.3 Update source code comments and HTTP headers
    - Replace "9Router" / "9router" in all `.js`, `.mjs` source code comments
    - Update `User-Agent` header from `9Router/${version}` to `AudiraRoute/${version}`
    - Update `X-CLIENT-TYPE` from `"9router"` to `"audira-route"`
    - _Requirements: 10.1, 10.2, 10.5_

- [x] 10. Update i18n translation files
  - [x] 10.1 Update i18n directory and public i18n files
    - Replace all "9Router" with "Audira Route" and "9router" with "audira-route" in all files within `i18n/` directory
    - Apply same replacements to `public/i18n/` files if present
    - Preserve grammatical structure of translated sentences
    - _Requirements: 11.1, 11.3_

- [x] 11. Checkpoint - Run verification and build
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Final verification
  - [ ]* 12.1 Write completeness verification script
    - Create a script that scans the entire codebase (excluding `node_modules`, `.next`, `.git`) for remaining references to "9Router", "9router", "9router-app", ".9router", "decolua/9router"
    - Assert zero matches (or only allowlisted exceptions)
    - _Requirements: 1.1–1.6, 2.1–2.5, 3.1–3.5, 4.1–4.4, 5.1–5.4, 6.1–6.6, 7.1–7.4, 8.1–8.3, 9.1–9.2, 10.1–10.5, 11.1–11.3, 12.1–12.3_

  - [ ]* 12.2 Write package identity assertions
    - Assert root `package.json` has `name: "audira-route-app"`
    - Assert CLI `package.json` has `name: "audira-route"` and `bin: { "audira-route": "./cli.js" }`
    - Assert CLI keywords include `"audira-route"`
    - _Requirements: 1.1, 1.3, 1.5, 1.6_

  - [ ]* 12.3 Run build verification
    - Verify `npm install` succeeds
    - Verify `npm run build` succeeds (Next.js build)
    - Verify Docker build completes with `docker build -t audira-route .`
    - _Requirements: 5.1, 5.2_

- [x] 13. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Asset renames (Task 1) are performed first to prevent broken references in documentation updates
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- The design explicitly states property-based testing is not applicable for this deterministic rebranding feature
- Case-sensitive mapping: `9Router` → `Audira Route`, `9router` → `audira-route`, `9router-app` → `audira-route-app`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "8.1"] },
    { "id": 2, "tasks": ["3.1", "3.2", "4.1", "4.2", "4.3", "6.1", "6.2", "9.1", "9.2", "9.3", "10.1"] },
    { "id": 3, "tasks": ["3.3", "6.3", "7.1", "7.2", "7.3", "7.4"] },
    { "id": 4, "tasks": ["12.1", "12.2", "12.3"] }
  ]
}
```
