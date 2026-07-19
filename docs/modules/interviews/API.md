Base

/api/v1/interviews

---

POST /

Schedule Interview

GET /:id

Interview Details

PATCH /:id

Reschedule Interview

PATCH /:id/cancel

Cancel Interview

PATCH /:id/complete

Complete Interview

GET /candidate/me

Candidate Interviews

GET /recruiter/me

Recruiter Interviews

---

Permissions

Recruiter

Schedule

Edit

Cancel

Complete

Candidate

View

Join

---

Errors

INTERVIEW_EXISTS

INVALID_TIME

INTERVIEW_COMPLETED

INTERVIEW_CANCELLED

APPLICATION_NOT_FOUND