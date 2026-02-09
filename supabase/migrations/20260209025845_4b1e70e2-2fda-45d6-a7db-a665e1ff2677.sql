ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'online';

NOTIFY pgrst, 'reload schema';