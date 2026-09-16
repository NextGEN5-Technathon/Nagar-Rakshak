-- 1. Moderators table: who is allowed to act as a moderator
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id),
  role text not null check (role = 'moderator'),
  created_at timestamptz not null default now()
);

-- 2. Lock down the reports table to avoid default access
revoke all on table public.reports from anon, authenticated;

-- Grant only the operations we will control by policies
grant select, insert, update on table public.reports to authenticated;
grant select on table public.reports to anon;

-- 3. Citizens (including anonymous users) can create their own pending reports
create policy "citizens_can_create_pending_reports"
on public.reports
for insert
to authenticated
with check (
  reporter_id = auth.uid()
  and status = 'pending'
);

-- 4. Citizens can read their own reports (any status)
create policy "citizens_can_read_their_reports"
on public.reports
for select
to authenticated
using (
  reporter_id = auth.uid()
);

-- 5. Public (anon + authenticated) can read approved reports
create policy "public_can_read_approved_reports"
on public.reports
for select
to anon, authenticated
using (
  status = 'approved'
);

-- 6. Moderators can update report status (and other fields, for now)
create policy "moderators_can_update_reports"
on public.reports
for update
to authenticated
using (
  exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = 'moderator'
  )
)
with check (
  exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = 'moderator'
  )
);