# Design Document: Neo Brutalism Theme

## Overview

This design transforms the Audira Route dashboard from its current warm/neutral light-dark theme to a **Neo Brutalism Light** style. The transformation is purely visual — no business logic or data flow changes. The approach leverages the existing CSS variable system in `globals.css` and Tailwind CSS v4's `@theme inline` directive to propagate changes globally, then updates individual shared components to adopt Neo Brutalism styling (hard shadows, solid borders, 0px radius, bold typography, no gradients).

The design prioritizes a **centralized-first** strategy: most visual changes flow from CSS variable updates, minimizing per-component edits. Component-level changes are only needed where Tailwind utility classes hardcode values that conflict with Neo Brutalism (e.g., `rounded-[14px]`, `shadow-[var(--shadow-elev)]`).

### Key Design Decisions

1. **Single theme only** — Dark mode is fully removed. No toggle, no `.dark` overrides, no `dark:` utilities.
2. **CSS variables as the source of truth** — Colors, shadows, borders, and radii are defined once in `:root` and consumed everywhere via Tailwind's theme system.
3. **Hard shadow via translate pattern** — Button/card hover interactions use `transform: translate()` combined with shadow reduction to create the classic Neo Brutalism "press" effect.
4. **No new dependencies** — All styling is achievable with existing Tailwind CSS v4 + custom CSS variables.

## Architecture

```mermaid
graph TD
    A[globals.css :root variables] --> B[@theme inline Tailwind tokens]
    B --> C[Shared Components]
    B --> D[Dashboard Pages]
    C --> D
    
    subgraph "CSS Variable Layer"
        A
        B
    end
    
    subgraph "Component Layer"
        C --> C1[Button]
        C --> C2[Card]
        C --> C3[Input / Select]
        C --> C4[Modal / Drawer]
        C --> C5[Badge]
        C --> C6[Sidebar]
    end
    
    subgraph "Page Layer"
        D --> D1[14 Dashboard Pages]
    end
```

### Change Propagation Strategy

1. **Layer 1 — CSS Variables** (`globals.css`): Update `:root` values for colors, shadows, borders, radii. Remove `.dark` block and `@custom-variant dark`.
2. **Layer 2 — Tailwind Theme** (`@theme inline`): Update token mappings to reflect new variables (add border-width, remove gradient tokens).
3. **Layer 3 — Shared Components**: Update hardcoded Tailwind classes in Button, Card, Input, Select, Modal, Drawer, Badge, Sidebar, ThemeToggle (remove/hide).
4. **Layer 4 — Dashboard Pages**: Search-and-replace `dark:` utilities, replace any remaining gradients/soft shadows/rounded corners with Neo Brutalism equivalents.

## Components and Interfaces

### CSS Variable System (globals.css)

The `:root` block will be restructured to define Neo Brutalism tokens:

```css
:root {
  /* Backgrounds */
  --color-bg: #F5F5F5;           /* Page background (off-white) */
  --color-bg-alt: #EBEBEB;       /* Alternate sections */
  --color-surface: #FFFFFF;       /* Card/component surfaces */
  --color-surface-2: #F5F5F5;    /* Nested surfaces */
  --color-surface-3: #EBEBEB;    /* Deeper nesting */
  --color-sidebar: #FFFFFF;      /* Sidebar - solid white, no transparency */

  /* Borders */
  --color-border: #000000;       /* Primary border - solid black */
  --color-border-subtle: #000000; /* Same as primary for Neo Brutalism */
  --border-width: 2px;           /* Default border thickness */
  --border-width-heavy: 3px;     /* Modal/elevated elements */

  /* Text */
  --color-text: #000000;
  --color-text-main: #000000;
  --color-text-muted: #374151;
  --color-text-subtle: #6B7280;

  /* Brand & Status Colors (saturated) */
  --color-brand-500: #E56A4A;    /* Brand orange */
  --color-primary: #E56A4A;
  --color-info: #3B82F6;         /* Electric blue */
  --color-success: #10B981;      /* Vivid green */
  --color-warning: #FBBF24;      /* Bright yellow */
  --color-danger: #DC2626;       /* Bold red */
  --color-accent-pink: #EC4899;  /* Hot pink */

  /* Radius — 0px everywhere */
  --radius-brand: 0px;
  --radius-brand-lg: 0px;

  /* Hard Shadows */
  --shadow-soft: 4px 4px 0px #000000;
  --shadow-warm: 4px 4px 0px #000000;
  --shadow-elevated: 6px 6px 0px #000000;
  --shadow-elev: 6px 6px 0px #000000;
  --shadow-focus: 3px 3px 0px #E56A4A;
  --shadow-sm: 2px 2px 0px #000000;
  --shadow-lg: 8px 8px 0px #000000;

  color-scheme: light;
}
```

### Component Interface Changes

Each shared component retains its existing props API. Only internal className strings change.

