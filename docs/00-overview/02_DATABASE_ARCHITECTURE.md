# DevCircle – Database Architecture

**Version:** 1.0 (Draft)
**Status:** Draft
**Owner:** Harsh Verma
**Last Updated:** July 2026

---

# 1. Purpose

This document defines the database architecture for DevCircle.

It specifies the collections, relationships, data ownership, indexing strategy, and design principles that will be followed throughout the project.

This document is the single source of truth for all database-related decisions.

---

# 2. Database Technology

Database: **MongoDB**

ODM: **Mongoose**

Reason for choosing MongoDB:

* Flexible schema
* Excellent support for document-based applications
* Easy horizontal scaling
* Strong TypeScript ecosystem
* Well suited for rapidly evolving products

---

# 3. Design Principles

The database follows these principles:

* Normalize first, denormalize only when necessary.
* Store relationships using ObjectId references.
* Avoid duplicate data.
* Keep documents focused on a single responsibility.
* Enable timestamps for every collection.
* Store files outside MongoDB.
* Design for future scalability.

---

# 4. Collections

The system contains the following collections:

| Collection          | Purpose                           |
| ------------------- | --------------------------------- |
| users               | Student and recruiter accounts    |
| companies           | Recruiter-managed companies       |
| jobs                | Job postings                      |
| applications        | Student job applications          |
| interviews          | Interview scheduling and outcomes |
| resumes             | Resume metadata                   |
| notifications       | User notifications                |
| email_verifications | Email OTP verification            |
| refresh_tokens      | Refresh token storage             |

---

# 5. Entity Relationship Diagram

```text
User
├── owns ─────────────► Company
├── uploads ──────────► Resume
├── receives ─────────► Notification
├── has ──────────────► RefreshToken
└── verifies ─────────► EmailVerification

Company
└── posts ────────────► Job

Job
└── receives ─────────► Application

Application
└── may create ───────► Interview
```

---

# 6. Collection Relationships

## User → Company

Relationship:

One-to-Many

One recruiter may own multiple companies.

Each company belongs to one recruiter.

---

## Company → Job

Relationship:

One-to-Many

Each company may publish multiple jobs.

Each job belongs to exactly one company.

---

## User → Resume

Relationship:

One-to-One

Each student has one active resume.

Future versions may support resume versioning.

---

## User → Application

Relationship:

One-to-Many

Students may apply to many jobs.

Each application belongs to one student.

---

## Job → Application

Relationship:

One-to-Many

A job can receive many applications.

Each application belongs to one job.

---

## Application → Interview

Relationship:

One-to-One (Optional)

An interview exists only after an application is shortlisted.

---

## User → Notification

Relationship:

One-to-Many

Each notification belongs to one user.

---

## User → Refresh Token

Relationship:

One-to-Many

Supports multiple logged-in devices.

---

## User → Email Verification

Relationship:

One-to-Many

Stores OTP verification history.

Expired records may be periodically removed.

---

# 7. Data Ownership

Each collection owns its own data.

Example:

* Jobs own job information.
* Companies own company information.
* Applications own application status.
* Interviews own interview details.

Collections should not duplicate business data owned by another collection.

---

# 8. Reference Strategy

Relationships use MongoDB ObjectId references.

Example:

Application

* userId
* jobId

Job

* companyId

Company

* ownerId

Interview

* applicationId

---

# 9. File Storage Strategy

Binary files are **never** stored in MongoDB.

Files are uploaded to Cloudinary.

MongoDB stores:

* File URL
* Public ID
* Metadata (if required)

---

# 10. Indexing Strategy

Indexes will be added for frequently queried fields.

Initial indexes include:

Users

* email (unique)

Companies

* ownerId

Jobs

* companyId
* location
* employmentType
* status

Applications

* userId
* jobId
* status

Interviews

* applicationId
* scheduledAt

Notifications

* userId
* isRead

Refresh Tokens

* userId
* expiresAt

Email Verification

* email
* expiresAt

Indexes may evolve based on application usage.

---

# 11. Cascade Rules

MongoDB does not provide automatic cascade deletes.

The application layer is responsible for maintaining consistency.

Examples:

Deleting a company:

* Archive or remove related jobs according to business rules.

Deleting a job:

* Handle related applications safely.

Deleting a user:

* Preserve historical data where appropriate instead of hard deletion.

Cascade behavior will be defined within each module specification.

---

# 12. Soft Delete Strategy

Business entities should prefer soft deletion.

Recommended fields:

* isDeleted
* deletedAt

Authentication and temporary collections may use hard deletion when appropriate.

---

# 13. Timestamp Strategy

Every collection uses Mongoose timestamps.

Fields:

* createdAt
* updatedAt

All timestamps use UTC.

---

# 14. Future Expansion

The architecture supports adding new collections without redesigning existing relationships.

Possible future collections include:

* bookmarks
* skills
* experiences
* education
* analytics
* activity_logs
* recruiter_teams
* permissions

---

# 15. Review Checklist

Before implementation:

* Collections identified
* Relationships verified
* References defined
* Ownership established
* Indexing planned
* File strategy documented
* Cascade rules considered
* Future scalability reviewed

---

# 16. Document Status

**Status:** Draft

**Next Step:** 03_BACKEND_ARCHITECTURE.md

**Implementation:** Not Started
