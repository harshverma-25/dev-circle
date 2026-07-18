# User API

**Module:** Users  
**Version:** 1.0  
**Status:** Draft

---

# Overview

Base Path

```
/api/v1/users
```

Authentication

- All endpoints require JWT Access Token unless specified otherwise.
- Public profile endpoint does not require authentication.

---

# API Summary

| Method | Endpoint | Authentication | Description |
|---------|----------|----------------|-------------|
| GET | /me | Yes | Get authenticated user's profile |
| PATCH | /me | Yes | Update basic profile |
| PATCH | /me/skills | Yes | Update skills |
| PATCH | /me/education | Yes | Update education |
| PATCH | /me/experience | Yes | Update experience |
| PATCH | /me/social-links | Yes | Update social links |
| POST | /me/resume | Yes | Upload or replace resume |
| DELETE | /me/resume | Yes | Delete resume |
| POST | /me/profile-picture | Yes | Upload or replace profile picture |
| DELETE | /me/profile-picture | Yes | Delete profile picture |
| GET | /dev/:username | No | Get public developer profile |

---

# GET /me

## Purpose

Returns the authenticated user's complete profile.

---

## Success Response

**200 OK**

```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "username": "harsh-verma",
    "role": "student",
    "name": "Harsh Verma",
    "email": "harsh@example.com",
    "headline": "Backend Developer",
    "bio": "Building scalable backend applications.",
    "phone": "+91XXXXXXXXXX",
    "location": "Gwalior, India",
    "profilePicture": {},
    "resume": {},
    "skills": [],
    "education": [],
    "experience": [],
    "socialLinks": {},
    "profileCompletion": 80
  }
}
```

---

# PATCH /me

## Purpose

Update basic profile information.

---

## Request Body

```json
{
  "name": "Harsh Verma",
  "headline": "Backend Developer",
  "bio": "Passionate about backend development.",
  "phone": "+91XXXXXXXXXX",
  "location": "Gwalior"
}
```

---

## Validation

- Name: 2–50 characters
- Headline: Max 100 characters
- Bio: Max 500 characters
- Phone: Valid format
- Location: Max 100 characters

---

## Business Rules

- Email cannot be updated.
- Username cannot be updated in V1.
- Empty fields are ignored.

---

## Success

```json
{
  "success": true,
  "message": "Profile updated successfully."
}
```

---

# PATCH /me/skills

## Purpose

Replace the user's skills.

---

## Request

```json
{
  "skills": [
    "Java",
    "Node.js",
    "Express.js",
    "MongoDB"
  ]
}
```

---

## Validation

- Maximum 30 skills
- No duplicates
- Each skill max 50 characters

---

## Success

```json
{
  "success": true,
  "message": "Skills updated successfully."
}
```

---

# PATCH /me/education

## Purpose

Replace user's education history.

---

## Request

```json
{
  "education": [
    {
      "institution": "ITM University",
      "degree": "B.Tech",
      "fieldOfStudy": "Information Technology",
      "startYear": 2023,
      "endYear": 2027,
      "cgpa": 7.1
    }
  ]
}
```

---

## Validation

- Start year <= End year
- CGPA between 0–10
- Institution required
- Degree required

---

## Success

```json
{
  "success": true,
  "message": "Education updated successfully."
}
```

---

# PATCH /me/experience

## Purpose

Replace user's experience.

---

## Request

```json
{
  "experience": [
    {
      "company": "OpenAI",
      "role": "Backend Intern",
      "employmentType": "Internship",
      "startDate": "2026-06-01",
      "endDate": "2026-08-31",
      "currentlyWorking": false,
      "description": "Worked on backend APIs."
    }
  ]
}
```

---

## Validation

- Company required
- Role required
- Start date required
- End date required unless currentlyWorking=true

---

## Success

```json
{
  "success": true,
  "message": "Experience updated successfully."
}
```

---

# PATCH /me/social-links

## Purpose

Update developer profile links.

---

## Request

```json
{
  "github": "https://github.com/harshverma",
  "linkedin": "https://linkedin.com/in/harshverma",
  "portfolio": "https://harsh.dev",
  "leetcode": "https://leetcode.com/harsh",
  "codeforces": "",
  "hackerrank": ""
}
```

---

## Validation

- Must be valid URLs
- Empty strings are allowed

---

## Success

```json
{
  "success": true,
  "message": "Social links updated successfully."
}
```

---

# POST /me/resume

## Purpose

Upload or replace resume.

---

## Request

Content-Type

```
multipart/form-data
```

Field

```
resume
```

---

## Validation

- PDF only
- Maximum file size: 5 MB

---

## Business Rules

- Existing resume is replaced.
- Resume uploaded to Cloudinary.
- Metadata stored in MongoDB.

---

## Success

```json
{
  "success": true,
  "message": "Resume uploaded successfully.",
  "data": {
    "url": "...",
    "uploadedAt": "..."
  }
}
```

---

# DELETE /me/resume

## Purpose

Delete current resume.

---

## Business Rules

- Delete from Cloudinary.
- Remove metadata from database.

---

## Success

```json
{
  "success": true,
  "message": "Resume deleted successfully."
}
```

---

# POST /me/profile-picture

## Purpose

Upload or replace profile picture.

---

## Request

Content-Type

```
multipart/form-data
```

Field

```
profilePicture
```

---

## Validation

- JPG
- JPEG
- PNG
- WEBP
- Maximum 2 MB

---

## Business Rules

- Existing image is replaced.
- Image resized before upload.
- Uploaded to Cloudinary.

---

## Success

```json
{
  "success": true,
  "message": "Profile picture updated successfully."
}
```

---

# DELETE /me/profile-picture

## Purpose

Delete profile picture.

---

## Success

```json
{
  "success": true,
  "message": "Profile picture deleted successfully."
}
```

---

# GET /dev/:username

## Purpose

Returns a public developer profile.

---

## Authentication

Not Required

---

## Success Response

```json
{
  "success": true,
  "data": {
    "username": "harsh-verma",
    "name": "Harsh Verma",
    "headline": "Backend Developer",
    "bio": "Backend Developer specializing in Node.js.",
    "location": "India",
    "profilePicture": {},
    "skills": [
      "Java",
      "Node.js",
      "MongoDB"
    ],
    "education": [],
    "experience": [],
    "socialLinks": {
      "github": "...",
      "linkedin": "...",
      "portfolio": "...",
      "leetcode": "..."
    }
  }
}
```

---

# Common Error Codes

| HTTP | Code | Description |
|------|------|-------------|
|400|VALIDATION_ERROR|Invalid request|
|401|UNAUTHORIZED|Authentication required|
|403|FORBIDDEN|Access denied|
|404|USER_NOT_FOUND|User does not exist|
|404|PROFILE_NOT_FOUND|Public profile not found|
|413|FILE_TOO_LARGE|Uploaded file exceeds limit|
|415|UNSUPPORTED_FILE_TYPE|Invalid file format|

---

# Notes

- Username is unique and immutable in V1.
- Public profiles are available at `/dev/:username`.
- Resume uploads replace the existing resume.
- Profile picture uploads replace the existing image.
- Profile completion is calculated automatically by the backend.
- Email address is read-only after registration.