| Component | Key Visual Changes |
|-----------|-------------------|
| **Button** | 2px black border, hard shadow, translate on hover/active, bold 700 weight, flat colors |
| **Card** | 2px black border, 4px hard shadow, white bg, 0px radius, hover lifts with 6px shadow |
| **Input** | 2px black border, white bg, 0px radius, focus shows brand-colored hard shadow |
| **Select** | Same as Input styling |
| **Modal** | 3px black border, 8px hard shadow, no backdrop blur, solid overlay |
| **Drawer** | 3px black border on left edge, hard shadow, no backdrop blur |
| **Badge** | 2px black border, saturated bg, bold text, 2px hard shadow, 0px radius |
| **Sidebar** | White bg, 2px black border-right, no blur, active items get brand bg + border + shadow |
| **ThemeToggle** | Removed/hidden from UI |

### Button Variant Mapping

```javascript
const variants = {
  primary: "bg-brand-500 hover:bg-brand-600 text-white border-2 border-black",
  secondary: "bg-white text-black border-2 border-black",
  outline: "bg-white text-black border-2 border-black",
  ghost: "bg-transparent text-black border-2 border-transparent hover:border-black",
  danger: "bg-red-500 text-white border-2 border-black",
  success: "bg-green-500 text-white border-2 border-black",
};
```

### Badge Variant Mapping

```javascript
const variants = {
  default: "bg-[#F5F5F5] text-black border-2 border-black",
  primary: "bg-[#E56A4A] text-black border-2 border-black",
  success: "bg-[#10B981] text-black border-2 border-black",
  warning: "bg-[#FBBF24] text-black border-2 border-black",
  error: "bg-[#DC2626] text-white border-2 border-black",
  info: "bg-[#3B82F6] text-white border-2 border-black",
};
```

## Data Models

No data model changes are required. This feature is purely presentational — it modifies CSS variables, Tailwind utility classes, and component styling. No database schemas, API contracts, or state management structures are affected.

### Files Modified (Summary)

| Category | Files |
|----------|-------|
| CSS Variables | `src/app/globals.css` |
| Shared Components | `Button.js`, `Card.js`, `Input.js`, `Select.js`, `Modal.js`, `Drawer.js`, `Badge.js`, `Sidebar.js`, `ThemeToggle.js`, `ThemeProvider.js` |
| Layouts | `DashboardLayout.js` |
| Dashboard Pages | All 14 pages under `src/app/(dashboard)/dashboard/` — remove `dark:` utilities |
| Store | `themeStore.js` — simplify or remove dark mode logic |

## Error Handling

This feature introduces no new error states. The changes are purely CSS/styling. However, the following defensive measures apply:

1. **Fallback values** — CSS variables use explicit hex values (not `var()` chains) so if a variable fails to resolve, the browser uses the declared fallback.
2. **Graceful degradation** — If a browser doesn't support CSS custom properties (extremely rare for target audience), the hardcoded Tailwind classes still provide a functional layout.
3. **Component prop stability** — All component public APIs remain unchanged. No breaking changes for page-level consumers.
4. **ThemeToggle removal** — The component file is retained but the toggle is hidden/removed from the Header. This avoids breaking imports if any page references it directly.

## Testing Strategy

### Why Property-Based Testing Does NOT Apply

This feature is a **UI rendering and visual styling** transformation. It involves:
- Updating CSS variable values (declarative configuration)
- Changing Tailwind utility classes on components (template modifications)
- Removing dark mode overrides (configuration removal)

There are no pure functions with input/output behavior, no data transformations, no algorithms, and no business logic changes. The "inputs" are fixed CSS values and the "outputs" are visual rendering — which cannot be meaningfully validated through property-based testing.

### Recommended Testing Approach

**1. Visual Regression Testing (Primary)**
- Use screenshot comparison tools (e.g., Playwright visual snapshots or Chromatic) to capture before/after states of each component and page
- Verify no unintended visual regressions across the 14 dashboard pages

**2. Manual Visual Inspection**
- Review each shared component in isolation for correct Neo Brutalism styling
- Verify hover/active/focus states on interactive elements (Button, Input, Card, Sidebar items)
- Confirm no remnant dark mode artifacts (no `.dark` classes, no `dark:` utilities rendering)

**3. CSS Linting / Grep Verification**
- Run automated grep to confirm zero occurrences of `dark:` in component files
- Verify no `backdrop-blur`, `gradient`, or `rounded-[14px]` patterns remain in shared components
- Confirm all `border-radius` resolves to `0px` via CSS variable

**4. Build Verification**
- Run `next build` to confirm no compilation errors from removed classes or variables
- Verify no TypeScript/ESLint errors from component changes

**5. Cross-Browser Spot Check**
- Verify hard shadows render correctly in Chrome, Firefox, Safari
- Confirm `0px` border-radius displays as expected (no browser-specific rounding)

### Test Execution Plan

| Phase | What | How |
|-------|------|-----|
| 1 | Build passes | `npm run build` |
| 2 | No dark mode remnants | `grep -r "dark:" src/` returns zero results |
| 3 | No gradients in components | `grep -r "gradient" src/shared/` returns zero results |
| 4 | Visual review | Manual inspection of all 14 pages |
| 5 | Interaction states | Manual test of hover/active/focus on Button, Card, Input, Sidebar |
