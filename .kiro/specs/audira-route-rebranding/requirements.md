# Requirements Document

## Introduction

This document specifies the requirements for rebranding the application from "9Router" to "Audira Route". The rebranding covers all user-facing text, package identifiers, documentation, Docker configuration, CLI tooling, file/directory naming, and legal attribution across the entire codebase. The goal is a complete, consistent brand transition while preserving the original MIT license attribution.

## Glossary

- **Rebranding_Engine**: The set of changes applied across the codebase to replace old brand references with new brand references
- **Dashboard**: The Next.js web application providing the user interface at localhost:20128
- **CLI**: The command-line interface package published to npm that starts and manages the server
- **Old_Brand**: The previous brand identity "9Router" / "9router" / "9router-app"
- **New_Brand**: The new brand identity using "Audira Route" (display), "audira-route" (kebab-case), "audiraRoute" (camelCase), "audira_route" (snake_case)
- **Data_Directory**: The local filesystem directory storing runtime data (currently `~/.9router`, becoming `~/.audira-route`)
- **Cloud_Sync**: The feature that synchronizes configuration across devices via a remote endpoint

## Requirements

### Requirement 1: Package Identity Rebranding

**User Story:** As a developer, I want the npm packages to use the new brand name, so that the published packages reflect the Audira Route identity.

#### Acceptance Criteria

1. THE Rebranding_Engine SHALL replace the root package.json `name` field from "9router-app" to "audira-route-app"
2. THE Rebranding_Engine SHALL replace the root package.json `description` field to reference "Audira Route" instead of "9Router"
3. THE Rebranding_Engine SHALL replace the CLI package.json `name` field from "9router" to "audira-route"
4. THE Rebranding_Engine SHALL replace the CLI package.json `description` field to reference "Audira Route" instead of "9Router"
5. THE Rebranding_Engine SHALL replace the CLI package.json `bin` entry key from "9router" to "audira-route"
6. THE Rebranding_Engine SHALL replace all `keywords` array entries containing "9router" with "audira-route" in the CLI package.json

### Requirement 2: Dashboard UI Rebranding

**User Story:** As a user, I want all visible text in the web dashboard to display "Audira Route", so that the interface reflects the new brand consistently.

#### Acceptance Criteria

1. WHEN the Dashboard renders any page title or header, THE Dashboard SHALL display "Audira Route" instead of "9Router"
2. WHEN the Dashboard renders the browser tab title, THE Dashboard SHALL display "Audira Route" as the application name
3. WHEN the Dashboard renders navigation elements or breadcrumbs, THE Dashboard SHALL use "Audira Route" in place of "9Router"
4. WHEN the Dashboard renders informational text or descriptions referencing the application, THE Dashboard SHALL use "Audira Route" instead of "9Router"
5. THE Dashboard SHALL reference the new logo image file instead of the old "9router" branded image files

### Requirement 3: CLI Rebranding

**User Story:** As a developer using the CLI, I want all terminal output and commands to reference "Audira Route", so that the CLI experience matches the new brand.

#### Acceptance Criteria

1. THE CLI SHALL use "audira-route" as the executable command name instead of "9router"
2. WHEN the CLI displays the Terminal UI title, THE CLI SHALL show "Audira Route Terminal UI" instead of "9Router Terminal UI"
3. WHEN the CLI displays breadcrumb paths, THE CLI SHALL use "Audira Route" as the root breadcrumb instead of "9Router"
4. WHEN the CLI displays help text or usage instructions, THE CLI SHALL reference "audira-route" as the command name
5. WHEN the CLI references the data directory path in comments or runtime logic, THE CLI SHALL use "~/.audira-route" instead of "~/.9router"

### Requirement 4: Data Directory and Configuration Path Rebranding

**User Story:** As a user, I want the application data directory to use the new brand name, so that filesystem paths are consistent with the Audira Route identity.

#### Acceptance Criteria

1. THE Rebranding_Engine SHALL replace all references to `~/.9router` with `~/.audira-route` in source code
2. THE Rebranding_Engine SHALL replace all references to `.9router-data` with `.audira-route-data` in source code and configuration
3. WHEN the CLI postinstall hook creates runtime directories, THE CLI SHALL use `~/.audira-route/runtime/node_modules` as the target path
4. WHEN the Dockerfile creates symlinks to the home data directory, THE Rebranding_Engine SHALL reference `.audira-route` instead of `.9router`

### Requirement 5: Docker and CI/CD Rebranding

**User Story:** As a DevOps engineer, I want Docker images and CI workflows to use the new brand, so that container registries and automation reflect Audira Route.

#### Acceptance Criteria

1. THE Rebranding_Engine SHALL replace the Dockerfile `org.opencontainers.image.title` label from "9router" to "audira-route"
2. THE Rebranding_Engine SHALL replace the Docker Hub image reference from "decolua/9router" to the new Docker Hub image name using "audira-route"
3. WHEN the docker-publish workflow builds and pushes images, THE workflow SHALL tag images with the new brand name
4. THE Rebranding_Engine SHALL update the DOCKER.md documentation to reference "Audira Route" instead of "9Router"

