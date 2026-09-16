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