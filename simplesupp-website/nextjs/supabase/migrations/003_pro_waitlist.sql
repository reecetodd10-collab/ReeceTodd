-- Create pro_waitlist table for AVIERA PRO waitlist
CREATE TABLE IF NOT EXISTS pro_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  profile_type TEXT,
  goal TEXT,
  challenge TEXT,
  past_attempts TEXT,
  budget TEXT,
  marketing_consent BOOLEAN DEFAULT false
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pro_waitlist_email ON pro_waitlist(email);
CREATE INDEX IF NOT EXISTS idx_pro_waitlist_created_at ON pro_waitlist(created_at DESC);

-- Add columns to pro_waitlist if they don't exist (for existing tables)
ALTER TABLE pro_waitlist 
ADD COLUMN IF NOT EXISTS profile_type TEXT,
ADD COLUMN IF NOT EXISTS goal TEXT,
ADD COLUMN IF NOT EXISTS challenge TEXT,
ADD COLUMN IF NOT EXISTS past_attempts TEXT,
ADD COLUMN IF NOT EXISTS budget TEXT,
ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false;

