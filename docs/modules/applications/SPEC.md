# Application Module

Status: Draft

Version: 1.0

---

## Purpose

Allows developers to apply for jobs.

Tracks application lifecycle.

Stores resume snapshot.

---

## Actors

Student

Recruiter

---

## Features

Apply

Withdraw

View Application

Update Status

Schedule Interview

Reject

Offer

---

## Status Flow

Applied
↓

Under Review
↓

Interview Scheduled
↓

Interview Completed
↓

Offer
↓

Accepted

OR

Rejected

---

## Business Rules

One application per job.

Resume snapshot stored.

Candidate snapshot stored.

Applications cannot be modified after submission.

Closed jobs reject applications.

Archived jobs reject applications.

---

## Stored Snapshot

Resume

Skills

Education

Experience

Headline

Portfolio Links

---

## Dependencies

Users

Jobs

Authentication

Companies

Interview