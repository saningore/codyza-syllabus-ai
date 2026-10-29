# Module ownership rules

1. Put business rules in `modules/<name>/application` and pure types in `domain`.
2. Keep Next.js route handlers thin — call module use-cases, map to HTTP.
3. Cross-cutting helpers live in `shared/` (auth, errors, dates, events).
4. Supabase / Gemini clients live in `lib/` and are imported by infrastructure adapters.
5. Publish change-impact via `shared/events` so reminders/calendar/planner stay in sync.
6. Do not invent deadlines in any module; send uncertainty to `review`.
