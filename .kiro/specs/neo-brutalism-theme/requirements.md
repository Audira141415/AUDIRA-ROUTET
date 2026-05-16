# Requirements Document

## Introduction

Mengubah seluruh tema visual aplikasi Audira Route dari tema gelap/terang saat ini menjadi gaya desain **Neo Brutalism Light**. Neo Brutalism ditandai dengan border hitam tebal, warna-warna cerah dan saturasi tinggi, background putih/terang, drop shadow keras (offset tanpa blur), elemen flat dengan kontras kuat, tipografi tebal dan chunky, serta estetika mentah yang disengaja tanpa gradien atau bayangan lembut.

Perubahan ini mencakup pembaruan CSS variables di `globals.css`, penyesuaian komponen UI bersama (shared components), dan penerapan konsisten di seluruh halaman dashboard.

## Glossary

- **Theme_System**: Sistem variabel CSS dan konfigurasi Tailwind yang mengontrol tampilan visual seluruh aplikasi
- **Dashboard**: Kumpulan halaman aplikasi di bawah route `(dashboard)/` yang menampilkan fitur-fitur utama
- **Shared_Components**: Komponen UI yang dapat digunakan ulang di `src/shared/components/` termasuk Button, Card, Input, Modal, Badge, dan lainnya
- **Neo_Brutalism_Style**: Gaya desain yang menggunakan border hitam tebal (2-3px), hard drop shadow (offset tanpa blur), warna primer cerah, background putih, dan tipografi bold
- **Hard_Shadow**: Bayangan dengan offset solid tanpa blur (contoh: `4px 4px 0px #000000`), ciri khas Neo Brutalism
- **CSS_Variables**: Custom properties CSS yang didefinisikan di `:root` dalam `globals.css` untuk mengontrol warna, shadow, dan radius secara terpusat
- **Color_Palette**: Kumpulan warna yang digunakan dalam tema, terdiri dari warna primer cerah, aksen, dan netral

## Requirements

### Requirement 1: Pembaruan CSS Variables untuk Neo Brutalism Light

**User Story:** Sebagai developer, saya ingin CSS variables diperbarui ke gaya Neo Brutalism Light, sehingga seluruh aplikasi secara otomatis mengadopsi tampilan baru melalui design tokens terpusat.

#### Acceptance Criteria

1. THE Theme_System SHALL define background colors as white (`#FFFFFF`) for surfaces and light off-white (`#F5F5F5`) for page backgrounds
2. THE Theme_System SHALL define border color as solid black (`#000000`) with a default border width of 2px
3. THE Theme_System SHALL define Hard_Shadow as `4px 4px 0px #000000` for standard elevation and `6px 6px 0px #000000` for elevated elements
4. THE Theme_System SHALL define a Color_Palette with saturated primary colors including brand orange (`#E56A4A`), electric blue (`#3B82F6`), vivid green (`#10B981`), bright yellow (`#FBBF24`), and hot pink (`#EC4899`)
5. THE Theme_System SHALL set border-radius to `0px` for all elements to maintain the raw, angular Neo Brutalism aesthetic
6. THE Theme_System SHALL define text color as solid black (`#000000`) for primary text and dark gray (`#374151`) for muted text
7. THE Theme_System SHALL remove all gradient definitions and replace them with solid color backgrounds
8. THE Theme_System SHALL remove all soft/blurred shadow definitions and replace them exclusively with Hard_Shadow variants

### Requirement 2: Tipografi Bold dan Chunky

**User Story:** Sebagai pengguna, saya ingin tipografi yang tebal dan menonjol, sehingga teks mudah dibaca dan sesuai dengan estetika Neo Brutalism.

#### Acceptance Criteria

1. THE Theme_System SHALL set the default heading font-weight to 800 (extra-bold) or 900 (black)
2. THE Theme_System SHALL set the default body font-weight to 500 (medium) for improved readability against high-contrast backgrounds
3. THE Theme_System SHALL use a sans-serif font stack with Inter as the primary font
4. THE Theme_System SHALL set letter-spacing to `-0.02em` for headings to create a tighter, more impactful appearance

