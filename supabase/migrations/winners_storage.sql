-- Create the winner-proofs bucket
insert into storage.buckets (id, name, public)
values ('winner-proofs', 'winner-proofs', true);

-- Policy to allow authenticated users to upload their own proofs
-- Path format: {user_id}/{winner_id}.{ext}
create policy "Users can upload their own proofs"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'winner-proofs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow admins to read all proofs in the bucket
create policy "Admins can read all proofs"
on storage.objects for select
to authenticated
using (
  bucket_id = 'winner-proofs' AND
  (
    select is_admin from public.profiles where id = auth.uid()
  ) = true
);

-- Policy to allow users to read their own proofs
create policy "Users can read their own proofs"
on storage.objects for select
to authenticated
using (
  bucket_id = 'winner-proofs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
