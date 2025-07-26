-- Create role enum
CREATE TYPE public.app_role AS ENUM ('superuser', 'artist', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create artist_requests table
CREATE TABLE public.artist_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_requests ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Superusers can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'superuser'));

CREATE POLICY "Superusers can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'superuser'));

CREATE POLICY "Superusers can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'superuser'));

-- RLS policies for artist_requests
CREATE POLICY "Users can view their own requests"
ON public.artist_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Superusers can view all requests"
ON public.artist_requests
FOR SELECT
USING (public.has_role(auth.uid(), 'superuser'));

CREATE POLICY "Users can create their own requests"
ON public.artist_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Superusers can update requests"
ON public.artist_requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'superuser'));

-- Function to automatically assign user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Trigger for new user role assignment
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Update function for artist_requests
CREATE TRIGGER update_artist_requests_updated_at
BEFORE UPDATE ON public.artist_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();