-- Create restaurant_settings table for storing restaurant configuration
CREATE TABLE public.restaurant_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed for map display)
CREATE POLICY "Anyone can view restaurant settings"
ON public.restaurant_settings
FOR SELECT
USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can insert restaurant settings"
ON public.restaurant_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update restaurant settings"
ON public.restaurant_settings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete restaurant settings"
ON public.restaurant_settings
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_restaurant_settings_updated_at
BEFORE UPDATE ON public.restaurant_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default restaurant location
INSERT INTO public.restaurant_settings (key, value)
VALUES ('restaurant_location', '{"lat": 27.7172, "lng": 85.324, "name": "Our Restaurant", "address": "Kathmandu, Nepal"}');