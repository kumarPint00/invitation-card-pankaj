-- Apply this additive migration in the EXISTING Wedding Planner Supabase project.
-- Does not alter, truncate, or replace any existing tables, guests, or planner data.
create extension if not exists pgcrypto;

create table if not exists public.wedding_invitation_guests (
  id uuid primary key default gen_random_uuid(),
  planner_guest_id text not null unique,
  name text not null check (length(name) between 1 and 90),
  phone text,
  party_size integer not null default 1 check (party_size between 1 and 30),
  invitation_token text not null unique default encode(gen_random_bytes(24),'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wedding_invitation_rsvps (
  id uuid primary key default gen_random_uuid(),
  response_key text not null unique,
  guest_id uuid references public.wedding_invitation_guests(id) on delete set null,
  guest_name text not null check (length(guest_name) between 1 and 90),
  phone text,
  response text not null check (response in ('yes','no','maybe')),
  attendees integer not null check (attendees between 0 and 30),
  events text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint declining_zero check (response <> 'no' or (attendees = 0 and cardinality(events) = 0))
);
create index if not exists wedding_invitation_rsvps_guest_idx on public.wedding_invitation_rsvps(guest_id);
create index if not exists wedding_invitation_rsvps_updated_idx on public.wedding_invitation_rsvps(updated_at desc);

create table if not exists public.wedding_invitation_request_limits (
  fingerprint text primary key,
  window_start timestamptz not null default now(),
  hits integer not null default 0
);
-- Atomic rate limit to mitigate anonymous RSVP spam; no raw IP addresses stored.
create or replace function public.invitation_allow_request(p_fingerprint text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare n integer;
begin
  if p_fingerprint is null or length(p_fingerprint) <> 64 then return false; end if;
  insert into public.wedding_invitation_request_limits as r (fingerprint, window_start, hits)
    values (p_fingerprint, now(), 1)
  on conflict (fingerprint) do update
    set window_start = case when r.window_start < now() - interval '1 hour' then now() else r.window_start end,
        hits = case when r.window_start < now() - interval '1 hour' then 1 else r.hits + 1 end
  returning hits into n;
  return n <= 10;
end;
$$;

alter table public.wedding_invitation_guests enable row level security;
alter table public.wedding_invitation_rsvps enable row level security;
alter table public.wedding_invitation_request_limits enable row level security;
-- No anon/authenticated policies: only server-side service role can access these tables.
revoke all on public.wedding_invitation_guests from anon,authenticated;
revoke all on public.wedding_invitation_rsvps from anon,authenticated;
revoke all on public.wedding_invitation_request_limits from anon,authenticated;
revoke execute on function public.invitation_allow_request(text) from public,anon,authenticated;
grant execute on function public.invitation_allow_request(text) to service_role;
