# 03_BACKEND_ARCHITECTURE.md

# DevCircle - Backend Architecture

**Version:** 1.0  
**Status:** Approved  
**Owner:** Harsh Verma

---

# 1. Purpose

This document defines the backend architecture of DevCircle.

It describes how requests flow through the application, the responsibility of each layer, and the architectural rules followed throughout the backend.

This document does not define database schemas or engineering conventions. Refer to the corresponding documents for those topics.

---

# 2. Architecture Style

The backend follows a Feature-Based Modular Architecture with the Repository Pattern.

Every feature is self-contained and follows the same structure.

```
Route
    ↓
Middleware
    ↓
Validation
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Model
    ↓
MongoDB
```

---

# 3. Folder Structure

```
src/

modules/
shared/

app.ts
server.ts
```

Each module follows:

```
authentication/

controllers/
routes/
services/
repositories/
models/
validators/
types/
```

Shared resources are placed inside:

```
shared/

config/
middleware/
errors/
responses/
utils/
logger/
constants/
```

---

# 4. Request Lifecycle

Every request follows the same lifecycle.

```
Client
    │
    ▼
Express Route
    │
    ▼
Middleware
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
Repository
    │
    ▼
Service
    │
    ▼
Controller
    │
    ▼
Response
```

---

# 5. Layer Responsibilities

## Route

Responsibilities:

- Register endpoints
- Apply middleware
- Forward requests

Must NOT:

- Contain business logic
- Access database

---

## Middleware

Responsibilities:

- Authentication
- Authorization
- Request logging
- Security
- Request preprocessing

Must NOT:

- Execute business logic

---

## Validation

Responsibilities:

- Validate request body
- Validate params
- Validate query

Invalid requests stop here.

---

## Controller

Responsibilities:

- Receive validated request
- Call service
- Return HTTP response

Must NOT:

- Access database
- Implement business logic

---

## Service

Responsibilities:

- Business logic
- Workflow orchestration
- Authorization decisions
- Call repositories

Must NOT:

- Handle HTTP requests
- Perform database queries directly

---

## Repository

Responsibilities:

- Read/write database
- Convert database operations into reusable methods

Must NOT:

- Implement business logic

---

## Model

Responsibilities:

- Define schema
- Define indexes
- Define relationships

Must NOT:

- Implement business logic

---

# 6. Dependency Rules

Allowed:

```
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

Not Allowed:

- Controller → Model
- Controller → Database
- Service → Express Response
- Repository → HTTP
- Route → Repository

Dependencies should always flow downward.

---

# 7. Module Structure

Each feature is isolated.

Example:

```
jobs/

controllers/
repositories/
routes/
services/
validators/
models/
types/
```

Features communicate through services rather than directly accessing each other's repositories.

---

# 8. Security Flow

Protected requests follow this sequence.

```
Request
    ↓
Authenticate User
    ↓
Verify JWT
    ↓
Load User
    ↓
Check Role / Ownership
    ↓
Execute Service
```

Business permissions are enforced in the Service layer.

---

# 9. Error Flow

```
Repository
      ↓
Service
      ↓
Controller
      ↓
Global Error Handler
      ↓
Client
```

All errors are propagated upward.

Controllers should not contain repetitive try-catch blocks unless additional handling is required.

---

# 10. Scalability Principles

The architecture is designed to support future additions such as:

- Redis
- Background jobs
- Event-driven processing
- WebSockets
- Multiple AI providers
- Message queues

These features should integrate without restructuring existing modules.

---

# 11. References

Related documents:

- 00_PROJECT_CONTEXT.md
- 01_ENGINEERING_STANDARDS.md
- 02_DATABASE_ARCHITECTURE.md
- 04_FRONTEND_ARCHITECTURE.md

Module-specific implementation details are defined in each module's `SPEC.md`.

---

# Document Status

**Status:** Approved

**Next Document:** 04_FRONTEND_ARCHITECTURE.md