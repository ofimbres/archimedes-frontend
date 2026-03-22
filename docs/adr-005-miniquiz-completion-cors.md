# ADR-005: Student miniquiz completion via CORS + token in URL hash

## Status

Accepted (aligned with current backend)

## Context

Students open hosted worksheets (miniquiz HTML) on a CDN in a **new tab**. The API records completion with `POST /api/v1/assignments/{assignment_id}/completions` using the student’s Cognito JWT.

Earlier options considered:

- **`postMessage` to `window.opener`** — requires keeping the Archimedes tab open and trusting message origin; does not work well when the worksheet is the only tab or `opener` is null.
- **Webhook with static API key in the worksheet** — unsafe (key is public).

## Decision

1. The **Archimedes SPA** builds the worksheet URL from `activity.content_url` and adds:
   - **Query:** `assignment_id`, `student_id`, `archimedes_api_base`, optional `activity_id`.
   - **Hash:** `#id_token=...` or `#access_token=...` (`encodeURIComponent`), never putting the JWT in the query string (so the CDN request does not carry the token).
2. **`m4u_extended.js`** on the CDN reads the hash + query params and **`fetch`es** the completions endpoint with `Authorization: Bearer <same token>`.
3. The **backend** allows the worksheet **origin** in **CORS** for that `POST`.
4. The SPA **refetches** assignments when the tab becomes visible again (`visibilitychange`); no `postMessage` from the quiz tab.

## Consequences

- **CORS** must be configured for every worksheet origin (e.g. CloudFront URL).
- **SPA ↔ API CORS:** The Archimedes web app calls the API from its own origin (e.g. `http://localhost:3000` in dev). The backend must allow that origin on `/api/v1/...` (including successful **OPTIONS** preflight) — this is separate from worksheet-origin CORS for `POST .../completions`.
- **JWT in the hash** is visible in the address bar and to scripts on that page; mitigations are short token lifetime and HTTPS-only worksheet hosting.
- **`REACT_APP_BACKEND_API_ENDPOINT`** must resolve to an **origin the student’s browser can reach** from the worksheet page (not e.g. `http://0.0.0.0:8001` if that is unreachable from the client). The SPA uses this value (via `getBackendApiOriginForMiniquizLaunch`) for `archimedes_api_base` on launch URLs.

## References

- `docs/AUTH_AND_PROFILE_CONTRACT.md` §5c
- `src/utils/backendApiBaseUrl.ts`, `src/utils/assignmentLaunchUrl.ts`, `src/pages/student/Assignments.tsx`, `public/mini-quiz/m4u_extended.js`
