# Auth and profile contract (frontend)

This document is the **contract between archimedes-backend and the frontend** for authentication, role selection, profile completion, and personal info. Use it when implementing the UI so requests/responses and flow stay in sync.

**Base URL:** All auth endpoints live under `{API_BASE}/api/v1/auth` (e.g. `https://api.example.com/api/v1/auth`).

**Authentication:** Protected endpoints require the header:

```http
Authorization: Bearer <access_token_or_id_token>
```

Use the token returned after login (password or OAuth callback). The backend validates Cognito-issued JWTs.

---

## 1. High-level flow

1. **Login** – User signs in via:
   - **Google (OAuth):** Redirect to backend OAuth URL → Cognito Hosted UI → callback returns tokens (and optionally HTML).
   - **Password:** `POST /api/v1/auth/login` with `username` and `password`; response includes tokens and `user` info.

2. **Check profile** – Frontend calls `GET /api/v1/auth/me` with `Authorization: Bearer <token>`.

3. **Branch:**
   - If **`profile` is not null** → User has a linked student or teacher (or is admin). Use `user_type` and `profile` to show the correct app.
   - If **`profile` is null** and **`user_type` is not `"admin"`** → Show **“Complete your profile”**: choose role (Student / Teacher), then context (join code for students, school for teachers), then submit.

4. **Complete profile** – Frontend calls `POST /api/v1/auth/complete-profile` with body (see below). Backend creates the student or teacher and returns the same shape as `/me`.

5. **Personal info (optional)** – After profile exists, user can update name via `PATCH /api/v1/auth/me`.

**Roles in the UI:** Show only **Student** and **Teacher**. **Admin** is never a choice; the backend returns `user_type: "admin"` for users configured as admin (e.g. by email or Cognito id in backend config).

---

## 2. Endpoints reference

### 2.1 Google (OAuth) sign-in

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/auth/oauth/url` | No | Returns `{ "url": "<Cognito Hosted UI URL>", "redirect_uri": "..." }`. Frontend redirects user to `url` (e.g. `window.location = url`). |
| GET | `/api/v1/auth/oauth/redirect` | No | 302 redirect to Cognito Hosted UI. Use as the href for a “Sign in with Google” button. |
| GET | `/api/v1/auth/callback?code=...&state=...` | No | OAuth callback. Backend exchanges `code` for tokens. Browser receives HTML or JSON with tokens and user info. **Callback URL** must be exactly `{BACKEND_URL}/api/v1/auth/callback` in Cognito. |

**Query params (optional):**

- `oauth/url`: `state`, `identity_provider` (default `"Google"`).
- `oauth/redirect`: same.
- `callback`: `code` (required), `state` (optional).

**Callback response (JSON):** Same shape as login response below (e.g. `access_token`, `id_token`, `refresh_token`, `user`).

---

### 2.2 Password login

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/login` | No | Body: `{ "username": string, "password": string }`. Returns tokens and user info. |

**Response (200):**

```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "string | null",
  "id_token": "string | null",
  "user": {
    "username": "string",
    "email": "string | null",
    "given_name": "string | null",
    "family_name": "string | null",
    "sub": "string | null"
  }
}
```

Store `access_token` (and optionally `refresh_token`, `id_token`) for subsequent requests.

---

### 2.3 Current user (me)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/auth/me` | Bearer | Returns the current user’s role and, if linked, their student or teacher profile. |
| PATCH | `/api/v1/auth/me` | Bearer | Update current user’s personal info (e.g. first name, last name). |

**GET /me response (200):**

```json
{
  "user_type": "students" | "teachers" | "admin" | null,
  "profile": { ... } | null
}
```

- **`user_type`**
  - `"students"` – User has a linked **student** record; `profile` is the student object.
  - `"teachers"` – User has a linked **teacher** record; `profile` is the teacher object.
  - `"admin"` – User is an admin (backend-configured); `profile` is typically `null`. Show admin UI; do not show “Complete profile”.
  - `null` – No linked profile; show “Complete your profile” (role + context).
- **`profile`** – When present, a **student** or **teacher** object (see profile shape below). For admin, usually `null`.

**PATCH /me request body:** Optional fields (camelCase or snake_case per backend schema).

```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)"
}
```

**PATCH /me response (200):** Same as GET /me (`user_type` and updated `profile`).

