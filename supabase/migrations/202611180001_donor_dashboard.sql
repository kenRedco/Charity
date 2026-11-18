create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.donor_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  anonymous_by_default boolean not null default true,
  email_donation_updates boolean not null default false,
  email_impact_updates boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  network text not null check (network in ('ETH', 'BTC', 'SOL', 'TRX', 'XRP')),
  transaction_hash text not null,
  symbol text not null check (symbol in ('ETH', 'BTC', 'SOL', 'TRX', 'XRP')),
  amount numeric(78, 36),
  recipient_address text,
  verification_status text not null default 'pending'
    check (verification_status in ('pending', 'verified')),
  confirmed_at timestamptz,
  explorer_url text,
  is_anonymous boolean not null default true,
  created_at timestamptz not null default now(),
  unique (network, transaction_hash),
  check (amount is null or amount > 0),
  check (
    (verification_status = 'pending')
    or (amount is not null and recipient_address is not null and confirmed_at is not null)
  )
);

create index if not exists donations_user_confirmed_idx
  on public.donations (user_id, confirmed_at desc);
create index if not exists donations_user_project_idx
  on public.donations (user_id, project_id)
  where project_id is not null;

alter table public.projects enable row level security;
alter table public.donor_preferences enable row level security;
alter table public.donations enable row level security;

drop policy if exists "Anyone can view active projects" on public.projects;
create policy "Anyone can view active projects"
  on public.projects for select
  using (is_active = true);

drop policy if exists "Donors can view projects they supported" on public.projects;
create policy "Donors can view projects they supported"
  on public.projects for select to authenticated
  using (
    exists (
      select 1
      from public.donations
      where donations.project_id = projects.id
        and donations.user_id = auth.uid()
    )
  );

drop policy if exists "Donors can view their own preferences" on public.donor_preferences;
create policy "Donors can view their own preferences"
  on public.donor_preferences for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Donors can create their own preferences" on public.donor_preferences;
create policy "Donors can create their own preferences"
  on public.donor_preferences for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Donors can update their own preferences" on public.donor_preferences;
create policy "Donors can update their own preferences"
  on public.donor_preferences for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Donors can delete their own preferences" on public.donor_preferences;
create policy "Donors can delete their own preferences"
  on public.donor_preferences for delete to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Donors can view their own donations" on public.donations;
create policy "Donors can view their own donations"
  on public.donations for select to authenticated
  using (auth.uid() = user_id);

revoke all on public.projects from anon, authenticated;
grant select on public.projects to anon, authenticated;
grant all on public.projects to service_role;

revoke all on public.donor_preferences from anon, authenticated;
grant select, insert, update, delete on public.donor_preferences to authenticated;
grant all on public.donor_preferences to service_role;

revoke all on public.donations from anon, authenticated;
grant select on public.donations to authenticated;
grant all on public.donations to service_role;
