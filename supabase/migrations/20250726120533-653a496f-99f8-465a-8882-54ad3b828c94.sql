-- Create storage bucket for artwork images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('artwork-images', 'artwork-images', true);

-- Create policies for artwork image uploads
CREATE POLICY "Users can upload their own artwork images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'artwork-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Artwork images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'artwork-images');

CREATE POLICY "Users can update their own artwork images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'artwork-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own artwork images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'artwork-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);