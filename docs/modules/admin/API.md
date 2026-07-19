Base

/api/v1/admin

---

GET /dashboard

GET /users

PATCH /users/:id/ban

PATCH /users/:id/activate

DELETE /users/:id

---

GET /companies

PATCH /companies/:id/verify

PATCH /companies/:id/reject

DELETE /companies/:id

---

GET /jobs

DELETE /jobs/:id

PATCH /jobs/:id/close