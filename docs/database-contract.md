# SafeCity AI — Database and Access Contract

## Table: reports
- id (uuid, auto)
- reporter_id (uuid, from signed-in user)
- category (text, restricted list)
- description (text, 10–500 characters)
- latitude (private exact)
- longitude (private exact)
- public_latitude (generalized)
- public_longitude (generalized)
- image_path (storage path, not public URL)
- status (pending/approved/rejected/forwarded/resolved)
- verification_count (integer, default 0)
- created_at, updated_at, resolved_at

## What the reports table does

- Citizens can create reports. The database automatically:
  - Connects the report to the current user (reporter_id).
  - Forces the first status to "pending".

- Citizens can read their own reports (any status).
- The public can read only reports where status = "approved".
- Only moderator accounts can change the status of a report.

## Categories
pothole, broken_streetlight, damaged_footpath, garbage,
blocked_pathway, flooding, unsafe_structure, other

## Access rules
- Citizens can create reports with status forced to "pending".
- Public users can read only approved reports, without exact coordinates.
- Only moderators can change status or view exact/private data.
- Report images live in a private bucket; public users cannot access them directly.

## Storage
- Bucket: report-images (private)
- Allowed types: JPEG, PNG
- Max size: 5 MB

## Notes
- RLS will be enabled on all exposed tables.
- Secret key is never used in frontend code.

## Report image storage

Bucket name: `report-images`

Bucket configuration:

- Private bucket
- Maximum file size: 5 MB
- Allowed MIME types:
  - `image/jpeg`
  - `image/png`

Required object path:

`USER_ID/REPORT_ID/RANDOM_FILENAME.EXTENSION`

Access rules:

- An authenticated citizen may upload only inside their own user-ID folder.
- A citizen may read only images they own.
- A moderator may read all report images.
- Public visitors cannot access report images directly.
- File overwriting and deletion are not allowed through the current policies.

Important: The bucket was created through the Supabase Dashboard. Its access policies are stored in `supabase/migrations/20260917_storage_policies.sql`.