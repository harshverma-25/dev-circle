# Notification Module

Status: Draft

Version: 1.0

---

## Purpose

Send important email notifications across the platform.

---

## Notification Types

Authentication

- Email Verification

- Welcome Email

Jobs

- New Application

- Job Closed

Applications

- Application Submitted

- Status Updated

Interviews

- Interview Scheduled

- Interview Cancelled

- Interview Completed

Companies

- Recruiter Invited

AI

- Analysis Completed (Future)

---

## Channels

Email

---

## Business Rules

- Queue emails.

- Retry failed emails.

- Never block API request.

- Email templates stored separately.

---

## Dependencies

Email Provider

BullMQ

Redis

---

## Future

SMS

Push

In-App Notification