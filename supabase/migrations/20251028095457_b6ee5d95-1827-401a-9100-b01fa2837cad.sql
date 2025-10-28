-- Add delivery_partner to app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'delivery_partner';

-- Add payment and delivery columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS delivery_partner_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS delivery_lat DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS delivery_lng DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS estimated_delivery_time TIMESTAMP WITH TIME ZONE;

-- Create delivery partners table
CREATE TABLE IF NOT EXISTS delivery_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on delivery_partners
ALTER TABLE delivery_partners ENABLE ROW LEVEL SECURITY;

-- Policies for delivery_partners
CREATE POLICY "Admins can view all delivery partners"
ON delivery_partners FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Delivery partners can view own profile"
ON delivery_partners FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Delivery partners can update own profile"
ON delivery_partners FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert delivery partners"
ON delivery_partners FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(order_id, user_id)
);

-- Enable RLS on reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
CREATE POLICY "Anyone can view reviews"
ON reviews FOR SELECT
USING (true);

CREATE POLICY "Users can create reviews for own orders"
ON reviews FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_id 
    AND orders.user_id = auth.uid()
    AND orders.status = 'delivered'
  )
);

CREATE POLICY "Users can update own reviews"
ON reviews FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
ON reviews FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for delivery_partners updated_at
CREATE TRIGGER update_delivery_partners_updated_at
BEFORE UPDATE ON delivery_partners
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for reviews updated_at
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for delivery_partners (for GPS tracking)
ALTER PUBLICATION supabase_realtime ADD TABLE delivery_partners;

-- Enable realtime for orders (for status updates)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;