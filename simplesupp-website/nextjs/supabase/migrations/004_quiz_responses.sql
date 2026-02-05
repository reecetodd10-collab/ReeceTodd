-- Quiz Responses Table for AI Personalization
-- Stores user quiz answers to enable personalized supplement and workout recommendations

CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Can also store responses for non-logged-in users via session/email
  session_id TEXT,
  email TEXT,

  -- Fitness Goals (multi-select possible)
  goals JSONB DEFAULT '[]',  -- e.g., ["build_muscle", "lose_fat", "energy", "focus", "recovery", "longevity"]

  -- User Profile
  experience_level TEXT,      -- "beginner", "intermediate", "advanced"
  age_range TEXT,             -- "18-24", "25-34", "35-44", "45-54", "55+"
  gender TEXT,                -- "male", "female", "other", "prefer_not_to_say"

  -- Activity & Lifestyle
  workout_frequency TEXT,     -- "none", "1-2_weekly", "3-4_weekly", "5+_weekly"
  workout_types JSONB DEFAULT '[]',  -- e.g., ["strength", "cardio", "hiit", "yoga", "sports"]
  sleep_quality TEXT,         -- "poor", "fair", "good", "excellent"
  stress_level TEXT,          -- "low", "moderate", "high"

  -- Diet & Restrictions
  diet_type TEXT,             -- "omnivore", "vegetarian", "vegan", "keto", "paleo", etc.
  dietary_restrictions JSONB DEFAULT '[]',  -- e.g., ["gluten_free", "dairy_free", "nut_allergy"]

  -- Current Supplement Usage
  current_supplements JSONB DEFAULT '[]',  -- what they already take
  past_supplements JSONB DEFAULT '[]',     -- what they've tried before

  -- Budget & Preferences
  budget TEXT,                -- "budget", "moderate", "premium", "no_limit"
  supplement_form_preference JSONB DEFAULT '[]',  -- e.g., ["capsules", "powder", "gummies"]

  -- Health Considerations (important for safe recommendations)
  health_conditions JSONB DEFAULT '[]',  -- e.g., ["high_blood_pressure", "diabetes"]
  medications JSONB DEFAULT '[]',        -- for interaction checks

  -- AI-Generated Recommendations (stored after processing)
  recommended_stack JSONB,    -- AI-generated supplement recommendations
  recommended_workouts JSONB, -- AI-generated workout recommendations

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_quiz_responses_user_id ON quiz_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_session_id ON quiz_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_email ON quiz_responses(email);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_created_at ON quiz_responses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow authenticated users to view and manage their own quiz responses
CREATE POLICY "Users can view own quiz responses" ON quiz_responses
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert quiz responses" ON quiz_responses
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own quiz responses" ON quiz_responses
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE quiz_responses IS 'Stores quiz answers for personalized AI supplement and workout recommendations';
COMMENT ON COLUMN quiz_responses.goals IS 'Array of fitness goals: build_muscle, lose_fat, energy, focus, recovery, longevity';
COMMENT ON COLUMN quiz_responses.recommended_stack IS 'AI-generated supplement recommendations based on quiz answers';
COMMENT ON COLUMN quiz_responses.recommended_workouts IS 'AI-generated workout recommendations based on quiz answers';
