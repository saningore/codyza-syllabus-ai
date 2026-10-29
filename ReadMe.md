> **TypeScript edition:** Application code uses `.ts` and `.tsx`, with strict TypeScript checking and Zod runtime validation. See `tsconfig.json` for compiler settings and import aliases.

# SyllabusAI — Powered by Codyza

> **Codyza Team 01 | Working specification and development handbook**  
> **Status:** starter scaffold / not a finished application.  
> **Source of requirements:** `Codyza_SyllabusAI_Team01_Organized_With_Logo.pdf` (9-page official team specification).  
> **Important:** The syllabus states a final deadline of **September 16, 2026, 11:59 PM CDT**, which is already past. Ask Codyza in Slack for the current deadline before planning milestones. Do not silently assume an extension.

## 0. Start here — what is this repository?

SyllabusAI is a full-stack student productivity application. Students upload course syllabuses (PDF, DOCX, PNG, JPG/JPEG), the backend parses and analyzes them, and students **review and confirm** extracted academic deadlines before they become trusted records. Confirmed items appear in the semester dashboard, calendar, reminder system, study planner, and syllabus-grounded assistant.

**Non-negotiable:** Never invent a professor's deadline, grading policy, or exam date. Unknown and conflicting facts go into a review queue. Suggested study milestones must be visibly labeled as suggestions rather than instructor requirements.

**What exists in this starter:** Next.js App Router skeleton, Tailwind styles, health route, intentionally unimplemented extraction route, TypeScript/Zod schema, Supabase client helpers, draft SQL tables/RLS, one sample test, GitHub CI, and this planning handbook. **What does not exist:** working auth, upload pipeline, parsing, AI extraction, reminders, real dashboard, calendar, study plans, production security, or production deployment. Do not submit this scaffold as the final product.

## 1. Quick start

Prerequisites: Node.js 22 LTS, npm, Git, a Supabase project, a Gemini developer API key, and (later) Vercel. All essential services should have free-tier or open-source options.

```bash
git clone <OFFICIAL_CODYZA_REPO_URL>
cd <YOUR_REPO>
npm ci
cp .env.example .env.local
# Edit .env.local with your own development credentials
npm run dev
```

Open http://localhost:3000. Check http://localhost:3000/api/health. On Windows PowerShell, use `Copy-Item .env.example .env.local` instead of `cp` if needed.

Before database features work, create a Supabase project, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, review the SQL migration, and apply it through a controlled migration workflow. **Do not run unreviewed SQL in production.** Configure a private storage bucket named `syllabuses` with tested owner-only access policies. The starter migration does **not** include those storage policies or cross-table owner consistency checks.

### Development commands

| Command | Purpose |
|---|---|
| `npm run dev` | Run local Next.js server |
| `npm run build` | Check production compilation |
| `npm run start` | Serve compiled build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript validation |
| `npm test` | Run Vitest tests |
| `npm run test:watch` | Watch tests |

**Dependency management:** `package-lock.json` is committed; use `npm ci` for reproducible installs. Check package advisories and update versions before release.

## 2. Recommended technology and why

| Layer | Starter choice | Reason / caveat |
|---|---|---|
| UI | Next.js App Router + React + TypeScript (TSX) | Shared full-stack JavaScript with statically checked UI components |
| Styles | Tailwind CSS 4 | Consistent responsive UI |
| API | Next.js route handlers | Server-side access and model calls |
| Database | Supabase PostgreSQL | Persistent relational records and RLS |
| Authentication | Supabase Auth + SSR helpers | Sessions and per-user access |
| File storage | Private Supabase Storage | Avoid public syllabus documents |
| AI | Gemini via `@google/genai` | Structured extraction and grounded answers; check free-tier limits |
| Validation | Zod | Reject malformed AI responses |
| PDF | `pdf-parse` starter candidate | PDF text extraction; evaluate scanned PDFs and parser quality |
| DOCX | Mammoth | DOCX text extraction |
| Image OCR | Tesseract (separate installation) | Screenshot text; not wired in this scaffold |
| Calendar | `ical-generator` or Google Calendar API | ICS is acceptable fallback in spec |
| Date logic | date-fns + timezone-aware design | Deadline normalization; consider `date-fns-tz` if needed |
| Tests | Vitest + later Playwright | Unit tests and real end-to-end browser tests |
| Hosting | Vercel + Supabase | Free-first deployment; check limits |

