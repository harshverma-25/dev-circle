Base

/api/v1/jobs

---

POST /

Create Job

PUT /:jobId

Update Job

DELETE /:jobId

Delete Job

GET /:slug

Public Job

GET /

Search Jobs

PATCH /:jobId/publish

Publish Job

PATCH /:jobId/close

Close Job

PATCH /:jobId/archive

Archive Job

GET /company/:companyId

Company Jobs

GET /me

Recruiter's Jobs

---

Search Filters

search

skills

location

jobType

workMode

experienceLevel

salaryMin

salaryMax

page

limit

sort

---

Permissions

Recruiter
Create

Recruiter
Edit own company jobs

Guest
View

Student
View

---

Error Codes

JOB_NOT_FOUND

JOB_CLOSED

JOB_ARCHIVED

FORBIDDEN

INVALID_JOB