-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)

-- completions: one row per calendar day the user did their prep
create table if not exists completions (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,              -- YYYY-MM-DD
  completed_at timestamptz not null default now()
);

-- settings: single-row table (id=1) for push subscription + preferences
create table if not exists settings (
  id int primary key default 1,
  check (id = 1),                         -- enforce single row
  skip_days int[] not null default '{}',  -- 0=Sun .. 6=Sat
  push_subscription jsonb,                -- PushSubscription object
  notify_times text[] not null default '{"16:00","18:00","20:00","21:30"}'
);

-- Seed the settings row
insert into settings (id) values (1)
on conflict (id) do nothing;

-- Single-user app — no real auth, so RLS just gates via anon key
-- This is sufficient because only this app's anon key can access the data.
alter table completions enable row level security;
alter table settings enable row level security;

create policy "allow all for anon on completions"
  on completions for all
  using (true)
  with check (true);

create policy "allow all for anon on settings"
  on settings for all
  using (true)
  with check (true);
