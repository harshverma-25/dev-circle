# Company Module Specification (SPEC)

**Module:** Companies

**Version:** 1.0

**Status:** Draft

---

# 1. Purpose

The Company module manages organizations that recruit developers on DevCircle.

It allows recruiters to create, manage, and publish company profiles, invite team members, and own job postings.

This module does not manage authentication or job applications.

---

# 2. Goals

The Company module should allow recruiters to:

- Create a company
- Update company profile
- Upload company logo
- Upload company banner
- Invite recruiters
- Manage recruiter roles
- View company profile
- Delete company (future)

---

# 3. Actors

## Owner

Can

- Create company
- Edit company
- Delete company
- Invite recruiters
- Remove recruiters
- Transfer ownership
- Publish jobs

---

## Admin

Can

- Edit company
- Invite recruiters
- Publish jobs
- Manage recruiters

Cannot

- Delete company
- Transfer ownership

---

## Recruiter

Can

- View company dashboard
- Create jobs
- Edit own jobs

Cannot

- Invite members
- Delete company

---

## Guest

Can

- View public company page

---

# 4. Company Information

Basic Information

- Company Name
- Slug
- Industry
- Company Size
- Founded Year
- Website
- Description

Media

- Logo
- Banner

Location

- Country
- State
- City

Social Links

- LinkedIn
- Twitter/X
- GitHub
- Website

Metadata

- Verification Status
- Owner
- Recruiters
- Created At
- Updated At

---

# 5. Business Rules

General

- Company name must be unique.
- Slug must be unique.
- One owner per company.
- Owner cannot be removed without transferring ownership.
- Logo and banner are optional.

Recruiters

- A recruiter may belong to multiple companies.
- Every recruiter has one role per company.

---

# 6. Recruiter Roles

Available Roles

- Owner
- Admin
- Recruiter

Permissions are enforced by middleware.

---

# 7. Company Verification

V1

- Manual verification only.

Status

- Pending
- Verified
- Rejected

---

# 8. Company Media

Logo

- JPG
- PNG
- WEBP

Banner

- JPG
- PNG
- WEBP

Stored in Cloudinary.

---

# 9. Public Company Page

Public Information

- Name
- Logo
- Banner
- Industry
- Company Size
- Website
- Description
- Open Jobs
- Recruiters (optional)
- Verification Badge

---

# 10. Dependencies

- Authentication Module
- User Module
- Cloudinary

---

# 11. Future Features

Not included

- Company Reviews
- Employee Ratings
- Office Photos
- Hiring Analytics
- Multiple Offices
- Company Followers

---

# References

- Authentication Module
- User Module
- Database Architecture