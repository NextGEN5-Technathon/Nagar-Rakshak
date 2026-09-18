begin;

-- Remove older policies if this migration is rerun.
drop policy if exists "citizens_upload_own_report_images"
on storage.objects;

drop policy if exists "citizens_read_own_report_images"
on storage.objects;

drop policy if exists "moderators_read_report_images"
on storage.objects;


-- Citizens can upload only into their own folder.
--
-- Required file path:
-- USER_ID/REPORT_ID/RANDOM_FILENAME.jpg
create policy "citizens_upload_own_report_images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'report-images'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png')
);


-- Citizens can read images they uploaded themselves.
create policy "citizens_read_own_report_images"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'report-images'
  and owner_id = (select auth.uid()::text)
);


-- Moderators can read every image in this bucket.
create policy "moderators_read_report_images"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'report-images'
  and private.is_moderator()
);

commit;