# Unified Auth Flow – Backend Changes for Register

This document describes the backend changes required for **Option B: unified auth flow**, where both OAuth (Google) and password-register users complete their profile via the same Complete Profile step.

**Goal:** Register creates only the Cognito user. Student/teacher profile is created via `POST /auth/complete-profile` after first sign-in (same as OAuth users).

---

## Summary of changes

| Change | Description |
|--------|--------------|
| Register endpoint | Accept only `username`, `email`, `password`, `givenName`, `familyName`. Create Cognito user only. Do **not** create student/teacher. |
| No breaking change to other endpoints | `POST /auth/complete-profile`, `GET /auth/me`, etc. unchanged. |

---

## 1. Register endpoint – new contract

**Path:** `POST /api/v1/auth/register`

**Request body (camelCase):**

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "givenName": "string",
  "familyName": "string"
}
```

**Remove from request:** `schoolId`, `userType`

**Behavior:**

- Create Cognito user with the provided credentials.
- Do **not** create a student or teacher record.
- Return success (e.g. 200 or 201). Frontend will redirect user to verify email, then sign in.
- When user signs in, `GET /auth/me` returns `profile: null`, `user_type: null` → frontend shows Complete Profile.
- User submits `POST /auth/complete-profile` with role and school/join code → backend creates student/teacher then.

---

## 2. Flow comparison

**Before (old register):**

- Register: create Cognito + student/teacher in one call.
- After verify + sign in: `GET /me` returns profile → user goes straight to app.

**After (unified):**

- Register: create Cognito only.
- After verify + sign in: `GET /me` returns `profile: null` → user goes to Complete Profile.
- Complete Profile: same as OAuth users → `POST /auth/complete-profile` → app.

---

## 3. Checklist for backend

- [ ] Update `POST /auth/register` to accept only `username`, `email`, `password`, `givenName`, `familyName`.
- [ ] Remove `schoolId` and `userType` from register request schema.
- [ ] Register handler creates Cognito user only; do not create student/teacher.
- [ ] Update API docs / OpenAPI if applicable.
- [ ] Test: register → verify → sign in → `GET /me` returns `profile: null` → Complete Profile works.

---

## 4. Reference

See [AUTH_AND_PROFILE_CONTRACT.md](./AUTH_AND_PROFILE_CONTRACT.md) for the full auth contract. Section 2.6 and 5 describe the unified flow.
