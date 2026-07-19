# Company API

**Module:** Companies  
**Version:** 1.0  
**Status:** Draft

---

# Overview

Base Path

```
/api/v1/companies
```

Authentication

- All management endpoints require JWT Access Token.
- Public company endpoints do not require authentication.

---

# API Summary

| Method | Endpoint | Authentication | Description |
|---------|----------|----------------|-------------|
| POST | / | Recruiter | Create company |
| GET | /me | Recruiter | Get companies where current recruiter is a member |
| GET | /:slug | No | Get public company profile |
| PUT | /:companyId | Owner/Admin | Update company |
| DELETE | /:companyId | Owner | Delete company (Future) |
| POST | /:companyId/logo | Owner/Admin | Upload company logo |
| DELETE | /:companyId/logo | Owner/Admin | Delete company logo |
| POST | /:companyId/banner | Owner/Admin | Upload company banner |
| DELETE | /:companyId/banner | Owner/Admin | Delete company banner |
| GET | /:companyId/members | Member | List company members |
| POST | /:companyId/members | Owner/Admin | Invite recruiter |
| PATCH | /:companyId/members/:memberId/role | Owner | Change recruiter role |
| DELETE | /:companyId/members/:memberId | Owner/Admin | Remove recruiter |

---

# POST /

## Purpose

Create a new company.

---

## Request

```json
{
  "name": "OpenAI",
  "industry": "Artificial Intelligence",
  "companySize": "1000-5000",
  "foundedYear": 2015,
  "website": "https://openai.com",
  "description": "AI research company",
  "location": {
    "country": "United States",
    "state": "California",
    "city": "San Francisco"
  }
}
```

---

## Validation

- Name required
- Name unique
- Website valid URL
- Founded year cannot exceed current year
- Description max 1000 characters

---

## Business Rules

- Only recruiters can create companies.
- Creator automatically becomes Owner.
- Slug is generated automatically.
- Company status = Pending.

---

## Success

**201 Created**

```json
{
  "success": true,
  "message": "Company created successfully.",
  "data": {
    "companyId": "...",
    "slug": "openai"
  }
}
```

---

# GET /me

## Purpose

Return all companies where the authenticated recruiter is a member.

---

## Success

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "OpenAI",
      "slug": "openai",
      "role": "Owner"
    },
    {
      "id": "...",
      "name": "StartupX",
      "slug": "startupx",
      "role": "Recruiter"
    }
  ]
}
```

---

# GET /:slug

## Purpose

Return public company information.

---

## Success

```json
{
  "success": true,
  "data": {
    "name": "OpenAI",
    "slug": "openai",
    "industry": "Artificial Intelligence",
    "companySize": "1000-5000",
    "website": "https://openai.com",
    "description": "AI research company",
    "logo": {},
    "banner": {},
    "location": {
      "country": "United States",
      "city": "San Francisco"
    },
    "verificationStatus": "Verified",
    "openJobs": 18
  }
}
```

---

# PUT /:companyId

## Purpose

Update company information.

---

## Request

```json
{
  "industry": "Artificial Intelligence",
  "companySize": "1000-5000",
  "description": "Updated description"
}
```

---

## Authorization

- Owner
- Admin

---

## Success

```json
{
  "success": true,
  "message": "Company updated successfully."
}
```

---

# POST /:companyId/logo

## Purpose

Upload or replace company logo.

---

## Request

Content-Type

```
multipart/form-data
```

Field

```
logo
```

---

## Validation

- JPG
- PNG
- WEBP
- Maximum 2 MB

---

## Business Rules

- Existing logo is replaced.
- Upload to Cloudinary.

---

## Success

```json
{
  "success": true,
  "message": "Logo uploaded successfully."
}
```

---

# DELETE /:companyId/logo

## Purpose

Delete company logo.

---

## Success

```json
{
  "success": true,
  "message": "Logo deleted successfully."
}
```

---

# POST /:companyId/banner

## Purpose

Upload company banner.

---

## Validation

- JPG
- PNG
- WEBP
- Maximum 5 MB

---

## Success

```json
{
  "success": true,
  "message": "Banner uploaded successfully."
}
```

---

# DELETE /:companyId/banner

## Success

```json
{
  "success": true,
  "message": "Banner deleted successfully."
}
```

---

# GET /:companyId/members

## Purpose

List all recruiters in a company.

---

## Success

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "John Doe",
      "role": "Owner"
    },
    {
      "id": "...",
      "name": "Jane Smith",
      "role": "Recruiter"
    }
  ]
}
```

---

# POST /:companyId/members

## Purpose

Invite a recruiter to join the company.

---

## Request

```json
{
  "email": "recruiter@example.com",
  "role": "Recruiter"
}
```

---

## Business Rules

- User must exist.
- User must have Recruiter role.
- User cannot already belong to the company.

---

## Success

```json
{
  "success": true,
  "message": "Recruiter added successfully."
}
```

---

# PATCH /:companyId/members/:memberId/role

## Purpose

Update recruiter role.

---

## Request

```json
{
  "role": "Admin"
}
```

---

## Authorization

Owner only.

---

## Allowed Roles

- Admin
- Recruiter

Owner cannot be assigned through this endpoint.

---

## Success

```json
{
  "success": true,
  "message": "Role updated successfully."
}
```

---

# DELETE /:companyId/members/:memberId

## Purpose

Remove recruiter from company.

---

## Authorization

Owner

Admin (cannot remove Owner)

---

## Success

```json
{
  "success": true,
  "message": "Recruiter removed successfully."
}
```

---

# Common Error Codes

| HTTP | Code | Description |
|------|------|-------------|
|400|VALIDATION_ERROR|Invalid request|
|401|UNAUTHORIZED|Authentication required|
|403|FORBIDDEN|Permission denied|
|404|COMPANY_NOT_FOUND|Company does not exist|
|404|MEMBER_NOT_FOUND|Recruiter not found|
|409|COMPANY_ALREADY_EXISTS|Duplicate company name|
|409|RECRUITER_ALREADY_EXISTS|Recruiter already belongs to company|
|413|FILE_TOO_LARGE|Uploaded file exceeds limit|
|415|UNSUPPORTED_FILE_TYPE|Invalid file type|

---

# Notes

- Every company has exactly one Owner.
- Recruiters may belong to multiple companies.
- Company slugs are unique and immutable in V1.
- Logos and banners are stored in Cloudinary.
- Company verification is handled separately.