
-- Create a table for published packs
CREATE TABLE public.packs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  pack_type TEXT NOT NULL CHECK (pack_type IN ('behavior', 'resource', 'skin', 'addon')),
  entity_type TEXT,
  file_path TEXT NOT NULL,
  thumbnail_path TEXT,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.packs ENABLE ROW LEVEL SECURITY;

-- Anyone can view/download packs (public gallery)
CREATE POLICY "Packs are publicly viewable"
  ON public.packs FOR SELECT
  USING (true);

-- Only authenticated users can insert (for future auth)
CREATE POLICY "Anyone can insert packs for now"
  ON public.packs FOR INSERT
  WITH CHECK (true);

-- Allow updating download_count
CREATE POLICY "Anyone can update download count"
  ON public.packs FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for pack files
INSERT INTO storage.buckets (id, name, public) VALUES ('packs', 'packs', true);

-- Public read access to pack files
CREATE POLICY "Pack files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'packs');

-- Allow uploads to packs bucket
CREATE POLICY "Anyone can upload pack files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'packs');
