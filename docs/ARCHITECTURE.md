# Architecture — modular monolith

**Decision:** Modular monolith (single Next.js deployable + Supabase). Not microservices. Not an unstructured classic monolith.

## Why

- 4-person team, free-tier Vercel + Supabase, learning deadline
- Domains are tightly coupled via change-impact (deadline → reminders → calendar → plans)
- Shared Postgres + RLS is the security model
- Optional `jobs/` worker later if serverless timeouts block OCR/Gemini — same repo, not a service fleet

## Runtime shape

```text
Student browser (Next.js UI)
  ├── Supabase Auth session
  └── authenticated Next.js API / server actions
       ├── PostgreSQL (RLS + ownership checks)
       ├── Private Storage (syllabus files)
       ├── modules/documents (PDF / DOCX / OCR → source chunks)
       ├── modules/extraction (Gemini server-side + Zod)
       ├── modules/review (human confirm/edit/reject)
       └── confirmed deadlines → reminders / calendar / assistant / planner
```

## Module map

| Module | Responsibility |
|---|---|
| `identity` | Profiles, prefs, account deletion |
| `academic` | Semesters, courses, timezone |
| `documents` | Upload, validation, parse/OCR, chunks, status machine |
| `extraction` | Gemini, Zod schemas, conflicts, policies/weights |
| `review` | Human gate before trusted data |
| `deadlines` | Confirmed academic items |
| `reminders` | Offsets and delivery status |
| `calendar` | ICS / Google export records |
| `assistant` | Grounded Q&A + NL search |
| `planner` | Workload, weekly plans, exam prep, suggestions |

Import other modules only through each module’s `index.ts`.

## Non-negotiable product rules

- Never invent a professor deadline, grading policy, or exam date
- Confidence is a model signal, not proof — human review wins
- Suggestions must be labeled as suggestions, not instructor requirements
- Treat syllabus text as untrusted (prompt-injection defense)

## Status

Scaffolded modular layout with stub APIs and pages. Not a finished product.
