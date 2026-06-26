-- Storage bucket + policies for client before/after photos.
-- Run this in the Supabase Dashboard SQL editor (it needs privileges the anon key lacks).

-- 1. Create a public bucket named "bella-crm" (id must match supabase.storage.from('bella-crm')).
insert into storage.buckets (id, name, public)
values ('bella-crm', 'bella-crm', true)
on conflict (id) do update set public = true;

-- 2. Allow any authenticated user to upload (INSERT) into this bucket.
drop policy if exists "bella_crm_auth_insert" on storage.objects;
create policy "bella_crm_auth_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'bella-crm');

-- 3. Allow public read (SELECT) so getPublicUrl works in the gallery.
drop policy if exists "bella_crm_public_select" on storage.objects;
create policy "bella_crm_public_select"
  on storage.objects for select to public
  using (bucket_id = 'bella-crm');

-- 4. Allow authenticated users to delete their uploads (used by deletePhotoFile).
drop policy if exists "bella_crm_auth_delete" on storage.objects;
create policy "bella_crm_auth_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'bella-crm');
