# 🤖 Copilot Prompt Instructions for UI Development (Bootstrap & React)

This project uses both Bootstrap and React for web development. Copilot should generate clean, functional, and responsive code following the standards below — applicable to **both prototyping and production-level components**.

---

## 🔧 General Coding Guidelines

- Follow **modern coding standards and best practices**
- Use **semantic HTML5** where appropriate
- Maintain:
  - Consistent **indentation** and **code formatting**
  - **Clear, descriptive names** for variables, classes, IDs, and components
  - **Modular and reusable structure**
- Always include **comments** for complex or critical code sections

---

## 🎨 UI & Bootstrap Guidelines

- Use **Bootstrap 5 via CDN** (or via npm in React)
- Ensure output is **responsive** and works across modern browsers
- When using Bootstrap, include:
  - A responsive **navbar**
  - **Cards**, **modals**, **forms**, **alerts**, and **buttons** where relevant
  - **JS bundle** when needed (e.g., for toggling modals or navbars)
- Components should follow **Bootstrap naming conventions** and **layout principles**

---

## ⚛️ React Guidelines

When generating React code, Copilot should:

- Use **function components** with **hooks** (e.g., `useState`, `useEffect`)
- Keep components **pure and reusable**
- Use **JSX syntax** properly and clearly
- Use **React-Bootstrap** or native Bootstrap classes as needed
- Avoid deprecated patterns like class components or inline mutation
- Separate logic and UI where appropriate
- Follow proper file structure: `components/`, `hooks/`, etc.

---

## 📦 Project Structure & Context

- HTML-only pages: keep JS and CSS inline for rapid prototyping
- React apps: use a clear folder structure (`src/components/`, `App.jsx`, etc.)
- Avoid hardcoding repeated UI; use **mappings, props, or loops** where possible
- Prioritize accessibility and mobile responsiveness

---

## 🧪 Use Cases

Copilot code output in this repo should support:

- Fully working frontends for **production** or **demo purposes**
- Maintainable **React components** and **HTML prototypes**
- Scalable UI development using Bootstrap and modern practices

---

