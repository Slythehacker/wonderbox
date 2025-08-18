-- Create storage buckets for movies and related content
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES 
  ('movies', 'movies', false, 5368709120, ARRAY['video/mp4', 'video/webm', 'video/ogg']),
  ('trailers', 'trailers', true, 1073741824, ARRAY['video/mp4', 'video/webm', 'video/ogg']),
  ('posters', 'posters', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('thumbnails', 'thumbnails', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Create RLS policies for movie storage
CREATE POLICY "Users can view public trailers" ON storage.objects
FOR SELECT USING (bucket_id = 'trailers');

CREATE POLICY "Users can view public posters" ON storage.objects
FOR SELECT USING (bucket_id = 'posters');

CREATE POLICY "Users can view public thumbnails" ON storage.objects
FOR SELECT USING (bucket_id = 'thumbnails');

-- Premium/VIP users can access full movies
CREATE POLICY "Premium users can view movies" ON storage.objects
FOR SELECT USING (
  bucket_id = 'movies' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND subscription_tier IN ('premium', 'vip')
  )
);

-- Admin can upload to all buckets
CREATE POLICY "Admins can upload movies" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'movies' AND 
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  )
);

CREATE POLICY "Admins can upload trailers" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'trailers' AND 
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  )
);

CREATE POLICY "Admins can upload posters" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'posters' AND 
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  )
);

CREATE POLICY "Admins can upload thumbnails" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'thumbnails' AND 
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  )
);

-- Create a table to track movie downloads and storage
CREATE TABLE public.movie_storage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id TEXT NOT NULL UNIQUE,
  movie_title TEXT NOT NULL,
  movie_type TEXT NOT NULL DEFAULT 'movie',
  file_path TEXT,
  trailer_path TEXT,
  poster_path TEXT,
  thumbnail_path TEXT,
  file_size BIGINT,
  quality TEXT DEFAULT '1080p',
  download_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on movie_storage
ALTER TABLE public.movie_storage ENABLE ROW LEVEL SECURITY;

-- Create policies for movie_storage
CREATE POLICY "Everyone can view movie storage info" 
ON public.movie_storage 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage movie storage" 
ON public.movie_storage 
FOR ALL 
USING (auth.uid() IN (
  SELECT user_id FROM public.user_roles WHERE role = 'admin'
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_movie_storage_updated_at
BEFORE UPDATE ON public.movie_storage
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a table to track user download preferences
CREATE TABLE public.user_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  movie_id TEXT NOT NULL,
  quality_preference TEXT DEFAULT '1080p',
  download_requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  download_completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'requested'
);

-- Enable RLS on user_downloads
ALTER TABLE public.user_downloads ENABLE ROW LEVEL SECURITY;

-- Create policies for user_downloads
CREATE POLICY "Users can view their own downloads" 
ON public.user_downloads 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can request downloads" 
ON public.user_downloads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own downloads" 
ON public.user_downloads 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all downloads" 
ON public.user_downloads 
FOR ALL 
USING (auth.uid() IN (
  SELECT user_id FROM public.user_roles WHERE role = 'admin'
));