# 01_ENGINEERING_STANDARDS.md

# DevCircle - Engineering Standards

**Version:** 1.0  
**Status:** Approved  
**Owner:** Harsh Verma

---

# 1. Purpose

This document defines the engineering standards for DevCircle.

Every contributor must follow these standards to ensure consistency, maintainability, and scalability across the project.

---

# 2. Engineering Principles

The project follows these principles:

- Keep code simple and readable.
- Follow Single Responsibility Principle (SRP).
- Prefer composition over duplication.
- Separate business logic from infrastructure.
- Keep controllers thin.
- Build reusable components and utilities.
- Fail fast and handle errors consistently.
- Write self-explanatory code.
- Maintain consistent project structure.

---

# 3. Project Structure

## Backend

```
src/

modules/
shared/

app.ts
server.ts
```

Each module follows:

```
module/

routes/
controllers/
services/
repositories/
models/
validators/
types/
```

## Frontend

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
```

---

# 4. Naming Conventions

## Files

```
user.controller.ts
user.service.ts
user.repository.ts
user.model.ts
auth.middleware.ts
```

Use:

- kebab-case for file names
- PascalCase for React components
- camelCase for variables and functions
- UPPER_SNAKE_CASE for constants

---

# 5. Backend Layer Responsibilities

Every layer has a single responsibility.

## Route

- Define endpoints.
- Apply middleware.
- Forward requests to controllers.

Must NOT contain business logic.

---

## Controller

Responsible for:

- Reading request data.
- Calling services.
- Returning HTTP responses.

Controllers must not access the database directly.

---

## Service

Responsible for:

- Business logic.
- Feature workflows.
- Authorization decisions.
- Calling repositories.

Services should not know HTTP details.

---

## Repository

Responsible for:

- Database operations only.

Repositories must not contain business logic.

---

## Model

Responsible only for schema definitions.

No business logic.

---

# 6. API Response Format

Every API returns a consistent structure.

## Success

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

## Error

```json
{
  "success": false,
  "message": "Operation failed.",
  "error": {
    "code": "ERROR_CODE"
  }
}
```

---

# 7. Error Handling

All errors must pass through the global error handler.

Do not send raw errors directly from controllers.

Use custom error classes such as:

- ValidationError
- AuthenticationError
- AuthorizationError
- NotFoundError
- ConflictError
- InternalServerError

Unexpected errors should return a generic message while detailed information is logged internally.

---

# 8. Validation

All incoming data must be validated before reaching business logic.

Validation rules:

- Validate request body.
- Validate query parameters.
- Validate route parameters.
- Reject invalid input immediately.

Use Zod for validation.

---

# 9. Authentication & Authorization

Authentication verifies user identity.

Authorization determines whether the user has permission to perform an action.

Protected routes must:

1. Verify access token.
2. Load authenticated user.
3. Check required role or ownership.
4. Execute business logic.

---

# 10. Logging

Log important application events, including:

- Server startup
- Authentication events
- Database failures
- External API failures
- Unexpected exceptions

Never log:

- Passwords
- JWT tokens
- Refresh tokens
- API keys
- Sensitive personal data

---

# 11. Environment Variables

Sensitive configuration must be stored in environment variables.

Examples:

```
PORT
MONGODB_URI
JWT_SECRET
JWT_REFRESH_SECRET
OPENROUTER_API_KEY
CLOUDINARY_URL
```

Never hardcode secrets.

---

# 12. Git Standards

Commit messages should be meaningful.

Examples:

```
feat(auth): implement user registration

fix(job): validate salary range

refactor(user): move business logic to service

docs(api): update authentication endpoints
```

---

# 13. Documentation Standards

Every new feature must include:

- SPEC.md
- API.md

If implementation changes architecture or behavior, update the documentation before merging changes.

---

# 14. References

This document defines engineering practices only.

Related documents:

- 00_PROJECT_CONTEXT.md
- 02_DATABASE_ARCHITECTURE.md
- 03_BACKEND_ARCHITECTURE.md
- 04_FRONTEND_ARCHITECTURE.md

---

# Document Status

**Status:** Approved

**Next Document:** 02_DATABASE_ARCHITECTURE.md