### Requirement 6: Documentation Rebranding

**User Story:** As a user reading documentation, I want all docs to reference "Audira Route", so that the documentation is consistent with the new brand.

#### Acceptance Criteria

1. THE Rebranding_Engine SHALL replace all occurrences of "9Router" and "9router" in README.md with the appropriate casing of "Audira Route" or "audira-route"
2. THE Rebranding_Engine SHALL replace all occurrences of "9Router" and "9router" in README.zh-CN.md with the appropriate casing of "Audira Route" or "audira-route"
3. THE Rebranding_Engine SHALL replace all occurrences of "9Router" and "9router" in all i18n README files with the appropriate casing of "Audira Route" or "audira-route"
4. THE Rebranding_Engine SHALL replace all occurrences of "9Router" and "9router" in all gitbook content files across all language directories with the appropriate casing of "Audira Route" or "audira-route"
5. THE Rebranding_Engine SHALL replace all occurrences of "9Router" and "9router" in CHANGELOG.md with the appropriate casing of "Audira Route" or "audira-route"
6. THE Rebranding_Engine SHALL replace all occurrences of "9Router" and "9router" in docs/ARCHITECTURE.md with the appropriate casing of "Audira Route" or "audira-route"

### Requirement 7: Image and Logo Asset Rebranding

**User Story:** As a user, I want the application logo and image assets to reflect the new brand, so that visual identity is consistent.

#### Acceptance Criteria

1. THE Rebranding_Engine SHALL rename the file `images/9router.png` to `images/audira-route.png`
2. THE Rebranding_Engine SHALL update all references to `images/9router.png` in documentation files to point to `images/audira-route.png`
3. WHEN public directory assets contain files named with "9router", THE Rebranding_Engine SHALL rename them using "audira-route"
4. THE Rebranding_Engine SHALL update all internal references to renamed asset files

### Requirement 8: License Attribution Update

**User Story:** As a project maintainer, I want the LICENSE file to include the new copyright holder while preserving the original attribution, so that legal requirements are met.

#### Acceptance Criteria

1. THE Rebranding_Engine SHALL add a new copyright line "Copyright (c) 2025 Audira Route contributors" to the LICENSE file
2. THE Rebranding_Engine SHALL preserve the existing copyright line "Copyright (c) 2024-2026 decolua and contributors" in the LICENSE file
3. THE Rebranding_Engine SHALL place the new copyright line below the existing copyright line

### Requirement 9: Cloud Sync and URL Rebranding

**User Story:** As a user of cloud sync, I want cloud-related URLs and branding to reference Audira Route, so that the sync service identity is consistent.

#### Acceptance Criteria

1. WHEN source code references cloud sync endpoint branding text containing "9Router" or "9router", THE Rebranding_Engine SHALL replace the text with "Audira Route" or "audira-route"
2. WHEN environment variable comments or documentation reference cloud URLs with "9router", THE Rebranding_Engine SHALL update them to reference "audira-route"

### Requirement 10: Source Code Comments and Internal References

**User Story:** As a developer maintaining the codebase, I want all code comments and internal references to use the new brand, so that the codebase is internally consistent.

#### Acceptance Criteria

1. THE Rebranding_Engine SHALL replace all occurrences of "9Router" in source code comments with "Audira Route"
2. THE Rebranding_Engine SHALL replace all occurrences of "9router" in source code comments with "audira-route"
3. THE Rebranding_Engine SHALL replace all occurrences of "9router" in npm badge URLs and shield.io references with "audira-route"
4. THE Rebranding_Engine SHALL replace all occurrences of "9router" in GitHub repository URL references with "audira-route"
5. IF a code comment references the old npm package name "9router", THEN THE Rebranding_Engine SHALL replace it with "audira-route"

### Requirement 11: Internationalization File Rebranding

**User Story:** As a user viewing the application in a non-English language, I want translated content to reference "Audira Route", so that the brand is consistent across all locales.

#### Acceptance Criteria

1. THE Rebranding_Engine SHALL replace all occurrences of "9Router" and "9router" in all files within the `i18n/` directory with the appropriate casing of "Audira Route" or "audira-route"
2. THE Rebranding_Engine SHALL replace all occurrences of "9Router" and "9router" in all gitbook translation files within `gitbook/content/` subdirectories with the appropriate casing of "Audira Route" or "audira-route"
3. THE Rebranding_Engine SHALL preserve the grammatical structure of translated sentences when replacing brand names

### Requirement 12: Environment Configuration Rebranding

**User Story:** As a developer configuring the application, I want environment files and examples to reference the new brand, so that setup documentation is accurate.

#### Acceptance Criteria

1. WHEN the `.env.example` file contains comments or values referencing "9Router" or "9router", THE Rebranding_Engine SHALL replace them with "Audira Route" or "audira-route"
2. WHEN the `captain-definition` file references "9router", THE Rebranding_Engine SHALL replace it with "audira-route"
3. WHEN the `start.sh` script references "9router", THE Rebranding_Engine SHALL replace it with "audira-route"
