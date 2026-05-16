# Implementation Plan: Neo Brutalism Theme

## Overview

This plan transforms the Audira Route dashboard from its current theme to a Neo Brutalism Light style. The implementation follows a centralized-first strategy: CSS variables and Tailwind theme tokens are updated first (propagating changes globally), then shared components are restyled, dark mode is removed, and finally all dashboard pages are cleaned up for consistency. No business logic or data flow changes are involved.

## Tasks

- [x] 1. Update CSS variables and Tailwind theme tokens
  - [x] 1.1 Rewrite `:root` CSS variables in `src/app/globals.css` for Neo Brutalism
    - Replace all color, shadow, border, and radius variables with Neo Brutalism values
    - Set backgrounds: `--color-bg: #F5F5F5`, `--color-surface: #FFFFFF`
    - Set borders: `--color-border: #000000`, `--border-width: 2px`, `--border-width-heavy: 3px`
    - Set hard shadows: `--shadow-soft: 4px 4px 0px #000000`, `--shadow-elevated: 6px 6px 0px #000000`, `--shadow-focus: 3px 3px 0px #E56A4A`
    - Set radii: `--radius-brand: 0px`, `--radius-brand-lg: 0px`
    - Set text colors: `--color-text: #000000`, `--color-text-muted: #374151`
    - Set brand/status colors: `--color-brand-500: #E56A4A`, `--color-info: #3B82F6`, `--color-success: #10B981`, `--color-warning: #FBBF24`, `--color-danger: #DC2626`, `--color-accent-pink: #EC4899`
    - Set `color-scheme: light`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

  - [x] 1.2 Remove dark mode CSS and configure light-only theme
    - Remove the entire `.dark` class CSS variable overrides block from `globals.css`
    - Remove `@custom-variant dark` directive
    - Remove all glow/shimmer keyframe animations (`border-glow`, `pulseGlow`, `ctaGlowPulse`, `ctaShimmer`)
    - Retain only functional animations (`spin`, `fadeIn`)
    - _Requirements: 9.1, 9.2, 9.4, 11.3, 11.4_

  - [x] 1.3 Update `@theme inline` Tailwind token mappings in `globals.css`
    - Map new CSS variables to Tailwind theme tokens (colors, shadows, borders)
    - Add border-width tokens if not present
    - Remove any gradient-related tokens
    - Set default transition duration to `100ms` and timing function to `ease-in-out`
    - _Requirements: 1.7, 11.1, 11.2_

  - [x] 1.4 Add Neo Brutalism typography variables
    - Set heading font-weight to `800` (extra-bold)
    - Set body font-weight to `500` (medium)
    - Set font-family to Inter sans-serif stack
    - Set heading letter-spacing to `-0.02em`
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2. Restyle shared UI components
  - [x] 2.1 Update `src/shared/components/Button.js` with Neo Brutalism styling
    - Apply 2px solid black border on all sides
    - Add hard shadow `4px 4px 0px #000000` in default state
    - Add hover state: translate 2px down/right, reduce shadow to `2px 2px 0px #000000`
    - Add active/pressed state: translate 4px down/right, remove shadow
    - Set font-weight to 700 (bold)
    - Use flat saturated background colors per variant (primary, secondary, outline, ghost, danger, success)
    - Remove all gradient backgrounds and soft shadows
    - Set border-radius to 0px
    - Set transition duration to 100ms ease-in-out
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 11.1, 11.2, 11.5_

  - [x] 2.2 Update `src/shared/components/Card.js` with Neo Brutalism styling
    - Apply 2px solid black border on all sides
    - Add hard shadow `4px 4px 0px #000000`
    - Set background to white (`#FFFFFF`)
    - Set border-radius to 0px
    - Add hover state for interactive cards: translate -2px vertically, increase shadow to `6px 6px 0px #000000`
    - Remove all soft shadows, gradients, and rounded corners
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 2.3 Update `src/shared/components/Input.js` with Neo Brutalism styling
    - Apply 2px solid black border on all sides
    - Set background to white (`#FFFFFF`)
    - Set border-radius to 0px
    - Add focus state: hard shadow `3px 3px 0px #E56A4A` (brand color)
    - Set font-weight to 500
    - Remove all soft shadows and rounded corners
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 2.4 Update `src/shared/components/Select.js` with Neo Brutalism styling
    - Apply same border, background, radius, and shadow styling as Input
    - 2px solid black border, white background, 0px radius
    - Focus state with brand-colored hard shadow
    - _Requirements: 5.6_

  - [x] 2.5 Update `src/shared/components/Modal.js` with Neo Brutalism styling
    - Apply 3px solid black border on all sides
    - Add hard shadow `8px 8px 0px #000000`
    - Set background to white (`#FFFFFF`) with 0px border-radius
    - Set backdrop to solid semi-transparent black (`rgba(0, 0, 0, 0.5)`) without blur
    - Remove all backdrop-filter blur effects
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

  - [x] 2.6 Update `src/shared/components/Drawer.js` with Neo Brutalism styling
    - Apply 3px solid black border on the visible edge
    - Add hard shadow
    - Remove all backdrop-filter blur effects
    - Set 0px border-radius
    - _Requirements: 6.4_

  - [x] 2.7 Update `src/shared/components/Badge.js` with Neo Brutalism styling
    - Apply 2px solid black border
    - Use saturated background colors per variant (default, primary, success, warning, error, info)
    - Set font-weight to 700 (bold) with black text color
    - Set border-radius to 0px
    - Add small hard shadow `2px 2px 0px #000000`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 2.8 Update `src/shared/components/Sidebar.js` with Neo Brutalism styling
    - Set background to white (`#FFFFFF`) with 2px solid black border on right edge
    - Remove all backdrop-filter blur effects
    - Active nav item: brand color background + 2px black border + hard shadow `3px 3px 0px #000000`
    - Hover nav item: light background (`#F5F5F5`) + 2px black border
    - Set nav item font-weight to 600 (semi-bold)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 3. Remove dark mode from components and store
  - [x] 3.1 Remove or hide `src/shared/components/ThemeToggle.js` from the UI
    - Remove the ThemeToggle component rendering from the Header
    - Keep the file to avoid breaking imports but render nothing or hide it
    - _Requirements: 9.3_

  - [x] 3.2 Simplify `src/store/themeStore.js`
    - Remove dark mode toggle logic
    - Set theme to always be 'light'
    - Remove any dark mode state management
    - _Requirements: 9.1, 9.4_

  - [x] 3.3 Update `src/shared/components/ThemeProvider.js`
    - Remove dark mode class application logic
    - Ensure only light theme is applied
    - _Requirements: 9.1, 9.4_

