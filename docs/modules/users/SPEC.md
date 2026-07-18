# User Module Specification (SPEC)

**Module:** Users

**Version:** 1.0

**Status:** Draft

---

# 1. Purpose

The User module manages user profile information after authentication.

It allows authenticated users to maintain their personal information, resumes, profile images, skills, education, experience, and social links.

This module does not handle authentication or authorization.

---

# 2. Goals

The User module should allow users to:

- View profile
- Update profile
- Upload resume
- Delete resume
- Upload profile image
- Delete profile image
- Manage skills
- Manage education
- Manage experience
- Manage social links

---

# 3. Actors

Student

Can

- View own profile
- Update own profile
- Upload resume
- Manage skills
- Manage education
- Manage experience

---

Recruiter

Can

- View own profile
- Update own profile
- Upload company logo (through Company module)
- Manage social links

---

Guest

Can

- View public profile (optional)

Cannot

- Modify user information

---

# 4. Profile Information

Common Fields

- Name
- Email (Read Only)
- Phone
- Bio
- Location
- Profile Picture

Student Fields

- Resume
- Skills
- Education
- Experience
- Portfolio
- GitHub
- LinkedIn

Recruiter Fields

- Designation
- Company Reference

---

# 5. Business Rules

General

- Users can edit only their own profile.
- Email cannot be changed.
- Profile picture is optional.
- Resume is optional.
- Resume replaces the previous one.

Student

- Only one active resume.
- Skills cannot contain duplicates.
- Portfolio links must be valid URLs.

Recruiter

- Company is managed by Company Module.

---

# 6. Resume Management

Users can

- Upload resume
- Replace resume
- Delete resume

Rules

- PDF only
- Maximum file size (configured)
- Stored in Cloudinary
- Only metadata stored in MongoDB

---

# 7. Profile Image

Users can

- Upload
- Replace
- Delete

Rules

- Image formats only
- Resize before upload
- Store in Cloudinary

---

# 8. Permissions

Authenticated User

Can modify

Own profile only

Admin

Not included in V1

---

# 9. Dependencies

Authentication Module

Cloudinary

---

# 10. Future Features

Not included

- Multiple resumes
- Resume history
- Profile themes
- Portfolio builder
- Resume templates

---

# References

Authentication Module

Engineering Standards

Database Architecture