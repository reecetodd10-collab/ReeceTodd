-- Create supplement_optimization_results table
CREATE TABLE IF NOT EXISTS supplement_optimization_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  clerk_user_id TEXT,
  email TEXT,
  primary_goal TEXT,
  optimization_score INTEGER,
  primary_bottleneck TEXT,
  inputs JSONB,
  scores JSONB,
  recommended_products JSONB,
  added_to_cart BOOLEAN DEFAULT false,
  purchased BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE supplement_optimization_results ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_optimization_results_clerk_user_id ON supplement_optimization_results(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_optimization_results_created_at ON supplement_optimization_results(created_at);
CREATE INDEX IF NOT EXISTS idx_optimization_results_email ON supplement_optimization_results(email);

-- RLS Policies
-- Service role can do everything
CREATE POLICY "Service role can manage optimization results" ON supplement_optimization_results
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- For client-side access, we'll favor API route security (Clerk)
-- But for defense-in-depth, we can add a policy if needed later.