### Requirement 3: Komponen Button dengan Gaya Neo Brutalism

**User Story:** Sebagai pengguna, saya ingin tombol-tombol memiliki tampilan Neo Brutalism yang khas, sehingga interaksi terasa tegas dan jelas.

#### Acceptance Criteria

1. THE Shared_Components Button SHALL render with a 2px solid black border on all sides
2. THE Shared_Components Button SHALL display a Hard_Shadow of `4px 4px 0px #000000` in its default state
3. WHEN a user hovers over a Button, THE Shared_Components Button SHALL translate its position by 2px down and 2px right while reducing the Hard_Shadow to `2px 2px 0px #000000`
4. WHEN a user presses a Button, THE Shared_Components Button SHALL translate its position by 4px down and 4px right while removing the Hard_Shadow entirely
5. THE Shared_Components Button SHALL use bold font-weight (700) for button labels
6. THE Shared_Components Button SHALL use flat, saturated background colors from the Color_Palette without any gradients

### Requirement 4: Komponen Card dengan Gaya Neo Brutalism

**User Story:** Sebagai pengguna, saya ingin card/panel memiliki tampilan Neo Brutalism yang konsisten, sehingga konten terorganisir dengan visual yang kuat.

#### Acceptance Criteria

1. THE Shared_Components Card SHALL render with a 2px solid black border on all sides
2. THE Shared_Components Card SHALL display a Hard_Shadow of `4px 4px 0px #000000`
3. THE Shared_Components Card SHALL use a white (`#FFFFFF`) background color
4. THE Shared_Components Card SHALL use `0px` border-radius for sharp, angular corners
5. WHEN a user hovers over an interactive Card, THE Shared_Components Card SHALL translate its position by -2px vertically while increasing the Hard_Shadow to `6px 6px 0px #000000`

### Requirement 5: Komponen Input dan Form dengan Gaya Neo Brutalism

**User Story:** Sebagai pengguna, saya ingin form inputs memiliki tampilan Neo Brutalism yang konsisten, sehingga area input jelas terlihat dan mudah diidentifikasi.

#### Acceptance Criteria

1. THE Shared_Components Input SHALL render with a 2px solid black border on all sides
2. THE Shared_Components Input SHALL use a white (`#FFFFFF`) background color
3. THE Shared_Components Input SHALL use `0px` border-radius for sharp corners
4. WHEN a user focuses on an Input, THE Shared_Components Input SHALL display a Hard_Shadow of `3px 3px 0px` using the brand primary color (`#E56A4A`)
5. THE Shared_Components Input SHALL use a font-weight of 500 for input text
6. THE Shared_Components Select SHALL follow the same border, background, and shadow styling as Input

### Requirement 6: Komponen Modal dan Drawer dengan Gaya Neo Brutalism

**User Story:** Sebagai pengguna, saya ingin modal dan drawer memiliki tampilan Neo Brutalism, sehingga overlay content terlihat tegas dan jelas terpisah dari background.

#### Acceptance Criteria

1. THE Shared_Components Modal SHALL render with a 3px solid black border on all sides
2. THE Shared_Components Modal SHALL display a Hard_Shadow of `8px 8px 0px #000000`
3. THE Shared_Components Modal SHALL use a white (`#FFFFFF`) background color with `0px` border-radius
4. THE Shared_Components Drawer SHALL render with a 3px solid black border on the visible edge
5. THE Shared_Components Modal backdrop SHALL use a solid semi-transparent black (`rgba(0, 0, 0, 0.5)`) without any blur effect

### Requirement 7: Komponen Badge dan Status Indicators

**User Story:** Sebagai pengguna, saya ingin badge dan indikator status memiliki tampilan Neo Brutalism, sehingga informasi status terlihat jelas dan menonjol.

#### Acceptance Criteria