**Install later as needed:** `tesseract.js` or server OCR worker, `@playwright/test`, an email provider SDK, Google OAuth/calendar SDK, a background job queue, and monitoring. Do not add paid dependencies to the core path.

## 3. Product behavior: exact student journey

1. Register, verify account if configured, sign in, and enter protected routes.
2. Create a semester with start/end dates and an IANA timezone.
3. Add/edit courses with code, title, instructor, and section.
4. Upload one or more PDF, DOCX, PNG, or JPEG files to the selected course.
5. Show upload progress and processing status: queued → processing → review needed/completed, or failed.
6. Validate MIME type, extension, actual file signature, maximum size, and ownership on the server. Store privately.
7. Extract text with page/section provenance. OCR scanned pages when needed.
8. Extract assignments, quizzes, exams, projects, presentations, readings, course metadata, and policies.
9. Normalize dates against semester and timezone. Do **not** infer ambiguous years or times without review.
10. Deduplicate likely repeated items and flag missing/conflicting information.
11. Show an extraction review screen with evidence and confidence; confirm, edit, reject, and safe bulk-confirm.
12. Persist reviewed records. Dashboard/calendar only treat **confirmed** deadlines as authoritative.
13. Schedule in-app reminders; optionally email reminders; allow customizable offsets.
14. Answer syllabus questions with source references; explicitly say when a fact is not found.
15. Generate workload forecast and study plans from confirmed data and available study time.
16. Export confirmed events to ICS or sync to Google Calendar, preventing duplicates.
17. Handle corrections by updating affected reminders, calendar events, workload, and study plans.
18. Allow account/data deletion, retries, and understandable failure states.

## 4. Fifteen required AI capabilities — implementation checklist

| # | Capability | Definition of done |
|---|---|---|
| 1 | Structured syllabus extraction | Typed course metadata and all detected academic items, with evidence and review status |
| 2 | Syllabus-grounded Q&A | Answers use source chunks and confirmed data; missing facts yield “not found” |
| 3 | Ambiguity/conflict detection | Missing year/time, contradictory sections, and conflicting dates enter review queue |
| 4 | Personalized weekly plan | Uses confirmed deadlines and student availability; editable/regenerable |
| 5 | Workload forecasting | Classifies weeks light/medium/heavy from deadlines and effort estimates |
| 6 | Smart deadline priority | Sorts by urgency, importance, due date and effort; explains ranking |
| 7 | Course-policy extraction | Attendance, late work, grading, makeup, integrity, contact and office hours only when explicit |
| 8 | Grade-weight extraction | Extracts stated weights/points; leaves missing values unknown |
| 9 | Exam preparation planner | Backward plan from confirmed exam date, topics/readings and availability |
| 10 | Assignment breakdown | Suggested milestones explicitly labeled **not official deadlines** |
| 11 | Duplicate-event detector | Avoids duplicate database/calendar records for same assignment |
| 12 | Change-impact assistant | Recomputes affected reminders, calendar, plans and workload on correction |
| 13 | Natural-language semester search | Handles queries such as “presentations in October” against backend data |
| 14 | Missing-information checker | Incomplete assignments and exams appear in review queue |
| 15 | Source/evidence explanation | Facts link to file, page, section or snippet when technically possible |

**Implementation suggestion, not mandated by Codyza:** Share a single validated extraction pipeline and reusable source-citation system across features; implement deterministic search, duplicate checks and priority formulas when reliable, rather than making unnecessary LLM calls.

## 5. Required pages and UX

- `/` — marketing/entry page with “Powered by Codyza”.
- `/auth/sign-in`, `/auth/sign-up` — real authentication (TODO).
- `/dashboard` — due today, next seven days, later, overdue, unresolved issues, course summaries (TODO).
- `/semesters` and `/semesters/[id]` — semester/course management (TODO).
- `/courses/[id]/upload` — upload center, progress, errors and processing status (TODO).
- `/review` — AI extraction review, confirm/edit/reject/bulk confirm (TODO).
- `/calendar` — month/week/list, course filters and deadline details (TODO).
- `/reminders` — 7d/3d/24h/2h defaults and custom offsets (TODO).
- `/assistant` — grounded chat with visible source context (TODO).
- `/study-plan` — generate/edit/regenerate (TODO).
- `/settings` — profile, preferences, timezone, deletion (TODO).

