-- Create the reports table in the public schema
create table public.reports (
  id uuid primary key default gen_random_uuid(),

  -- Who submitted the report (anonymous user id from Supabase Auth)
  reporter_id uuid not null,

  -- Type of problem being reported
  category text not null check (
    category in (
      'pothole',
      'broken_streetlight',
      'damaged_footpath',
      'garbage',
      'blocked_pathway',
      'flooding',
      'unsafe_structure',
      'other'
    )
  ),

  -- Human description with a sensible length
  description text not null check (
    char_length(description) between 10 and 500
  ),

  -- Exact coordinates (used only by moderators)
  latitude double precision,
  longitude double precision,

  -- Generalized coordinates for public map display
  public_latitude double precision,
  public_longitude double precision,

  -- Path of the image in the private storage bucket
  image_path text,

  -- Workflow status, defaulting to 'pending'
  status text not null default 'pending' check (
    status in (
      'pending',
      'approved',
      'rejected',
      'forwarded',
      'resolved'
    )
  ),

  -- How many community verifications this report has
  verification_count integer not null default 0,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- Helpful indexes: status and public location
create index reports_status_idx
  on public.reports (status);

create index reports_public_location_idx
  on public.reports (public_latitude, public_longitude);

-- Enable row level security on this table.
-- By default, with RLS on and no policies, nothing is accessible.
alter table public.reports enable row level security;