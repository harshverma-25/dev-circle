# DevCircle – Backend Architecture

**Version:** 1.0 (Draft)
**Status:** Draft
**Owner:** Harsh Verma
**Last Updated:** July 2026

---

# 1. Purpose

This document defines the backend architecture for DevCircle.

It establishes the application's structural design, request lifecycle, layer responsibilities, dependency rules, error handling strategy, logging standards, and development principles.

Every backend module must follow this architecture.

---

# 2. Engineering Principles

The backend follows these engineering principles:

1. Simplicity over cleverness.
2. Readability over short code.
3. Consistency over personal preference.
4. Security by default.
5. Fail fast with meaningful errors.
6. Every layer has one responsibility.
7. Business logic should remain independent of framework-specific details.
8. Documentation is part of the product.
9. Optimize only after measuring.
10. Every major architectural decision must have a documented reason.

---

# 3. Technology Stack

Backend Runtime

* Node.js

Framework

* Express.js

Language

* TypeScript

Database

* MongoDB

ODM

* Mongoose

Authentication

* JWT
* Google OAuth

Validation

* Zod

Cloud Storage

* Cloudinary

Email

* Resend

Logging

* Winston (or equivalent structured logger)

---

# 4. Backend Architecture Overview

The backend follows a Feature-Based Architecture combined with layered responsibilities.

```text
Client
   │
   ▼
Routes
   │
   ▼
Middleware
(Authentication / Authorization / Request ID / Logging)
   │
   ▼
Validation
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Model (Mongoose)
   │
   ▼
MongoDB
```

Each layer performs one well-defined responsibility.

---

# 5. Project Structure

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
│   ├── notifications/
│   └── ai/
│
├── shared/
│   ├── config/
│   ├── middleware/
│   ├── errors/
│   ├── logger/
│   ├── responses/
│   ├── constants/
│   ├── types/
│   ├── utils/
│   └── validation/
│
├── app.ts
└── server.ts
```

---

# 6. Layer Responsibilities

## Route

Responsible for:

* Defining API endpoints
* Applying middleware
* Forwarding requests to controllers

Routes must never contain business logic.

---

## Middleware

Responsible for:

* Authentication
* Authorization
* Request ID generation
* Logging
* Rate limiting
* Security headers
* Request preprocessing

---

## Validation

Responsible for validating incoming request data using Zod.

Validation occurs before controllers are executed.

Invalid requests never reach the business layer.

---

## Controller

Responsible for:

* Receiving HTTP requests
* Calling services
* Returning successful responses

Controllers should remain thin.

Controllers must not contain business logic.

---

## Service

Responsible for:

* Business rules
* Workflow orchestration
* Permission checks
* Cross-module coordination

Services never interact directly with Express request or response objects.

---

## Repository

Responsible for:

* Database queries
* CRUD operations
* Data persistence

Repositories must never contain business logic.

---

## Model

Responsible for:

* Schema definitions
* Database constraints
* Indexes
* Timestamps

---

# 7. Dependency Rules

Allowed dependency flow:

```text
Route
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Model
```

The reverse direction is prohibited.

Examples of prohibited dependencies:

* Controller → Database
* Controller → Model
* Route → Repository
* Repository → Controller
* Model → Service

This keeps dependencies predictable and maintainable.

---

# 8. Request Lifecycle

Every request follows the same processing pipeline.

```text
Incoming Request
        │
        ▼
Request ID Middleware
        │
        ▼
Logger Middleware
        │
        ▼
Authentication
        │
        ▼
Authorization
        │
        ▼
Validation
        │
        ▼
Controller
        │
        ▼
Service
        │
        ▼
Repository
        │
        ▼
MongoDB
        │
        ▼
Controller
        │
        ▼
Response Builder
        │
        ▼
Client
```

All endpoints must follow this lifecycle.

---

# 9. Error Handling Architecture

DevCircle uses centralized error handling.

Errors are never returned directly from controllers or services.

Instead:

```text
Repository
      │
      ▼
Service
      │
      ▼
Controller
      │
      ▼
Global Error Handler
      │
      ▼
Standardized API Response
```

Only the Global Error Handler sends error responses to the client.

---

## Error Categories

### Operational Errors

Expected situations:

* Validation failure
* Duplicate email
* Invalid credentials
* Resource not found
* Unauthorized access

Operational errors return meaningful client responses.

---

### Programmer Errors

Unexpected situations:

* Null reference
* Logic bugs
* Unhandled exceptions
* Invalid assumptions

These errors are logged and return a generic client response.

---

## Custom Error Types

The application defines custom errors such as:

* ValidationError
* AuthenticationError
* AuthorizationError
* NotFoundError
* ConflictError
* DatabaseError
* InternalServerError

Each custom error includes:

* HTTP status code
* Internal error code
* Client-safe message
* Operational flag

---

# 10. API Response Strategy

Every successful response follows the same structure.

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

Every error response follows the same structure.

```json
{
  "success": false,
  "message": "Validation failed.",
  "error": {
    "code": "VALIDATION_ERROR"
  }
}
```

Consistency across every endpoint is mandatory.

---

# 11. Logging Architecture

Logging is centralized.

Every request receives a unique Request ID.

Log Levels:

* INFO
* WARN
* ERROR
* FATAL
* DEBUG (development only)

Sensitive information must never be logged.

Examples:

* Passwords
* JWT tokens
* Refresh tokens
* OTPs
* API keys

Logs should include:

* Timestamp
* Request ID
* User ID (if authenticated)
* Endpoint
* HTTP method
* Error details (when applicable)

---

# 12. Security Flow

Protected endpoints follow this sequence:

```text
Authenticate User
        │
        ▼
Verify JWT
        │
        ▼
Load User
        │
        ▼
Check Role
        │
        ▼
Check Resource Ownership
        │
        ▼
Execute Business Logic
```

No business logic executes before authentication and authorization complete successfully.

---

# 13. Module Communication

Modules should remain independent.

When one module needs another module's functionality:

* Prefer calling the other module's service.
* Avoid direct repository access across modules.
* Avoid sharing database models between unrelated modules.

Loose coupling improves maintainability.

---

# 14. Shared Components

The `shared` directory contains reusable infrastructure.

Examples:

* Error classes
* Logger
* Response helpers
* Configuration
* Constants
* Utility functions
* Middleware
* Validation helpers

Business-specific code must never be placed in `shared`.

---

# 15. Configuration Management

Application configuration is centralized.

Configuration includes:

* Environment variables
* Database connection
* JWT configuration
* Cloudinary
* Email provider
* AI provider

Configuration must never be duplicated across modules.

---

# 16. Development Principles

Backend development follows these rules:

* Keep controllers thin.
* Keep services focused.
* Keep repositories database-only.
* Prefer composition over duplication.
* Write reusable utilities.
* Avoid circular dependencies.
* Follow established naming conventions.
* Write self-documenting code whenever possible.

---

# 17. Future Scalability

The architecture should support future additions without major restructuring.

Examples:

* Redis caching
* Background jobs
* Event-driven messaging
* WebSockets
* Microservices
* Multiple AI providers
* Audit logging
* Multi-tenant organizations

The architecture should evolve through extension, not redesign.

---

# 18. Review Checklist

Before approving backend implementation:

* Layer responsibilities defined
* Request lifecycle documented
* Dependency rules verified
* Error handling standardized
* Logging strategy finalized
* Security flow reviewed
* Shared infrastructure identified
* Scalability considered

---

# 19. Document Status

**Status:** Draft

**Next Step:** 04_FRONTEND_ARCHITECTURE.md

**Implementation:** Not Started
