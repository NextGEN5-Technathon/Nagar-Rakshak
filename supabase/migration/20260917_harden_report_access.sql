begin;

-- =========================================================
-- 1. PROTECT THE USER_ROLES TABLE
-- =========================================================

alter table public.user_roles enable row level security;

-- Frontend users must not directly read, add, change or delete roles.
revoke all on table public.user_roles from anon, authenticated;


-- =========================================================
-- 2. CREATE A SAFE MODERATOR CHECK
-- =========================================================

-- Functions inside this private schema are not exposed as normal tables.
create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_moderator()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = 'moderator'
  );
$$;

revoke all
on function private.is_moderator()
from public;

grant execute
on function private.is_moderator()
to authenticated;


-- =========================================================
-- 3. REMOVE DIRECT REPORT UPDATES
-- =========================================================

-- Remove the old policy that allowed moderators to update
-- the entire report row.
drop policy if exists "moderators_can_update_reports"
on public.reports;

-- Frontend users cannot directly update report columns anymore.
revoke update
on table public.reports
from authenticated;


-- =========================================================
-- 4. LIMIT DIRECT REPORT READING TO SAFE COLUMNS
-- =========================================================

-- Remove the previous table-level SELECT permission.
revoke select
on table public.reports
from anon, authenticated;

-- Permit only public-safe columns.
grant select (
  id,
  category,
  description,
  public_latitude,
  public_longitude,
  status,
  verification_count,
  created_at
)
on table public.reports
to anon, authenticated;


-- =========================================================
-- 5. CREATE THE SAFE PUBLIC REPORTS VIEW
-- =========================================================

drop view if exists public.public_reports;

create view public.public_reports
with (security_invoker = true)
as
select
  id,
  category,
  description,
  public_latitude,
  public_longitude,
  status,
  verification_count,
  created_at
from public.reports
where status = 'approved';

revoke all
on table public.public_reports
from public, anon, authenticated;

grant select
on table public.public_reports
to anon, authenticated;


-- =========================================================
-- 6. CREATE MODERATOR-ONLY STATUS UPDATE FUNCTION
-- =========================================================

create or replace function public.update_report_status(
  p_report_id uuid,
  p_status text
)
returns public.reports
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_report public.reports;
begin
  -- Stop immediately if the current user is not a moderator.
  if not private.is_moderator() then
    raise exception 'Moderator authorization required'
      using errcode = '42501';
  end if;

  -- Reject unknown status values.
  if p_status not in (
    'pending',
    'approved',
    'rejected',
    'forwarded',
    'resolved'
  ) then
    raise exception 'Invalid report status';
  end if;

  -- Update only the status and system-managed timestamps.
  update public.reports
  set
    status = p_status,
    updated_at = now(),
    resolved_at = case
      when p_status = 'resolved' then now()
      else null
    end
  where id = p_report_id
  returning * into updated_report;

  if not found then
    raise exception 'Report not found';
  end if;

  return updated_report;
end;
$$;

-- Nobody receives permission automatically.
revoke all
on function public.update_report_status(uuid, text)
from public;

-- Authenticated users can call it, but the function itself checks
-- whether the caller is actually a moderator.
grant execute
on function public.update_report_status(uuid, text)
to authenticated;

commit;