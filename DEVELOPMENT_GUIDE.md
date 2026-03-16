# 📚 Archimedes Frontend

A modern React TypeScript application for educational management, built with **Tailwind CSS v4** and **daisyUI v5** for styling, and following best practices for scalable frontend development.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build:production
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components (ErrorBoundary, Loading, Alert)
│   └── student/        # Student-specific components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page-level components
│   ├── auth/          # Authentication pages
│   ├── student/       # Student dashboard pages
│   └── teacher/       # Teacher dashboard pages
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # Application constants
├── libs/              # API and external library integrations
└── styles/            # Global styles and CSS modules
```

## 🔧 Development Tools

### Code Quality
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting
- **TypeScript**: Type safety and better developer experience

### Available Scripts
```bash
npm start              # Development server
npm run build         # Production build
npm run test          # Run tests
npm run test:coverage # Test coverage report
npm run lint          # Check code quality
npm run lint:fix      # Fix linting issues
npm run format        # Format code with Prettier
npm run type-check    # TypeScript type checking
```

## 🎨 UI Guidelines

### Tailwind CSS + daisyUI
- **Tailwind v4** for utilities and design tokens (`@theme` in `src/index.css`)
- **daisyUI v5** for components (btn, card, navbar, form-control, menu, etc.)
- Role-based themes: `archimedes` (students/guests) and `archimedes-teacher` (teachers), synced via `data-theme` on `<html>`
- Use semantic theme classes (`btn-primary`, `bg-base-100`, `text-base-content`) so UI follows the active theme
- Custom tokens: water/sand/teal palette, `rounded-bubble`, `shadow-bubble`, `animate-float` (see `src/index.css`)

### Component Structure
- **Functional components** with React hooks
- **TypeScript interfaces** for all props
- **Error boundaries** for graceful error handling
- **Loading states** for better UX

## 🔐 Authentication & Routing

### Role-Based Access Control
- **Students**: Access to exercises and progress tracking
- **Teachers**: Classroom management and analytics
- **Admins**: System administration features

### Route Protection
- Authenticated routes with role validation
- Automatic redirects based on user status
- Clean URL structure with meaningful paths

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first approach**
- **Tailwind breakpoints** (sm, md, lg, xl, 2xl)
- **Flexible grid layouts**
- **Touch-friendly interactions**

## 🧪 Testing Strategy

### Test Structure
- **Unit tests** for utilities and components
- **Integration tests** for user workflows
- **Accessibility tests** for inclusive design

### Best Practices
- Test user interactions, not implementation details
- Mock external dependencies
- Maintain high test coverage for critical paths

## 🔄 State Management

### Context API Usage
- **AuthContext**: User authentication state
- **StudentContext**: Student-specific data
- Separation of concerns with dedicated providers

### Data Flow
- Props for component communication
- Context for global state
- Custom hooks for reusable logic

## 🌐 API Integration

### Environment Configuration
- Development and production environment files
- Configurable API endpoints
- Secure token management

### Error Handling
- Graceful degradation on API failures
- User-friendly error messages
- Retry mechanisms for failed requests

## 🎯 Performance Optimization

### Bundle Optimization
- **Code splitting** with React.lazy()
- **Tree shaking** for unused code elimination
- **Asset optimization** for faster loading

### Runtime Performance
- **Memoization** with React.memo and useMemo
- **Efficient re-renders** with proper dependency arrays
- **Virtual scrolling** for large lists

## 🔒 Security Considerations

- **JWT token handling** with secure storage
- **Input validation** and sanitization
- **XSS protection** with proper escaping
- **HTTPS enforcement** in production

## 📚 Contributing

### Code Style
- Follow the established TypeScript and React patterns
- Use semantic commit messages
- Write comprehensive component documentation
- Maintain test coverage above 80%

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with tests
3. Run quality checks (`lint`, `format`, `type-check`)
4. Submit pull request with clear description

## 🚀 Deployment

### Production Build
```bash
npm run build:production
```

### Environment Variables
- `REACT_APP_BACKEND_API_ENDPOINT`: API server URL
- `REACT_APP_ENVIRONMENT`: Environment identifier

### Docker Support
The project includes Docker configuration for containerized deployment.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
