
-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, '{image/png,image/jpeg,image/gif}')
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = '{image/png,image/jpeg,image/gif}';

-- Create service-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('service-images', 'service-images', true, 5242880, '{image/png,image/jpeg,image/gif}')
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = '{image/png,image/jpeg,image/gif}';

-- Create project-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('project-images', 'project-images', true, 5242880, '{image/png,image/jpeg,image/gif}')
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = '{image/png,image/jpeg,image/gif}';

-- Set up policies for avatars bucket
-- Anyone can read avatars (since they are public)
CREATE POLICY "Public Avatar Read" ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- Only authenticated users can insert their own avatars
CREATE POLICY "Auth Users Avatar Insert" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (auth.uid() = ANY(ARRAY(SELECT unnest(string_to_array(path, '/')) LIMIT 1)::uuid[])));

-- Only authenticated users can update their own avatars
CREATE POLICY "Auth Users Avatar Update" ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND (auth.uid() = ANY(ARRAY(SELECT unnest(string_to_array(path, '/')) LIMIT 1)::uuid[])))
WITH CHECK (bucket_id = 'avatars' AND (auth.uid() = ANY(ARRAY(SELECT unnest(string_to_array(path, '/')) LIMIT 1)::uuid[])));

-- Only authenticated users can delete their own avatars
CREATE POLICY "Auth Users Avatar Delete" ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND (auth.uid() = ANY(ARRAY(SELECT unnest(string_to_array(path, '/')) LIMIT 1)::uuid[])));

-- Set up policies for service-images bucket
-- Anyone can read service images (since they are public)
CREATE POLICY "Public Service Images Read" ON storage.objects
FOR SELECT
USING (bucket_id = 'service-images');

-- Only authenticated users can insert their own service images
CREATE POLICY "Auth Users Service Images Insert" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'service-images' AND (auth.uid()::text = (string_to_array(path, '/'))[2]));

-- Only authenticated users can update their own service images
CREATE POLICY "Auth Users Service Images Update" ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'service-images' AND (auth.uid()::text = (string_to_array(path, '/'))[2]))
WITH CHECK (bucket_id = 'service-images' AND (auth.uid()::text = (string_to_array(path, '/'))[2]));

-- Only authenticated users can delete their own service images
CREATE POLICY "Auth Users Service Images Delete" ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'service-images' AND (auth.uid()::text = (string_to_array(path, '/'))[2]));

-- Set up policies for project-images bucket
-- Anyone can read project images (since they are public)
CREATE POLICY "Public Project Images Read" ON storage.objects
FOR SELECT
USING (bucket_id = 'project-images');

-- Only authenticated users can insert their own project images
CREATE POLICY "Auth Users Project Images Insert" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images' AND (auth.uid()::text = (string_to_array(path, '/'))[2]));

-- Only authenticated users can update their own project images
CREATE POLICY "Auth Users Project Images Update" ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'project-images' AND (auth.uid()::text = (string_to_array(path, '/'))[2]))
WITH CHECK (bucket_id = 'project-images' AND (auth.uid()::text = (string_to_array(path, '/'))[2]));

-- Only authenticated users can delete their own project images
CREATE POLICY "Auth Users Project Images Delete" ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'project-images' AND (auth.uid()::text = (string_to_array(path, '/'))[2]));