Routes above are **planned paths**, not existing implementations. Design mobile/tablet/desktop deliberately. Avoid fake buttons, fake stats, dead links, excessive gradients/glass effects. Make loading, empty, offline, invalid-file, AI-failure, and retry states usable. Add keyboard navigation, labels, focus indicators, accessible contrast and screen-reader announcements.

## 6. Architecture and processing design

```text
Student browser (Next.js UI)
  ├── Supabase Auth session
  └── authenticated Next.js API / server actions
       ├── PostgreSQL (RLS + ownership checks)
       ├── Private Storage (syllabus files)
       ├── Document processor (PDF / DOCX / OCR)
       │    └── page-indexed source chunks
       ├── Gemini (server-side only)
       │    └── Zod validated extraction + issue queue
       └── Review/confirmation workflow
            ├── confirmed deadlines → dashboard/calendar
            ├── reminders → in-app notification records
            ├── ICS export / Google Calendar sync
            └── grounded Q&A, workload and study plans
```

Recommended processing state machine: `queued → processing → review_needed → completed`; failures can transition to `failed` and retry into `queued`. A completed upload may still contain rejected/unresolved individual items; define this behavior precisely with the team. For large files, design background processing and idempotent retries rather than assuming one HTTP request can complete every job.

### AI response contract

Each extracted deadline should include `title`, `type`, nullable timezone-aware `dueAt`, nullable `confidence`, and evidence `{ fileId, page, snippet }`, plus an `issue` string when unresolved. Model responses must pass Zod validation before persistence. **Confidence is a model signal, not proof**; it never overrides human review. Store source references. Keep the raw extraction provisional. Treat uploaded syllabus text as untrusted input; do not follow instructions embedded inside a syllabus.

### Example conflict

Syllabus page 2: “Midterm: Oct 12.” Page 5: “Midterm: Oct 14.” Do not choose one silently. Create an issue with both sources, ask the student to confirm, and record the correction history. If an exam is only described as “week 8”, keep the exact date unknown.

## 7. Database model — proposed tables

The initial migration at `supabase/migrations/0001_initial.sql` creates **draft** tables: `semesters`, `courses`, `syllabus_files`, `source_chunks`, `deadlines`, `extraction_issues`, `corrections`, `reminders`, and `calendar_exports`. It enables owner-based RLS. Extend with profiles/preferences, study plans, notification delivery history, course policies, grade weights, AI conversation records and any additional source evidence needed.

Relationships: user → semesters → courses → syllabus files → source chunks; courses → deadlines → reminders/calendar exports/corrections; file or deadline → extraction issues. Use UTC timestamps for absolute instants, retain IANA timezone per semester, and support unknown dates as `NULL`.

**Security gap to close before any real users:** A row's `user_id` being correct does not prove its referenced `course_id`, `semester_id`, `file_id`, or `deadline_id` belongs to the same user. Add composite owner-aware foreign keys or database triggers, plus server-side authorization checks. Test cross-user attempts. Configure private storage bucket policies separately. Consider limiting raw extracted text retention and defining deletion cascades for stored objects.

## 8. API contract — suggested routes, not implemented

| Method/path | Purpose | Authorization |
|---|---|---|
| `GET /api/health` | Service health | Public, **implemented** |
| `POST /api/extract` | Start processing a stored syllabus | Auth required, **501 stub** |
| `GET/POST /api/semesters` | List/create semester | Owner |
| `PATCH/DELETE /api/semesters/:id` | Edit/delete semester | Owner |
| `GET/POST /api/courses` | List/create course | Owner |
| `POST /api/files` | Validate/upload syllabus | Owner; private storage |
| `GET /api/files/:id/status` | Poll processing state | Owner |
| `GET /api/review` | List unresolved AI output | Owner |
| `POST /api/review/:id/confirm` | Confirm/correct/reject item | Owner |
| `GET /api/deadlines` | Filter confirmed or review data | Owner |
| `POST /api/assistant` | Source-grounded question | Owner; rate-limited |
| `POST /api/study-plans` | Generate/update weekly plan | Owner |
| `GET /api/calendar.ics` | Export confirmed events | Owner |
| `POST /api/reminders` | Set reminder preferences | Owner |

Use consistent JSON error format: `{ "error": { "code": "...", "message": "..." } }`. Validate inputs with Zod; return 400 invalid input, 401 unauthenticated, 403 forbidden, 404 inaccessible/missing, 409 conflict, 413 oversized, 415 unsupported, 429 rate limited, 500 internal, 503 provider unavailable. Avoid exposing raw provider errors or secret values.

