-- Run once in Supabase: SQL Editor -> New query -> paste -> Run

-- 1. Admin logins (email + password)
create table if not exists public.admins (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  password_hash text not null,   -- TEMP: plain text while hashing is disabled in app/api/login/route.ts
  created_at    timestamptz not null default now()
);
alter table public.admins enable row level security;

-- 2. Form templates and their submissions
create table if not exists public.form_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  fields jsonb not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.form_templates(id),
  data jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists submissions_template_idx on public.submissions (template_id, created_at desc);
alter table public.form_templates enable row level security;
alter table public.submissions enable row level security;

-- 3. First template: Daily Activity
insert into public.form_templates (name, slug, fields) values ('Daily Activity', 'daily-activity', '[
 {"key":"name","label":"Name","type":"text","required":true},
 {"key":"official_email","label":"Official mail ID","type":"email","required":true},
 {"key":"date","label":"Date","type":"date","required":true},
 {"key":"step_count","label":"Step count","type":"number","required":true},
 {"key":"activity","label":"Activity","type":"select","required":true,"options":["Done","Not done"]},
 {"key":"activity_count","label":"Activity count","type":"number","required":true},
 {"key":"additional_activity","label":"Additional activity","type":"text"},
 {"key":"additional_count","label":"Count","type":"number"}
]') on conflict (slug) do nothing;

-- 4. Add your admin (change the email and password, then run this line)
-- insert into public.admins (email, password_hash) values (lower('admin@yourcompany.com'), 'YOUR-PASSWORD');
