# DevCircle – Engineering Standards

**Version:** 1.0 (Draft)
**Status:** Draft
**Owner:** Harsh Verma
**Last Updated:** July 2026

---

# 1. Purpose

This document defines the engineering standards and technical conventions used throughout the DevCircle project.

Its purpose is to ensure that every module follows the same architecture, coding style, API design, naming conventions, security practices, and development workflow.

All contributors and future implementations must follow this document.

---

# 2. Tech Stack

## Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* TanStack Query
* React Hook Form
* Zod

---

## Backend

* Node.js
* Express.js
* TypeScript

---

## Database

* MongoDB
* Mongoose

---

## Authentication

* JWT Access Token
* Refresh Token
* Google OAuth
* Email OTP Verification

---

## File Storage

* Cloudinary

---

## AI

* OpenRouter

---

## Email

* Resend

---

## Deployment

Frontend

* Vercel

Backend

* Railway or Render

Database

* MongoDB Atlas

---

# 3. Project Architecture

The backend follows a **Feature-Based Architecture**.

Each feature is isolated into its own module.

Example:

```text
src/
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── companies/
│   ├── jobs/
│   ├── applications/
│   ├── interviews/
│   └── notifications/
│
├── shared/
│   ├── config/
│   ├── middleware/
│   ├── utils/
│   ├── constants/
│   └── types/
```

Each module contains:

* Routes
* Controllers
* Services
* Repositories
* Models
* Validation
* Types

---

# 4. Naming Conventions

## Variables

Use **camelCase**.

Example:

```text
firstName

createdAt

refreshToken
```

---

## Functions

Use camelCase.

Functions should clearly describe their purpose.

Example:

```text
createUser()

updateCompany()

verifyOtp()
```

---

## Files

Use feature-based file names.

Example:

```text
auth.controller.ts

auth.service.ts

auth.repository.ts

auth.validation.ts

auth.routes.ts

auth.model.ts
```

---

## Collections

Collection names are plural.

Example:

```text
users

companies

jobs

applications

interviews

email_verifications
```

---

## Routes

Use plural resource names.

Example:

```text
POST /auth/register

GET /jobs

PATCH /companies/:companyId

DELETE /jobs/:jobId
```

Avoid verb-based routes such as:

```text
/createJob

/updateProfile
```

---

# 5. API Standards

All APIs must follow REST principles.

Rules:

* Use nouns instead of verbs.
* Keep URLs lowercase.
* Use plural resource names.
* Use path parameters for resources.
* Use query parameters for filtering and pagination.

Example:

```text
GET /jobs?page=1&limit=10

GET /jobs?location=Remote

GET /jobs?search=node
```

---

# 6. HTTP Status Codes

Use standard HTTP status codes.

| Status | Usage                 |
| ------ | --------------------- |
| 200    | Successful request    |
| 201    | Resource created      |
| 204    | No content            |
| 400    | Bad request           |
| 401    | Unauthorized          |
| 403    | Forbidden             |
| 404    | Resource not found    |
| 409    | Conflict              |
| 422    | Validation error      |
| 500    | Internal server error |

---

# 7. API Response Format

Every API should return a consistent response structure.

## Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

---

## Error Response

```json
{
  "success": false,
  "message": "Validation failed.",
  "error": {
    "code": "VALIDATION_ERROR"
  }
}
```

---

# 8. Error Handling

* Use a global error handling middleware.
* Avoid repetitive try-catch blocks where centralized handling is possible.
* Return meaningful error messages.
* Never expose internal implementation details.
* Log unexpected server errors.

---

# 9. Authentication Standards

Authentication uses:

* JWT Access Token
* Refresh Token

Supported authentication methods:

* Email + Password
* Google OAuth

Email verification uses:

* Six-digit OTP
* Hashed OTP
* 10-minute expiration

Passwords must be hashed using bcrypt.

---

# 10. Authorization Standards

Role-Based Access Control (RBAC) is used.

Roles:

* Student
* Recruiter

Every protected request follows:

1. Authenticate user
2. Verify role
3. Verify ownership (when required)
4. Execute business logic

---

# 11. Validation Standards

Request validation is performed using Zod.

Database validation is handled by Mongoose.

Frontend validation improves user experience but is never trusted.

Every request entering the backend must be validated.

---

# 12. Database Standards

* MongoDB ObjectId is used as the primary identifier.
* UTC is used for all timestamps.
* Mongoose timestamps are enabled for every collection.
* References use ObjectId.
* Only URLs are stored for uploaded files.
* Do not store binary files inside MongoDB.

---

# 13. File Upload Standards

Supported uploads:

* Avatar
* Company Logo
* Resume

Storage:

* Cloudinary

Only the Cloudinary URL and related metadata are stored in the database.

---

# 14. Logging Standards

Log:

* Server errors
* Authentication failures
* Important system events

Do not log:

* Passwords
* JWTs
* Refresh Tokens
* OTPs
* Sensitive user information

---

# 15. Security Standards

* Hash passwords with bcrypt.
* Validate all incoming requests.
* Protect private routes.
* Never expose secrets in responses.
* Store secrets in environment variables.
* Verify resource ownership before allowing updates or deletion.

---

# 16. Environment Variables

Sensitive values must be stored in environment variables.

Examples:

* MongoDB URI
* JWT Secret
* Refresh Token Secret
* Google OAuth Credentials
* Cloudinary Credentials
* Resend API Key
* OpenRouter API Key

Never hardcode secrets.

---

# 17. Git Standards

Use meaningful commit messages.

Examples:

```text
feat(auth): implement authentication module

feat(jobs): add job creation

fix(auth): resolve refresh token bug

docs: update authentication architecture
```

Keep commits focused on a single change.

---

# 18. Code Style

* Prefer small, reusable functions.
* Keep controllers thin.
* Place business logic in services.
* Use repositories for database access.
* Avoid duplicated code.
* Use descriptive names.
* Write self-explanatory code.

---

# 19. Documentation Standards

Documentation is written before implementation.

Every module document should include:

* Purpose
* Scope
* Actors
* Workflow
* Database Design
* APIs
* Business Rules
* Validation
* Security
* Edge Cases
* Future Enhancements

---

# 20. Development Workflow

Every feature follows the same lifecycle.

```text
Requirement
      ↓
Architecture
      ↓
Documentation
      ↓
Review
      ↓
Approval
      ↓
Implementation
      ↓
Testing
      ↓
Completion
```

No implementation should begin before the corresponding document is approved.

---

# 21. Review Checklist

Before approving a module, verify:

* Architecture follows project standards.
* Naming conventions are correct.
* APIs follow REST principles.
* Validation is defined.
* Security requirements are addressed.
* Business rules are complete.
* Edge cases are documented.
* Documentation is complete.

---

# 22. Document Status

**Status:** Draft

**Next Step:** 02_DATABASE_ARCHITECTURE.md

**Implementation:** Not Started
