# Authentication API

**Module:** Authentication  
**Version:** 1.0  
**Status:** Draft

---

# Overview

Base Path

```
/api/v1/auth
```

Authentication Strategy

- JWT Access Token
- Refresh Token (HTTP-only Cookie)

---

# API Summary

| Method | Endpoint | Authentication | Description |
|---------|----------|----------------|-------------|
| POST | /register | No | Register a new user |
| POST | /login | No | Login user |
| POST | /google | No | Google OAuth login |
| POST | /verify-email | No | Verify email address |
| POST | /resend-verification | No | Send verification email again |
| POST | /refresh | Refresh Cookie | Generate new access token |
| POST | /logout | Yes | Logout current session |
| GET | /me | Yes | Get authenticated user |

---

# POST /register

## Purpose

Creates a new account.

---

## Request Body

```json
{
  "name": "Harsh Verma",
  "email": "harsh@example.com",
  "password": "StrongPassword123",
  "confirmPassword": "StrongPassword123",
  "role": "student"
}
```

---

## Validation

Name

- Required
- 2–50 characters

Email

- Required
- Valid email
- Unique

Password

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

Role

Allowed values

- student
- recruiter

---

## Business Rules

- Email must not already exist.
- Password is hashed before storage.
- Email verification token is generated.
- Verification email is sent.

---

## Success Response

**201 Created**

```json
{
  "success": true,
  "message": "Registration successful. Please verify your email."
}
```

---

## Error Codes

| HTTP | Code | Description |
|------|------|-------------|
|400|VALIDATION_ERROR|Invalid request|
|409|EMAIL_ALREADY_EXISTS|Email already registered|

---

# POST /login

## Request

```json
{
  "email":"harsh@example.com",
  "password":"StrongPassword123"
}
```

---

## Business Rules

- Verify email exists.
- Verify password.
- Reject unverified accounts.
- Generate Access Token.
- Generate Refresh Token.
- Store Refresh Token.
- Set Refresh Token Cookie.

---

## Success

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "...",
    "user": {}
  }
}
```

Cookie

```
refreshToken=<token>

HttpOnly
Secure
SameSite=Strict
```

---

## Error Codes

|HTTP|Code|
|----|----|
|400|VALIDATION_ERROR|
|401|INVALID_CREDENTIALS|
|403|EMAIL_NOT_VERIFIED|

---

# POST /verify-email

Purpose

Verify user's email using verification token.

---

Request

```json
{
    "token":"..."
}
```

---

Success

```json
{
  "success": true,
  "message": "Email verified successfully."
}
```

---

Errors

- INVALID_TOKEN
- TOKEN_EXPIRED

---

# POST /resend-verification

Purpose

Send another verification email.

---

Request

```json
{
  "email":"..."
}
```

---

Business Rules

- User must exist.
- Email must not already be verified.

---

# POST /refresh

Purpose

Generate a new access token.

---

Authentication

Refresh Token Cookie

---

Business Rules

- Validate refresh token.
- Verify session exists.
- Generate new access token.
- Rotate refresh token.

---

Success

```json
{
  "success": true,
  "data": {
    "accessToken":"..."
  }
}
```

---

Errors

- INVALID_REFRESH_TOKEN
- SESSION_EXPIRED

---

# POST /logout

Purpose

Logout current session.

---

Authentication

Access Token

---

Business Rules

- Delete refresh token.
- Clear refresh cookie.

---

Success

```json
{
  "success": true,
  "message":"Logged out successfully."
}
```

---

# GET /me

Purpose

Return authenticated user's information.

---

Authentication

Access Token

---

Success

```json
{
  "success": true,
  "data": {
    "id":"",
    "name":"",
    "email":"",
    "role":"student"
  }
}
```

---

# Common Error Codes

| Code | Meaning |
|------|---------|
|VALIDATION_ERROR|Request validation failed|
|INVALID_CREDENTIALS|Incorrect email or password|
|EMAIL_ALREADY_EXISTS|Duplicate email|
|EMAIL_NOT_VERIFIED|Email not verified|
|INVALID_TOKEN|Token invalid|
|TOKEN_EXPIRED|Verification expired|
|INVALID_REFRESH_TOKEN|Refresh token invalid|
|SESSION_EXPIRED|Session expired|
|UNAUTHORIZED|Authentication required|
|FORBIDDEN|Permission denied|

---

# Notes

- Refresh Token is stored in an HTTP-only Secure Cookie.
- Access Token lifetime: **15 minutes**.
- Refresh Token lifetime: **7 days**.
- Refresh Token is rotated on every refresh request.
- Passwords are hashed using bcrypt.