**Errors:**

- 401 – Missing or invalid token.
- 404 (PATCH only) – No profile linked; user must complete profile first.

---

### 2.4 Complete profile

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/complete-profile` | Bearer | Create the linked student or teacher record for the current user (e.g. after first Google sign-in). Idempotent: if profile already exists, returns 200 with existing profile. |

**Request body (camelCase):**

- **`userType`** (required): `"students"` | `"teachers"`.
- **Students – choose one:**
  - **`joinCode`** (optional): Class join code (5–10 chars). Backend resolves the course, uses its school, creates the student, and enrolls them in that class. Do not send `schoolId` when using `joinCode`.
  - **`schoolId`** (optional): UUID of the school. Creates the student at that school with no class enrollment.
  - Validation: student must have **exactly one** of `joinCode` or `schoolId` (not both, not neither).
- **Teachers:**
  - **`schoolId`** (required): UUID of the school.

**Examples:**

```json
{ "userType": "students", "joinCode": "AB12X" }
{ "userType": "students", "schoolId": "550e8400-e29b-41d4-a716-446655440000" }
{ "userType": "teachers", "schoolId": "550e8400-e29b-41d4-a716-446655440000" }
```

**Response:**

- **201** – Profile created; body same as GET /me (`user_type` and `profile`).
- **200** – Profile already existed (idempotent); body same as GET /me.

**Errors:**

- 400 – Validation (e.g. student with both or neither of `joinCode`/`schoolId`, teacher without `schoolId`, email missing when backend needs it from token).
- 404 – Invalid join code or course not found.
- 401 – Missing or invalid token.

---

### 2.5 Token refresh and logout

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/refresh` | No | Body: `{ "refresh_token": "string" }`. Returns new access token (and optionally id_token). |
| POST | `/api/v1/auth/logout` | No | Body: `{ "access_token": "string" }`. Invalidates the token. |

---

### 2.6 Email/password registration (optional path)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | No | Body: `username`, `email`, `password`, `givenName`, `familyName`. Creates **Cognito user only** (no student/teacher). User verifies email, then signs in; profile is created via **POST /auth/complete-profile** (same flow as OAuth users). |

**Unified flow:** Both OAuth (Google) and password register users complete their profile via the same Complete Profile step after first sign-in.

---

## 3. Profile shape (student / teacher)

When `profile` is not null in GET /me or complete-profile response, it is either a **student** or **teacher** object.

**Student** (when `user_type === "students"`):

- `id`, `school_id`, `first_name`, `last_name`, `full_name`, `email`, `username`, `is_active`, `created_at`, `updated_at`, and optionally `cognito_user_id`.

**Teacher** (when `user_type === "teachers"`):

- `id`, `school_id`, `first_name`, `last_name`, `full_name`, `email`, `username`, `max_classes`, `is_active`, `created_at`, `updated_at`, and optionally `cognito_user_id`.

UUIDs are strings; timestamps are ISO 8601. Frontend can rely on these fields for display and for calling other APIs (e.g. student id for enrollments).

---

## 4. Join code (student flow)

- **Teacher:** Each **course** (class) has a **join code** (short, e.g. 5 characters). Teacher gets it from the backend when viewing a course (e.g. GET course by id or list teacher courses). Teacher shows this code in class; students enter it when completing profile.
- **Student (first time):** In “Complete your profile”, after choosing role **Student**, ask for the **class join code**. Send it as `joinCode` in `POST /auth/complete-profile` with `userType: "students"`. Backend creates the student and enrolls them in that class.
- **Student (already has account):** To join another class later, use `POST /api/v1/enrollments/join` with `student_id` and body `{ "join_code": "AB12X" }` (see enrollments API). No change to auth flow.

---

## 5. Recommended UI flow

**Unified flow for both OAuth and password users:**

1. **Sign in or register:**
   - **Google:** “Sign in with Google” → OAuth → tokens.
   - **Password (existing):** Sign in form → `POST /auth/login` → tokens.
   - **Password (new):** Sign up form → `POST /auth/register` (Cognito only) → verify email → sign in → tokens.
