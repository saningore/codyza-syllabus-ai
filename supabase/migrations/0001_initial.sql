-- STARTER SCHEMA. Review policies, indexes, migrations and production safety before deployment.
create extension if not exists pgcrypto;
create table public.semesters (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 name text not null, starts_on date, ends_on date, timezone text not null default 'America/Los_Angeles', created_at timestamptz not null default now()
);
create table public.courses (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 semester_id uuid not null references public.semesters(id) on delete cascade,
 code text not null, title text not null, instructor text, section text, created_at timestamptz not null default now(),
 unique (id, user_id)
);
create table public.syllabus_files (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 course_id uuid not null references public.courses(id) on delete cascade,
 original_name text not null, mime_type text not null, storage_path text not null,
 status text not null default 'queued' check (status in ('queued','processing','review_needed','completed','failed')),
 uploaded_at timestamptz not null default now(), unique (id,user_id)
);
create table public.deadlines (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 course_id uuid not null references public.courses(id) on delete cascade,
 source_file_id uuid references public.syllabus_files(id) on delete set null,
 title text not null, item_type text not null, due_at timestamptz, confidence numeric(4,3),
 confirmation_state text not null default 'unreviewed' check (confirmation_state in ('unreviewed','confirmed','rejected')),
 source_page integer, source_snippet text, created_at timestamptz not null default now()
);
create table public.extraction_issues (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 deadline_id uuid references public.deadlines(id) on delete cascade, file_id uuid references public.syllabus_files(id) on delete cascade,
 issue_type text not null, description text not null, resolved_at timestamptz
);
create table public.corrections (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 deadline_id uuid not null references public.deadlines(id) on delete cascade,
 field_name text not null, original_value jsonb, corrected_value jsonb, changed_at timestamptz not null default now()
);
create table public.reminders (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 deadline_id uuid not null references public.deadlines(id) on delete cascade,
 remind_at timestamptz not null, status text not null default 'scheduled' check(status in ('scheduled','sent','cancelled'))
);
create table public.calendar_exports (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 deadline_id uuid not null references public.deadlines(id) on delete cascade,
 provider text not null default 'ics', external_event_id text, exported_at timestamptz not null default now()
);
create table public.source_chunks (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 file_id uuid not null references public.syllabus_files(id) on delete cascade,
 page_number integer, chunk_index integer not null, content text not null
);
-- Owner-only row access. Foreign-key ownership consistency must ALSO be enforced in API validation / DB triggers.
do $$ declare t text; begin
 foreach t in array array['semesters','courses','syllabus_files','deadlines','extraction_issues','corrections','reminders','calendar_exports','source_chunks'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('create policy "owner_select" on public.%I for select to authenticated using (user_id = (select auth.uid()))',t);
  execute format('create policy "owner_insert" on public.%I for insert to authenticated with check (user_id = (select auth.uid()))',t);
  execute format('create policy "owner_update" on public.%I for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))',t);
  execute format('create policy "owner_delete" on public.%I for delete to authenticated using (user_id = (select auth.uid()))',t);
 end loop;
end $$;
-- Create a PRIVATE storage bucket named 'syllabuses' and its ownership-aware policies separately.
-- IMPORTANT: current RLS checks row ownership only; verify cross-table references belong to the same user.
