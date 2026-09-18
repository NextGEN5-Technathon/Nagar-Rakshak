-- =========================================================
-- SAFECITY DEVELOPMENT SEED DATA
-- Creates a non-login placeholder user and sample reports.
-- Safe to run repeatedly.
-- =========================================================

begin;

-- Fixed placeholder user for seeded records.
-- This user has no password and cannot log in normally.
insert into auth.users (
  id,
  email,
  raw_user_meta_data
)
values (
  '00000000-0000-4000-8000-000000000001',
  'safecity-seed@example.invalid',
  '{"seed_user": true}'::jsonb
)
on conflict (id) do nothing;


-- Delete only records created by this seed file.
delete from public.reports
where reporter_id = '00000000-0000-4000-8000-000000000001';


-- Insert one report for each status needed by the demo.
insert into public.reports (
  reporter_id,
  category,
  description,
  latitude,
  longitude,
  public_latitude,
  public_longitude,
  status
)
values
  (
    '00000000-0000-4000-8000-000000000001',
    'broken_streetlight',
    '[SEED] Broken street light near market',
    19.076000,
    72.877700,
    19.076,
    72.878,
    'approved'
  ),
  (
    '00000000-0000-4000-8000-000000000001',
    'pothole',
    '[SEED] Large pothole on main road',
    19.115500,
    72.848600,
    19.116,
    72.849,
    'pending'
  ),
  (
    '00000000-0000-4000-8000-000000000001',
    'garbage',
    '[SEED] Garbage pile blocking footpath',
    19.033000,
    73.029600,
    19.033,
    73.030,
    'rejected'
  ),
  (
    '00000000-0000-4000-8000-000000000001',
    'blocked_pathway',
    '[SEED] Dark isolated bus stop',
    18.922000,
    72.834700,
    18.922,
    72.835,
    'resolved'
  );

commit;