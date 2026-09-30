-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run
create table if not exists public.activity_entries (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  official_email      text not null,
  date                date not null,
  step_count          integer not null check (step_count >= 0),
  activity            text not null check (activity in ('Done', 'Not done')),
  activity_count      integer not null check (activity_count >= 0),
  additional_activity text not null default '',
  additional_count    integer,
  created_at          timestamptz not null default now()
);

create index if not exists activity_entries_created_at_idx on public.activity_entries (created_at desc);
create index if not exists activity_entries_email_idx on public.activity_entries (official_email);

-- Only the server (secret key) can access this table; browsers using the publishable key cannot.
alter table public.activity_entries enable row level security;

-- Admin logins (email + password). Passwords are stored as bcrypt hashes, never as plain text.
create extension if not exists pgcrypto;

create table if not exists public.admins (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  password_hash text not null,
  created_at    timestamptz not null default now()
);
alter table public.admins enable row level security;

-- Add an admin (change the email and password, then run):
-- insert into public.admins (email, password_hash)
-- values (lower('admin@yourcompany.com'), crypt('CHOOSE-A-STRONG-PASSWORD', gen_salt('bf', 10)));
--
-- Change a password later:
-- update public.admins set password_hash = crypt('NEW-PASSWORD', gen_salt('bf', 10)) where email = 'admin@yourcompany.com';
