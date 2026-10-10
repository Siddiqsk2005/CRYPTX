create extension if not exists pgcrypto;

create table if not exists public.scan_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  input_text text not null,
  threat_score integer not null check (threat_score between 0 and 100),
  risk_level text not null check (risk_level in ('Low', 'Medium', 'High')),
  classification text not null check (classification in ('safe', 'suspicious', 'dangerous')),
  explanation text not null,
  source text not null default 'flask',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists scan_history_user_id_created_at_idx
  on public.scan_history (user_id, created_at desc);

alter table public.scan_history enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'scan_history'
      and policyname = 'Users can view their own scans'
  ) then
    create policy "Users can view their own scans"
      on public.scan_history
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'scan_history'
      and policyname = 'Users can insert their own scans'
  ) then
    create policy "Users can insert their own scans"
      on public.scan_history
      for insert
      with check (auth.uid() = user_id);
  end if;
end $$;
