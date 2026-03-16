# 📁 Project Structure Guide

This document outlines the recommended folder structure and organization principles for the Archimedes Frontend project.

## 🏗️ Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components across the app
│   │   ├── Alert.tsx
│   │   ├── Loading.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── index.ts     # Barrel exports
│   ├── student/         # Student-specific components
│   └── teacher/         # Teacher-specific components
├── pages/               # Route-level components (page containers)
│   ├── auth/           # Authentication pages
│   ├── student/        # Student dashboard pages
│   └── teacher/        # Teacher dashboard pages
├── contexts/           # React Context providers
│   ├── AuthContext.tsx
│   └── StudentContext.tsx
├── hooks/              # Custom React hooks
│   └── UseAuthHooks.tsx
├── utils/              # Utility functions
│   ├── dateUtils.ts
│   ├── stringUtils.ts
│   └── validation.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── constants/          # Application constants
│   └── index.ts
├── styles/             # Global layout styles (reset, #root, .App)
│   └── index.css
└── libs/               # Third-party library configurations
    └── apiEndpoints.js
```

## 📋 Organization Principles

### Components
- **common/**: Reusable components used across different parts of the app
- **[role]/**: Role-specific components (student, teacher, admin)
- Use PascalCase for component names
- Include barrel exports (index.ts) for clean imports

### Pages
- Route-level components that compose smaller components
- Organized by user roles or feature areas
- Should be thin and focus on layout/composition

### Hooks
- Custom hooks for reusable stateful logic
- Prefix with "use" (e.g., useAuth, useStudentData)
- Keep hooks focused on single responsibilities

### Utils
- Pure functions for common operations
- Group by functionality (date, string, validation, etc.)
- Should be easily testable

### Types
- Centralized TypeScript type definitions
- Use interfaces for object shapes
- Use enums for constants with limited values

### Constants
- Application-wide constants
- API endpoints, configuration values
- Use UPPER_SNAKE_CASE for constants

## 🎯 Best Practices

1. **Barrel Exports**: Use index.ts files for clean imports
2. **Single Responsibility**: Each file should have one primary purpose
3. **Consistent Naming**: Use PascalCase for components, camelCase for functions/variables
4. **Type Safety**: Leverage TypeScript for better developer experience
5. **Tailwind + daisyUI**: Use Tailwind utilities and daisyUI component classes; see `src/index.css` for theme tokens

## 🔧 File Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Pages**: PascalCase (e.g., `StudentHome.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useAuthHooks.tsx`)
- **Utils**: camelCase (e.g., `dateUtils.ts`)
- **Types**: camelCase (e.g., `userTypes.ts`)
- **Constants**: camelCase (e.g., `apiConstants.ts`)

## 🚀 Development Workflow

1. Run `npm run lint` before committing
2. Use `npm run format` to maintain consistent code style
3. Run `npm run type-check` to verify TypeScript compilation
4. Follow the component creation pattern in `components/common/` for reference
