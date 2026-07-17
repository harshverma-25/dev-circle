# 04_FRONTEND_ARCHITECTURE.md

# DevCircle - Frontend Architecture

**Version:** 1.0  
**Status:** Approved  
**Owner:** Harsh Verma

---

# 1. Purpose

This document defines the frontend architecture of DevCircle.

It describes how the frontend is structured, how data flows through the application, and the architectural principles followed when building user interfaces.

This document does not define backend implementation, database design, or coding standards.

---

# 2. Architecture Style

The frontend follows a feature-based architecture using the Next.js App Router.

Every feature follows the same flow.

```

User
↓
Page
↓
Feature Component
↓
Custom Hook
↓
Service
↓
API Client
↓
Backend API

```

Business logic should never exist inside UI components.

---

# 3. Technology Stack

Framework

- Next.js (App Router)

Language

- TypeScript

Styling

- Tailwind CSS

Component Library

- shadcn/ui

State Management

- TanStack Query
- React Context (Global UI State)

Forms

- React Hook Form
- Zod

Notifications

- Sonner

Icons

- Lucide React

---

# 4. Folder Structure

```

src/

app/
components/
hooks/
services/
providers/
lib/
types/
utils/
constants/

```

---

# 5. Component Architecture

Components are divided into three categories.

## UI Components

Reusable design components.

Examples

- Button
- Input
- Card
- Dialog
- Badge

These components contain no business logic.

---

## Common Components

Reusable application components.

Examples

- Navbar
- Sidebar
- Footer
- Loader
- Empty State
- Pagination

---

## Feature Components

Feature-specific UI.

Examples

```

JobCard
ResumeUploader
ApplicationTable
CompanyProfile

```

Business-specific components remain inside their feature.

---

# 6. Routing

The application uses Next.js App Router.

Example

```

/
login
register
dashboard
profile
jobs
jobs/[id]
companies
applications
interviews

```

Protected pages require authentication.

---

# 7. State Management

The application separates state into two categories.

## Server State

Managed using TanStack Query.

Examples

- Jobs
- Companies
- Applications
- User Profile

---

## Client State

Managed using React state or Context.

Examples

- Sidebar
- Theme
- Dialogs
- Form Step
- Mobile Menu

Do not store API data in Context.

---

# 8. Data Fetching

All backend communication follows the same flow.

```

Page
↓
Hook
↓
Service
↓
API Client
↓
Backend

```

Components never call APIs directly.

---

# 9. Forms

All forms follow the same architecture.

```

React Hook Form
↓
Zod Validation
↓
Service
↓
Backend

```

Every form includes:

- Validation
- Loading state
- Error handling
- Success feedback

---

# 10. Authentication Flow

Protected routes follow this process.

```

Open Page
↓
Check Authentication
↓
Load Current User
↓
Render Page

```

Unauthorized users are redirected to the login page.

Authentication rules are defined in the Authentication module.

---

# 11. Error Handling

The frontend should handle errors consistently.

Categories

- Validation Errors
- Authentication Errors
- Authorization Errors
- Network Errors
- Server Errors

Display user-friendly messages.

Never expose internal server errors.

---

# 12. Loading Strategy

Every asynchronous action should provide visual feedback.

Examples

- Skeletons
- Loading Buttons
- Progress Indicators
- Empty States

Avoid blank pages during data loading.

---

# 13. Performance

The frontend should prioritize performance.

Practices

- Route-based code splitting
- Lazy loading
- Query caching
- Image optimization
- Pagination
- Optimistic updates where appropriate

---

# 14. Accessibility

Every feature should support:

- Keyboard navigation
- Proper labels
- Semantic HTML
- Focus management
- Accessible forms

Accessibility is considered during development.

---

# 15. Future Scalability

The architecture should support future additions without major restructuring.

Examples

- Dark Mode
- Internationalization (i18n)
- Progressive Web App (PWA)
- Real-time Notifications
- Feature Flags

---

# 16. References

Related Documents

- 00_PROJECT_CONTEXT.md
- 01_ENGINEERING_STANDARDS.md
- 02_DATABASE_ARCHITECTURE.md
- 03_BACKEND_ARCHITECTURE.md

Module-specific frontend behavior is documented in each module's `SPEC.md`.

---

# Document Status

**Status:** Approved

**Foundation Phase:** Complete ✅

**Next Phase:** Module Design