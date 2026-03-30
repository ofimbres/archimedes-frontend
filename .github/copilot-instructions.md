# 🤖 Copilot Prompt Instructions for UI Development (Tailwind + daisyUI)

This project uses **Tailwind CSS v4** and **daisyUI v5** for styling, with React for the UI layer. Copilot should generate clean, functional, and responsive code following the standards below — applicable to **both prototyping and production-level components**.

---

## 🔧 General Coding Guidelines

- Follow **modern coding standards and best practices**
- Use **semantic HTML5** where appropriate
- Maintain:
  - Consistent **indentation** and **code formatting**
  - **Clear, descriptive names** for variables, classes, and components
  - **Modular and reusable structure**
- Always include **comments** for complex or critical code sections

---

## 🎨 UI & Styling (Tailwind + daisyUI)

- Use **Tailwind utility classes** for layout, spacing, typography, and custom tokens (e.g. `text-water-deep`, `rounded-bubble`, `shadow-bubble`)
- Use **daisyUI component classes** for UI: `btn`, `btn-primary`, `card`, `card-body`, `navbar`, `dropdown`, `menu`, `form-control`, `input`, `input-bordered`, `alert`, `link`, etc.
- Prefer **semantic theme classes** so the UI follows the active role theme: `btn-primary`, `bg-base-100`, `text-base-content`, `border-base-300`
- Keep styling in **className** only; no new custom CSS files unless necessary (design system lives in `src/index.css`)
- Ensure output is **responsive** (Tailwind breakpoints: `sm:`, `md:`, `lg:`, etc.) and works across modern browsers

---

## ⚛️ React Guidelines

When generating React code, Copilot should:

- Use **function components** with **hooks** (e.g., `useState`, `useEffect`)
- Keep components **pure and reusable**
- Use **JSX syntax** properly and clearly
- Avoid deprecated patterns like class components or inline mutation
- Separate logic and UI where appropriate
- Follow proper file structure: `components/`, `hooks/`, `pages/`, etc.

---

## 📦 Project Structure & Context

- Use the existing folder structure (`src/components/`, `src/pages/`, etc.)
- Avoid hardcoding repeated UI; use **mappings, props, or loops** where possible
- Prioritize accessibility and mobile responsiveness

---

## 🧪 Use Cases

Copilot code output in this repo should support:

- Fully working frontends for **production** or **demo purposes**
- Maintainable **React components** using Tailwind + daisyUI
- Scalable UI that stays consistent with the Archimedes design system (see `src/index.css` and `docs/shared/runbooks/archimedes-frontend-tailwind-ui.md`)
