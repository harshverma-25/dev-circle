# Interview Module Specification

Status: Draft
Version: 1.0

---

## Purpose

Manage interviews between recruiters and candidates.

Supports one interview per application in V1.

---

## Actors

Recruiter

Candidate

---

## Features

- Schedule Interview
- Reschedule Interview
- Cancel Interview
- Complete Interview
- Join Meeting
- View Interview Details

---

## Interview Status

Scheduled
↓

Completed

OR

Cancelled

---

## Interview Fields

applicationId

jobId

companyId

candidateId

recruiterId

meetingType

meetingLink

date

startTime

endTime

timezone

status

notes

createdAt

updatedAt

---

## Meeting Types

Google Meet

Zoom

Microsoft Teams

Other

---

## Business Rules

- One interview per application.
- Interview only after "Under Review".
- Cannot reschedule completed interview.
- Candidate & recruiter receive email.
- Recruiter can cancel.
- Candidate cannot cancel (V1).

---

## Dependencies

Authentication

Application

Job

Email

---

## Future

Interview Feedback

AI Video Interview

Interview Recording

Calendar Sync