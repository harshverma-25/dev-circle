# Job Module Specification

Status: Draft
Version: 1.0

---

## Purpose

Allows recruiters to create, manage and publish job openings.

---

## Actors

Owner
Admin
Recruiter
Guest
Student

---

## Features

- Create Job
- Edit Job
- Publish Job
- Save Draft
- Close Job
- Archive Job
- Delete Job
- View Public Job
- Search Jobs

---

## Job Status

Draft
↓

Published
↓

Closed
↓

Archived

---

## Job Types

- Full Time
- Internship
- Part Time
- Contract

---

## Work Modes

- Remote
- Hybrid
- On-site

---

## Experience Levels

- Fresher
- 0–1 Years
- 1–3 Years
- 3–5 Years
- 5+ Years

---

## Job Fields

- title
- slug
- companyId
- recruiterId
- description
- responsibilities
- requirements
- skills[]
- location
- workMode
- jobType
- experienceLevel
- salary
- openings
- applicationDeadline
- status
- publishedAt
- createdAt
- updatedAt

---

## Business Rules

- Only company members can create jobs.
- Draft jobs are invisible.
- Published jobs are public.
- Closed jobs cannot receive applications.
- Archived jobs are read-only.
- Slug generated automatically.

---

## Dependencies

Authentication

Users

Companies

---

## Future

Featured Jobs

Boosted Jobs

Referral Jobs