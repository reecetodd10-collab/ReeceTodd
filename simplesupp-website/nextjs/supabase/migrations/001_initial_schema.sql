-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  premium_status BOOLEAN DEFAULT false,
  subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create supplement_stacks table
CREATE TABLE IF NOT EXISTS supplement_stacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  supplements JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_plans table
CREATE TABLE IF NOT EXISTS workout_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  plan_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create progress_logs table
CREATE TABLE IF NOT EXISTS progress_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_type TEXT NOT NULL,
  log_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_supplement_stacks_user_id ON supplement_stacks(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_user_id ON workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_logs_user_id ON progress_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_logs_log_type ON progress_logs(log_type);

-- RLS Policies for users table
-- Note: Since we're using Clerk (not Supabase Auth), RLS policies are handled at the API level
-- These policies allow service role to manage users, and we enforce security in API routes
CREATE POLICY "Service role can manage users" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- For client-side access, we'll rely on API route authentication (Clerk)
-- RLS is primarily for defense-in-depth

-- RLS Policies for supplement_stacks table
-- Note: Security is enforced at API level with Clerk authentication
-- These policies allow service role access; API routes validate user ownership
CREATE POLICY "Service role can manage stacks" ON supplement_stacks
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for workout_plans table
-- Note: Security is enforced at API level with Clerk authentication
CREATE POLICY "Service role can manage workout plans" ON workout_plans
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for progress_logs table
-- Note: Security is enforced at API level with Clerk authentication
CREATE POLICY "Service role can manage progress logs" ON progress_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

