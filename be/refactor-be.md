# Backend Refactoring Plan

> **Goal**: Decouple the backend into clean architectural layers without breaking existing functionality.
> Each chunk is designed to be **self-contained** — it can be merged and deployed independently.

---

## Current Architecture Problems

| Problem | Where | Impact |
|---|---|---|
| **Fat Controllers** | Every `*Controller.js` | Business logic, DB queries, HTTP handling, and validation all live in one function. Impossible to reuse logic outside of Express (e.g., cron jobs, workers). |
| **Repetitive try/catch** | Every exported handler | Identical `try { ... } catch (e) { res.status(500)... }` blocks in ~80+ functions. Pure boilerplate. |
| **Inline Validation** | `requirementsController`, `meetingsController`, `projectsController`, etc. | Manual `if (!field)` checks scattered inside handlers instead of declarative middleware. |
| **Direct Prisma coupling** | All controllers import `prismaClient.js` directly | Cannot swap DB layer, mock cleanly, or add cross-cutting concerns (caching, logging) without touching every file. |
| **Duplicated slug/UUID resolution** | `diagramController`, `verificationController`, `docController`, `requirementsController` | Same `resolveProjectId()` helper copy-pasted across 4+ controllers. |
| **No global error middleware** | `app.js` | 404 handler exists but no centralized error handler. Unhandled promise rejections in controllers crash silently or return vague 500s. |

---

## Refactoring Chunks

### Chunk 1 — Global Error Handling & asyncHandler

**Risk: 🟢 Very Low** — Additive only, no business logic changes.

**What**:
1. Create `src/utils/AppError.js` — a custom error class with `statusCode` and `isOperational` flag.
2. Create `src/utils/asyncHandler.js` — a wrapper that catches rejected promises and forwards them to `next(err)`.
3. Add a global error-handling middleware in `app.js` (after all routes) that formats errors consistently.

**Files to create**:
- `src/utils/AppError.js`
- `src/utils/asyncHandler.js`

**Files to modify**:
- `app.js` — add error middleware after the 404 handler.

**Why first**: This is pure plumbing. Once it exists, every subsequent chunk can use `asyncHandler` and `throw new AppError(...)` instead of manual try/catch. Zero risk to existing routes since we're only *adding* a fallback handler.

**Verification**: Start the server, hit an invalid route → should get JSON error. Hit a valid route → should work identically.

---

### Chunk 2 — Shared Helpers (resolveProjectId, response helpers)

**Risk: 🟢 Low** — Extract duplicated code into shared utils.

**What**:
1. Create `src/utils/resolveProjectId.js` — single source of truth for slug-or-UUID resolution.
2. Create `src/utils/response.js` — standard response helpers (`success(res, data, status)`, `paginated(res, data, meta)`).
3. Replace duplicated `resolveProjectId` in:
   - `diagramController.js`
   - `docController.js`
   - `verificationController.js`
   - `requirementsController.js`
   - `meetingsController.js`

**Files to create**:
- `src/utils/resolveProjectId.js`
- `src/utils/response.js`

**Files to modify**:
- 5 controllers (import swap only, no logic changes).

**Verification**: Test any endpoint that takes a project slug (e.g., `GET /api/diagrams/fyp`) — should resolve correctly.

---

### Chunk 3 — Service Layer (Module by Module)

**Risk: 🟡 Medium** — Core structural change, but done one module at a time.

**What**: For each module, extract business logic from the controller into a `*Service.js`. The controller becomes a thin HTTP adapter:

```
Controller (HTTP)  →  Service (Business Logic)  →  Prisma (DB)
```

**Order of migration** (smallest/simplest first to build confidence):

| # | Module | Controller LOC | Complexity | Notes |
|---|--------|---------------|------------|-------|
| 1 | `auth` | 50 | Simple | Good warm-up. Login/register only. |
| 2 | `upload` | 63 | Simple | File upload, minimal logic. |
| 3 | `chat` | 191 | Low | Group chat CRUD. |
| 4 | `projects` | 478 | Medium | CRUD + members + tags. Well-understood. |
| 5 | `users` | 295 | Medium | User CRUD + profile. |
| 6 | `rbac` | 295 | Medium | Roles/permissions CRUD. |
| 7 | `feedbacks` | 370 | Medium | Forms + responses. |
| 8 | `diagrams` | 262 | Medium | CRUD + AI generation (already has extracted prompts). |
| 9 | `docs` | 463 | Medium-High | CRUD + AI generation + export. |
| 10 | `prototyping` | 267 | Medium | Prototypes + screens + requirement links. |
| 11 | `techFeasibility` | 147 | Medium | AI-powered analysis. |
| 12 | `economicFeasibility` | 285 | Medium | Monte Carlo engine already extracted. |
| 13 | `legalFeasibility` | 219 | Medium | RAG-based search. |
| 14 | `verification` | 352 | Medium-High | ARM analysis + AI verification. |
| 15 | `meetings` | 503 | High | LiveKit, transcription, recording, AI extraction. |
| 16 | `requirements` | 666 | High | Complex CRUD + traceability + import/export + history. |
| 17 | `specbot` | 883 | Highest | Chat sessions, AI, file artifacts, summarization, extraction. |