## 9. Security and privacy release gates

- [ ] All protected routes and APIs verify current session server-side.
- [ ] All tables enforce RLS; cross-owner references are impossible.
- [ ] Supabase Storage bucket is private and object policies are owner-aware.
- [ ] No `.env`, secrets, service-role key, access token or real syllabus in Git history.
- [ ] AI key only used server-side; rate limits, retries, timeouts and cost caps considered.
- [ ] File MIME, magic bytes, size, extension and ownership validated; filenames sanitized.
- [ ] Untrusted file content cannot override system instructions (prompt injection defenses).
- [ ] No unconfirmed AI output appears as a trusted instructor deadline.
- [ ] Uploaded file deletion removes storage objects and related records safely.
- [ ] No cross-user data in logs, AI prompts, search results, exports or caches.
- [ ] Auth, authorization, file abuse, invalid input and provider failure tests pass.

## 10. Team ownership — four roles

**Member 1 — AI & document processing:** parsers/OCR, chunking, extraction schema, Gemini integration, confidence/conflict checks, grounded Q&A, AI test fixtures. Document prompts at a high level, validation, hallucination safeguards and files owned.

**Member 2 — backend & database:** Supabase Auth, schema/migrations, RLS, private storage, protected APIs, reminder/calendar data. Document ER diagram, policies, API contracts, backend tests and env variables.

**Member 3 — frontend & product experience:** dashboard, upload/review UI, calendar, assistant, study plan, forms, accessibility, mobile/tablet/desktop. Document components, user journeys, screenshots and responsive decisions.

**Member 4 — integration, QA & deployment:** connect all components, end-to-end tests, reminders/calendar, bug tracking, deployment and release checklist. Document failures, fixes, test results and production setup.

**Every contributor must produce measurable technical work**. Record exact files, PRs, tests, reviews and fixes. Shared ownership is fine if documented. Git history should support the contribution report.

## 11. Milestones and dependency order (proposed, not official dates)

**Phase A — foundation:** confirm deadline and roles; accept GitHub invite; establish issues/PR conventions; set up Next.js, Supabase, schema, Auth, protected dashboard and CI. Gate: two accounts cannot see each other's data.

**Phase B — first vertical slice:** create semester/course → upload PDF → extract source text → extract one deadline → review/correct → persist → show on dashboard/calendar. Gate: survives refresh/sign-out and never silently confirms uncertain dates.

**Phase C — full document support:** DOCX, image/OCR, processing states, retry/error handling, duplicates, source evidence, policy and grade-weight extraction. Gate: test fixture matrix passes.

**Phase D — intelligence:** grounded Q&A, natural-language search, workload forecasting, priorities, weekly plans, exam prep, milestone suggestions, change-impact propagation. Gate: absent facts yield “not found”; suggestions are clearly labeled.

**Phase E — reminders and calendar:** customizable in-app reminders, scheduled status, confirmed-only ICS export (or Google sync), update/delete behavior and deduplication. Gate: corrected deadlines update related reminders/events.

**Phase F — production hardening:** accessibility, responsive pages, privacy, integration tests, cross-user security, deployment, documentation, demo, release freeze and submission. Gate: official acceptance checklist passes.

Do not assign calendar dates until Codyza confirms the current deadline and the team estimates effort. Integrate continuously, not at the end.

## 12. Git and collaboration workflow

Use the **official Codyza GitHub repository**. Ask in Slack if access is missing. Protect `main`, work in branches like `feat/auth`, `feat/syllabus-parser`, `feat/review-ui`, `fix/calendar-dedup`. Open PRs with a clear description, screenshots for UI, tests, risks, and linked issue. Have another teammate review. Use descriptive commits (`feat: add deadline review state`). Never upload the finished app as one giant final commit. Track tasks and bugs in GitHub Issues/Projects. Keep decisions and blockers visible in the Codyza Slack group.

Suggested PR template:

```md
## Summary
## Requirements covered
## Screenshots / demo (if UI)
## Tests run
## Security/privacy considerations
## Known limitations
## Linked issue
```

## 13. Testing matrix

