# DevCircle – Project Context

**Version:** 1.0 (Draft)
**Status:** Draft
**Owner:** Harsh Verma
**Last Updated:** July 2026

---

# 1. Purpose

This document defines the overall vision, goals, scope, and product direction of DevCircle.

It serves as the primary source of truth for the project. Every architectural decision, API, database schema, and implementation must align with this document.

---

# 2. Project Overview

## What is DevCircle?

DevCircle is an AI-powered developer hiring platform that connects students with recruiters through a structured hiring workflow.

The platform allows students to create professional profiles, apply for jobs, and participate in technical interviews. Recruiters can create companies, post jobs, review applications, evaluate candidates with AI assistance, and manage the hiring process.

DevCircle aims to provide a modern, transparent, and efficient hiring experience for both students and recruiters.

---

# 3. Problem Statement

Traditional campus hiring platforms often suffer from:

* Poor user experience
* Limited applicant management
* No AI-assisted screening
* Manual interview preparation
* Lack of structured hiring workflows
* Limited visibility into application progress

DevCircle addresses these problems by combining a clean hiring workflow with AI-powered tools that improve efficiency for recruiters and provide better guidance for students.

---

# 4. Target Users

## Student

Students use DevCircle to:

* Create a professional profile
* Upload a resume
* Showcase skills and projects
* Search for jobs
* Apply for positions
* Track application status
* Attend interviews

---

## Recruiter

Recruiters use DevCircle to:

* Create and manage a company
* Publish job openings
* Review applications
* Shortlist candidates
* Schedule interviews
* Submit interview feedback
* Use AI to evaluate resumes and generate interview questions

---

## Admin (Future Version)

The Admin role will be introduced in a future release to manage platform moderation, users, companies, and system-wide operations.

---

# 5. Project Goals

The primary goals of DevCircle are:

* Provide a modern hiring platform
* Simplify campus recruitment
* Improve recruiter productivity
* Help students present their skills effectively
* Use AI to assist—not replace—human decision-making
* Build a scalable and maintainable backend architecture

---

# 6. Core Features (Version 1)

## Authentication

* Email registration
* Email OTP verification
* Google OAuth
* JWT authentication
* Refresh tokens
* Role-based access (Student and Recruiter)

---

## Student Features

* Complete profile
* Upload avatar
* Upload resume
* Manage skills
* Apply for jobs
* Track application status

---

## Recruiter Features

* Create company
* Manage company profile
* Post jobs
* Edit jobs
* View applicants
* Schedule interviews
* Submit interview feedback

---

## Job Management

* Create jobs
* Update jobs
* Close jobs
* Search jobs
* Filter jobs

---

## Applications

* Apply for jobs
* Track application status
* Recruiter application management

---

## Interviews

* Schedule interviews
* Conduct interviews
* Store interview feedback

---

## AI Features

* Resume analysis
* Skill matching
* Resume summary generation
* Missing skill detection
* AI-generated interview questions

---

# 7. Features Excluded from Version 1

The following features are intentionally excluded from the first release:

* Password reset
* Two-factor authentication (2FA)
* Team collaboration inside companies
* Multiple recruiter roles per company
* Company approval workflow
* Real-time chat
* Video conferencing inside the platform
* Payment system
* Premium subscriptions
* Recommendation engine
* Analytics dashboard
* Mobile application

These may be considered in future versions.

---

# 8. User Roles

## Student

Can:

* Manage own profile
* Apply for jobs
* Upload resume
* Attend interviews

Cannot:

* Create companies
* Post jobs
* View other students' private information

---

## Recruiter

Can:

* Manage own profile
* Create one company
* Manage company information
* Post jobs
* Review applications
* Schedule interviews

Cannot:

* Access other companies
* Modify other recruiters' data

---

# 9. Success Criteria

Version 1 will be considered successful if users can complete the entire hiring workflow:

Student Registration

↓

Profile Completion

↓

Resume Upload

↓

Job Application

↓

Recruiter Reviews Application

↓

Interview Scheduled

↓

Interview Completed

↓

Feedback Submitted

---

# 10. Non-Functional Goals

The platform should be:

* Secure
* Maintainable
* Modular
* Scalable
* Production-ready
* Easy to extend
* Well documented

---

# 11. Guiding Principles

The project will follow these principles:

* Documentation before implementation
* Feature-based architecture
* Clean and readable code
* Consistent API design
* Strong validation
* Security by default
* Modular development
* Clear separation of responsibilities

---

# 12. Future Vision

Future versions of DevCircle may include:

* AI interview assistant
* Coding assessments
* Recruiter analytics
* Team collaboration
* Notifications
* Resume scoring dashboard
* Admin portal
* Student recommendations
* Company verification
* Mobile application
* Multi-round interview workflows

---

# 13. References

Related documents:

* 01_ENGINEERING_STANDARDS.md
* 02_DATABASE_ARCHITECTURE.md
* 03_BACKEND_ARCHITECTURE.md
* Module Specifications
* API Contracts

---

# 14. Document Status

**Status:** Draft

**Next Step:** Engineering Standards (01_ENGINEERING_STANDARDS.md)

**Implementation:** Not Started
