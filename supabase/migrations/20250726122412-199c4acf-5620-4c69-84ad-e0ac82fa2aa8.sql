-- Add additional fields to profiles table for artist information
ALTER TABLE public.profiles 
ADD COLUMN location TEXT,
ADD COLUMN specialty TEXT,
ADD COLUMN exhibitions TEXT[],
ADD COLUMN awards TEXT[],
ADD COLUMN education TEXT,
ADD COLUMN website_url TEXT,
ADD COLUMN social_links JSONB;