- [x] 4. Checkpoint - Verify core theme and components
  - Ensure all tests pass, ask the user if questions arise.
  - Run `npm run build` to verify no compilation errors
  - Verify no `dark:` utilities remain in shared components

- [x] 5. Update dashboard pages for Neo Brutalism consistency
  - [x] 5.1 Remove all `dark:` utility classes from dashboard layout and pages
    - Update `src/app/(dashboard)/layout.js` — remove `dark:` variants
    - Update `src/app/(dashboard)/dashboard/page.js` — remove `dark:` variants
    - Scan and update all 14 dashboard sub-pages: basic-chat, cli-tools, combos, console-log, endpoint, media-providers, mitm, profile, providers, proxy-pools, quota, skills, translator, usage
    - _Requirements: 9.5, 10.1_

  - [x] 5.2 Apply Neo Brutalism styling to dashboard tables and data displays
    - Update table components across dashboard pages to use 2px solid black borders for cells and headers
    - Set table backgrounds to white
    - Ensure consistent hard shadow on table containers
    - _Requirements: 10.3_

  - [x] 5.3 Update dashboard page backgrounds and section headings
    - Set page backgrounds to off-white (`#F5F5F5`)
    - Set section headings to extra-bold font-weight (800)
    - Replace any remaining gradients with solid colors
    - Replace any remaining soft shadows with hard shadows
    - _Requirements: 10.2, 10.4, 10.5_

  - [x] 5.4 Update remaining shared components for Neo Brutalism consistency
    - Update `src/shared/components/Header.js` — remove dark mode classes, apply Neo Brutalism borders/shadows
    - Update `src/shared/components/Toggle.js` — apply 2px black border, 0px radius, hard shadow
    - Update `src/shared/components/Tooltip.js` — apply black border, hard shadow, 0px radius
    - Update `src/shared/components/Pagination.js` — apply Neo Brutalism button styling
    - Update `src/shared/components/SegmentedControl.js` — apply black borders, 0px radius
    - _Requirements: 10.1, 10.5_

- [x] 6. Final checkpoint - Verify complete implementation
  - Ensure all tests pass, ask the user if questions arise.
  - Run `npm run build` to confirm no compilation errors
  - Run `grep -r "dark:" src/` to verify zero occurrences of dark mode utilities
  - Run `grep -r "gradient" src/shared/` to verify no gradients remain in shared components
  - Verify all border-radius resolves to 0px via CSS variables

## Notes

- This feature is purely visual — no business logic, data models, or API changes are involved
- The centralized-first strategy means most visual changes propagate from CSS variable updates in `globals.css`
- Component-level changes are only needed where Tailwind utility classes hardcode values conflicting with Neo Brutalism
- The ThemeToggle component file is retained but hidden to avoid breaking imports
- All component public APIs remain unchanged — no breaking changes for page-level consumers
- No property-based tests are included because this is a UI rendering transformation with no testable pure functions
- Checkpoints ensure incremental validation via build verification and grep checks

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8"] },
    { "id": 3, "tasks": ["3.1", "3.2", "3.3"] },
    { "id": 4, "tasks": ["5.1"] },
    { "id": 5, "tasks": ["5.2", "5.3", "5.4"] }
  ]
}
```