2. After login, store tokens and call **GET /auth/me**.
3. **If `profile` is null and `user_type` is not `"admin"`:**
   - Screen: “Complete your profile.”
   - Step 1: “I am a…” → **Student** | **Teacher**.
   - Step 2:
     - If Student: “Enter your class join code” (from teacher) → input `joinCode`; or “Or select school” → pick `schoolId` (if your UI supports it).
     - If Teacher: “Select your school” → pick `schoolId`.
   - Submit → **POST /auth/complete-profile** with `userType` and `joinCode` or `schoolId`.
4. **If `profile` is not null (or `user_type === "admin"`):** Go to role-specific app (student dashboard, teacher dashboard, admin).
5. **Optional:** “Edit profile” or “Personal info” screen → **PATCH /auth/me** with `firstName`, `lastName`.

---

## 6. Admin

- **Not** selectable in the UI. Admins are configured on the backend (e.g. list of emails or Cognito ids in env).
- When such a user calls GET /me, backend returns `user_type: "admin"` and `profile: null` (unless you add an admin profile later).
- Frontend should show admin-only sections or routes when `user_type === "admin"`. Backend may enforce admin with a separate dependency on admin-only endpoints.

---

## 7. CORS and callback URL

- Backend should allow the frontend origin in CORS when calling `/api/v1/auth/*` and other APIs.
- For Google sign-in, Cognito redirects to the **backend** callback URL (`{BACKEND_URL}/api/v1/auth/callback`). After the backend returns (HTML or JSON), the frontend can either:
  - Use a dedicated “post-login” page that reads tokens from the response (e.g. if backend returns HTML with tokens in a script or redirects to frontend with tokens in fragment/query), or
  - Have the backend return JSON and the callback URL point to the frontend with `?code=...` and have the frontend send the code to the backend to exchange for tokens (if you add such an endpoint). Current contract: callback is the backend URL; backend exchanges code and returns tokens (HTML or JSON).

---

## 8. Summary table

| Action | Endpoint | When |
|--------|----------|------|
| Sign in with Google | GET `/auth/oauth/url` or GET `/auth/oauth/redirect` | Login page |
| Handle OAuth callback | GET `/auth/callback?code=...` | After Cognito redirect; backend returns tokens |
| Register (password) | POST `/auth/register` body `{ username, email, password, givenName, familyName }` | Sign up form; creates Cognito only |
| Sign in with password | POST `/auth/login` | Login form submit |
| Get current user / role / profile | GET `/auth/me` | After login; before app shell |
| Complete profile (student with join code) | POST `/auth/complete-profile` body `{ userType: "students", joinCode: "AB12X" }` | First time, no profile |
| Complete profile (student with school) | POST `/auth/complete-profile` body `{ userType: "students", schoolId: "<uuid>" }` | First time, no profile |
| Complete profile (teacher) | POST `/auth/complete-profile` body `{ userType: "teachers", schoolId: "<uuid>" }` | First time, no profile |
| Update personal info | PATCH `/auth/me` body `{ firstName?, lastName? }` | Profile edit screen |
| Refresh token | POST `/auth/refresh` | When access token expires |
| Logout | POST `/auth/logout` | Logout action |

This contract is the source of truth for the frontend; backend implements it as in `app/routers/auth.py` and `app/schemas/auth.py`.

---

## 9. ADR – Decisions

| Decision | Rationale |
|----------|-----------|
| **One “complete profile” step** | After login we don’t know school or role from OAuth; one step collects role (student/teacher) and context (join code or school). |
| **Student: join code OR schoolId** | Joining via class code is the primary path (teacher shows code in class); schoolId-only supports admin-created or manual assignment. |
| **Admin not in UI** | Admin is assigned via backend config (e.g. env list); frontend only reacts to `user_type: "admin"` from GET /me. |
| **Profile linked by cognito_user_id** | Students and teachers store `cognito_user_id` (Cognito sub); GET /me and complete-profile use it so one Cognito identity maps to at most one student or one teacher. |
| **PATCH /me for personal info** | Keeps complete-profile minimal (role + context); name/email from token. Optional personal info (e.g. first/last name) editable later via PATCH /me. |
| **OAuth callback on backend** | Cognito redirect_uri is the backend; backend exchanges code for tokens and returns HTML or JSON so the same callback works for browser and API clients. |
| **Unified Complete Profile** | Both OAuth and password-register users create their student/teacher profile via POST /auth/complete-profile after first sign-in. Register creates Cognito user only. |