1. THE Shared_Components Badge SHALL render with a 2px solid black border
2. THE Shared_Components Badge SHALL use saturated background colors from the Color_Palette for different status types
3. THE Shared_Components Badge SHALL use bold font-weight (700) with black text color for readability
4. THE Shared_Components Badge SHALL use `0px` border-radius for angular appearance
5. THE Shared_Components Badge SHALL display a small Hard_Shadow of `2px 2px 0px #000000`

### Requirement 8: Sidebar dan Navigation dengan Gaya Neo Brutalism

**User Story:** Sebagai pengguna, saya ingin sidebar navigasi memiliki tampilan Neo Brutalism, sehingga navigasi terlihat jelas dan konsisten dengan keseluruhan tema.

#### Acceptance Criteria

1. THE Shared_Components Sidebar SHALL use a white (`#FFFFFF`) background color with a 2px solid black border on the right edge
2. THE Shared_Components Sidebar SHALL remove all backdrop-filter blur effects
3. WHEN a navigation item is active, THE Shared_Components Sidebar SHALL highlight the item with a saturated brand color background and a 2px solid black border with Hard_Shadow of `3px 3px 0px #000000`
4. WHEN a user hovers over a navigation item, THE Shared_Components Sidebar SHALL display a light background color (`#F5F5F5`) with a 2px solid black border
5. THE Shared_Components Sidebar navigation items SHALL use bold font-weight (600) for labels

### Requirement 9: Penghapusan Dark Mode

**User Story:** Sebagai developer, saya ingin dark mode dihapus dari sistem tema, sehingga hanya ada satu tema Neo Brutalism Light yang konsisten.

#### Acceptance Criteria

1. THE Theme_System SHALL remove all `.dark` class CSS variable overrides from `globals.css`
2. THE Theme_System SHALL remove the `@custom-variant dark` directive from the CSS configuration
3. THE Shared_Components ThemeToggle SHALL be removed or hidden from the UI since only one theme exists
4. THE Theme_System SHALL set `color-scheme: light` as the only color scheme
5. THE Theme_System SHALL remove all `dark:` variant utility classes from component templates

### Requirement 10: Konsistensi Visual di Seluruh Dashboard Pages

**User Story:** Sebagai pengguna, saya ingin semua halaman dashboard memiliki tampilan Neo Brutalism yang konsisten, sehingga pengalaman visual seragam di seluruh aplikasi.

#### Acceptance Criteria

1. THE Dashboard SHALL apply Neo_Brutalism_Style consistently across all 14 sub-pages (basic-chat, cli-tools, combos, console-log, endpoint, media-providers, mitm, profile, providers, proxy-pools, quota, skills, translator, usage)
2. THE Dashboard page backgrounds SHALL use the off-white color (`#F5F5F5`) defined in the Theme_System
3. THE Dashboard tables and data displays SHALL use 2px solid black borders for cells and headers with white background
4. THE Dashboard section headings SHALL use extra-bold font-weight (800) consistent with Neo_Brutalism_Style typography
5. IF a component uses a gradient or soft shadow, THEN THE Dashboard SHALL replace the gradient or soft shadow with a solid color or Hard_Shadow respectively

### Requirement 11: Animasi dan Transisi yang Sesuai Neo Brutalism

**User Story:** Sebagai pengguna, saya ingin animasi dan transisi terasa tegas dan cepat sesuai estetika Neo Brutalism, tanpa efek halus yang berlebihan.

#### Acceptance Criteria

1. THE Theme_System SHALL set default transition duration to 100ms for hover and focus states
2. THE Theme_System SHALL use `ease-in-out` timing function for all transitions
3. THE Theme_System SHALL remove all glow animations (`border-glow`, `pulseGlow`, `ctaGlowPulse`) and shimmer effects (`ctaShimmer`)
4. THE Theme_System SHALL retain only functional animations (spin for loading, fadeIn for content appearance)
5. WHEN a user interacts with an element, THE Theme_System SHALL provide immediate visual feedback through position translation and shadow changes rather than color fading or opacity transitions
