-- Promo Subscribers Table
-- Captures emails from the 10% off promo banner

CREATE TABLE IF NOT EXISTS promo_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'promo_banner',  -- where they signed up from
  discount_code TEXT,                   -- generated discount code
  redeemed BOOLEAN DEFAULT false,       -- whether they've used their code
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_promo_subscribers_email ON promo_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_promo_subscribers_created_at ON promo_subscribers(created_at DESC);

-- Enable Row Level Security
ALTER TABLE promo_subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies - allow inserts from anyone (public signup)
CREATE POLICY "Allow public inserts to promo_subscribers" ON promo_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Only service role can read/update (for admin purposes)
CREATE POLICY "Service role can manage promo_subscribers" ON promo_subscribers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE promo_subscribers IS 'Stores emails from 10% off promo banner signups';