| Scenario | Expected result |
|---|---|
| PDF with clear deadline | Extracted with source, pending confirmation |
| DOCX syllabus | Extracts text and deadlines |
| Screenshot/scanned PDF | OCR or explicit recoverable error |
| Two conflicting exam dates | Review issue; no guessed date |
| No date present | Unknown date; no fabricated event |
| Duplicate assignment repeated | One confirmed event |
| User corrects date | Dashboard, calendar, reminders and plans update |
| Sign out and back in | Confirmed records persist |
| User A accesses User B file | Denied |
| Unsupported/oversized upload | Useful validation error |
| Gemini timeout/malformed output | Retryable failure; no corrupted records |
| Missing answer in syllabus | Explicit “not found” |
| ICS export | Only confirmed deadlines, correct timezone, no duplicates |
| Mobile/tablet/desktop | Functional navigation and forms |
| All required buttons | Real action, no dead control |
| Account/data deletion | Owned records and objects deleted appropriately |

Create synthetic syllabus fixtures without real student private data. Add unit tests, API integration tests, and Playwright E2E tests. CI should eventually run lint, typecheck, tests, build, and migration/security checks. **Do not claim extraction accuracy until measured against labeled fixtures.**

## 14. Final acceptance checklist (from Codyza specification)

- [ ] New user can authenticate and access protected dashboard.
- [ ] PDF, DOCX, image/screenshot syllabus inputs work.
- [ ] Extracted deadlines persist across refresh and login.
- [ ] Conflicting/uncertain dates are flagged.
- [ ] Corrections propagate to dependent views.
- [ ] Grounded Q&A does not invent absent answers.
- [ ] Dashboard and calendar use real backend records.
- [ ] Reminder preferences persist and reminders function.
- [ ] Google Calendar sync **or** working ICS export handles confirmed deadlines.
- [ ] Users cannot access one another's academic data.
- [ ] Invalid files and AI failures produce recoverable errors.
- [ ] Required pages work on mobile, tablet and desktop.
- [ ] Every required button works.
- [ ] Production deployment loads without breaking errors.
- [ ] “Powered by Codyza” is visible.

## 15. Final submission package

1. Submit the deployed website URL and official GitHub repository URL through Codyza's website project-submission area.
2. Email **team@codyza.com** one professional project document, preferably PDF, **in addition to** the README.
3. Include: project title, team, member roles; problem/target users/goals; feature list; architecture diagram; stack/free-tier rationale; database ER diagram and security; AI upload→parse→chunk→model→validate→review→confirm pipeline; hallucination/ambiguity/failure safeguards; API documentation; desktop/mobile screenshots; testing report; local/deployment instructions with env **names only**; known limitations; individual contributions with files/tests; GitHub and deployment URLs.
4. Optional: short demo video, unless Codyza later makes it mandatory.
5. Do **not** buy a domain without Codyza authorization. Free deployment URL first. Codyza may purchase a domain if selected for official deployment; contributor credit should be documented accurately.

## 16. Open questions to resolve in Slack

- What is the **new official deadline**, given the September 16, 2026 date in the PDF?
- Who owns each role and who reviews cross-cutting changes?
- Which exact free AI model and usage quotas are available to the team?
- What is the maximum upload size, document/page limit, and supported languages?
- How will OCR and long-running processing be hosted within free-tier limits?
- Are in-app reminders sufficient, or is email expected as well? (Spec requires in-app; email optional.)
- Should calendar integration be ICS-first or Google OAuth? (Either accepted if working.)
- What is the retention/deletion policy for uploaded syllabuses and extracted chunks?
- What constitutes acceptable extraction accuracy and what test documents will reviewers use?
- What is the expected production traffic and cost ceiling?

## 17. First-week task board (suggested)

- [ ] Confirm team roles and revised deadline in Slack.
- [ ] Get access to the official Codyza repository.
- [ ] Validate the committed lockfile and confirm CI installs reproducibly with `npm ci`.
- [ ] Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` locally.
- [ ] Create Supabase dev project and private storage policies.
- [ ] Review database ownership/RLS gaps and write security tests.
- [ ] Implement auth and protect dashboard routes.
- [ ] Agree on extraction JSON contract and fixtures.
- [ ] Build one PDF → review → confirmed deadline vertical slice.
- [ ] Open separate issues for the remaining 15 AI requirements and UI pages.

---

**Reminder:** AI development tools are allowed, but contributors must understand, secure, test and explain submitted code. The official Codyza PDF is the source of truth for requirements; the stack, routes, schemas and milestones in this README are engineering proposals unless explicitly stated otherwise.
