
-- Add gallery column for additional images
ALTER TABLE public.watches ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}';

-- Create public storage bucket for watch images
INSERT INTO storage.buckets (id, name, public)
VALUES ('watch-images', 'watch-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
DROP POLICY IF EXISTS "Public read watch images" ON storage.objects;
CREATE POLICY "Public read watch images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'watch-images');

-- Admin write/update/delete
DROP POLICY IF EXISTS "Admins upload watch images" ON storage.objects;
CREATE POLICY "Admins upload watch images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'watch-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update watch images" ON storage.objects;
CREATE POLICY "Admins update watch images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'watch-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete watch images" ON storage.objects;
CREATE POLICY "Admins delete watch images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'watch-images' AND public.has_role(auth.uid(), 'admin'));
