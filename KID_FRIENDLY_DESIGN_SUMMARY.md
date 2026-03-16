# UI Design Summary (Tailwind + daisyUI)

## Overview

The Archimedes Learning Platform uses **Tailwind CSS v4** and **daisyUI v5** for a consistent, kid-friendly UI. Styling is centralized in `src/index.css` with design tokens and role-based themes.

## Design System

### Stack
- **Tailwind CSS v4** – utilities and `@theme` tokens
- **daisyUI v5** – components (btn, card, navbar, menu, etc.) and theming
- **PostCSS** – `@tailwindcss/postcss` (see `postcss.config.js`)

### Where styling lives
- **`src/index.css`** – `@import "tailwindcss"`, `@plugin "daisyui"`, `@theme { }` (colors, fonts, radius, shadow, animations), base/components layers, and custom daisyUI theme blocks
- **`src/styles/index.css`** – global layout (reset, `#root`, `.App`, `#webworksheet-box`)
- **No page-specific CSS** – Landing, SignIn, auth, and teacher/student pages use only Tailwind and daisyUI classes

### Color palette (in `@theme`)
- **Water**: deep, mid, light, foam, surface (blues/teals)
- **Sand**: dark, DEFAULT, light (warm neutrals)
- **Teal**: deep, mid, light

Custom radius (`rounded-bubble`, `rounded-blob`), shadows (`shadow-bubble`), and animations (`animate-float`, `animate-bounce-soft`) are defined in `@theme` and keyframes in `index.css`.

## Role-based themes

- **Students & guests** – `data-theme="archimedes"` (water-primary, playful)
- **Teachers** – `data-theme="archimedes-teacher"` (teal-primary, calmer)

Theme is synced to `<html>` via `ThemeSync` in `App.tsx` and set in `public/index.html` so styles apply on load and after login.

## Key UI patterns

- **Landing** – Tailwind layout + daisyUI `btn`, `card`; decorative bubbles with `animate-float`
- **Auth pages** – `card`, `form-control`, `input`, `btn btn-primary`, `alert`, `link`
- **Navbars** – daisyUI `navbar`, `dropdown`, `menu`; semantic classes (`bg-base-100`, `text-base-content`) so they follow the active theme
- **Teacher Courses dropdown** – state-controlled open/close; closes on course or “Manage courses” click; separator is non-hoverable

## Legacy note

Earlier “kid-friendly” work used custom CSS files (`kid-friendly.css`, `Landing.css`, `SignIn.css`, etc.). Those have been removed; the design is now implemented with Tailwind + daisyUI only, as described above.