**Per-module pattern**:
```
modules/
  auth/
    authController.js    ← thin HTTP layer (req/res only)
    authService.js       ← NEW: business logic + DB calls
    authRoutes.js        ← unchanged
```

Each service migration:
1. Create `*Service.js` and move business logic + Prisma calls into it.
2. Slim down the controller to: parse request → call service → send response.
3. Wrap each controller handler with `asyncHandler()` (from Chunk 1).
4. Replace manual try/catch with thrown `AppError`s.
5. Test the module's endpoints before moving to the next.

**Verification per module**: Hit every endpoint for that module manually or via test suite. Compare responses to pre-refactor baseline.

---

### Chunk 4 — Validation Schemas

**Risk: 🟡 Medium** — Replaces inline checks with middleware.

**What**:
1. Create validation schema files per module using `express-validator` (already installed).
2. Create a reusable `validate.js` middleware that runs the schema and returns 400 on failure.
3. Move inline validation out of controllers into route-level middleware.

**Files to create**:
- `src/middlewares/validate.js` — generic runner.
- `src/modules/*/validators.js` — per-module schemas (one file per module, as needed).

**Modules with the most inline validation**:
- `requirementsController.js` — priority/status enums, title length, etc.
- `meetingsController.js` — title required, date validation.
- `projectsController.js` — name, dates, members array.
- `feedbacksController.js` — form structure, responses.
- `specbotController.js` — title, content, sender_type.

**Verification**: Send invalid payloads (missing fields, wrong types) → should get clean 400 errors with field-level messages instead of 500s or vague errors.

---

### Chunk 5 — Repository Layer (Optional / Advanced)

**Risk: 🟠 Higher** — Adds another abstraction layer. Only do this if you plan to:
- Swap Prisma for another ORM in the future.
- Add caching (Redis) transparently.
- Need strict unit testing with mocked DB calls.

**What**:
1. Create a `repositories/` directory under `src/`.
2. For each model, create a repository that wraps Prisma calls:
   ```
   Service  →  Repository  →  Prisma
   ```
3. Migrate services to call repositories instead of Prisma directly.

**Recommendation**: Skip this chunk unless the project grows significantly. The Service Layer (Chunk 3) already provides most of the decoupling benefits.

---

## Execution Strategy

```
Chunk 1 (Error Handling)
    ↓ deploy & verify
Chunk 2 (Shared Helpers)
    ↓ deploy & verify
Chunk 3 (Service Layer — module by module, 17 sub-steps)
    ↓ deploy & verify after each module
Chunk 4 (Validation Schemas)
    ↓ deploy & verify
Chunk 5 (Repository Layer — optional)
```

### Rules for Safe Execution

1. **One module at a time** for Chunk 3. Never refactor two modules in parallel.
2. **Test after every module migration** before moving to the next.
3. **No API contract changes** — request/response shapes must stay identical.
4. **No route changes** — URL paths and HTTP methods stay the same.
5. **Git branch per chunk** — e.g., `refactor/chunk-1-error-handling`, `refactor/chunk-3-projects-service`.

---

## File Structure After Refactor

```
be/src/
├── middlewares/
│   ├── auth/
│   ├── common/
│   │   ├── requirePermissions.js
│   │   ├── verifyToken.js
│   │   └── ...
│   └── validate.js                    ← NEW (Chunk 4)
├── modules/
│   ├── auth/
│   │   ├── authController.js          ← slimmed down
│   │   ├── authService.js             ← NEW (Chunk 3)
│   │   ├── authRoutes.js
│   │   └── validators.js              ← NEW (Chunk 4)
│   ├── projects/
│   │   ├── projectsController.js      ← slimmed down
│   │   ├── projectsService.js         ← NEW (Chunk 3)
│   │   ├── projectsRoutes.js
│   │   └── validators.js              ← NEW (Chunk 4)
│   ├── requirements/
│   │   ├── requirementsController.js  ← slimmed down
│   │   ├── requirementsService.js     ← NEW (Chunk 3)
│   │   ├── requirementsRoutes.js
│   │   └── validators.js              ← NEW (Chunk 4)
│   └── ... (same pattern for all 17 modules)
├── utils/
│   ├── AppError.js                    ← NEW (Chunk 1)
│   ├── asyncHandler.js                ← NEW (Chunk 1)
│   ├── resolveProjectId.js            ← NEW (Chunk 2)
│   ├── response.js                    ← NEW (Chunk 2)
│   ├── gemini.js
│   ├── prompts/
│   └── ...
└── repositories/                      ← NEW (Chunk 5, optional)
```
