-- Migration: Add newsletter categories support
-- Categories: supplements, fitness, fitness_socials

-- 1. Add category column to newsletters table
ALTER TABLE newsletters
  ADD COLUMN category TEXT NOT NULL DEFAULT 'supplements';

-- Add check constraint for valid category values
ALTER TABLE newsletters
  ADD CONSTRAINT newsletters_category_check
  CHECK (category IN ('supplements', 'fitness', 'fitness_socials'));

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS newsletters_category_idx ON newsletters(category);

-- Create composite index for category + published_date (common query pattern)
CREATE INDEX IF NOT EXISTS newsletters_category_published_idx ON newsletters(category, published_date DESC);

-- Add column comments
COMMENT ON COLUMN newsletters.category IS 'Newsletter category: supplements, fitness, or fitness_socials';

-- 2. Add category subscription preferences to newsletter_subscribers
ALTER TABLE newsletter_subscribers
  ADD COLUMN sub_supplements BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN sub_fitness BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN sub_fitness_socials BOOLEAN NOT NULL DEFAULT true;

-- Add column comments
COMMENT ON COLUMN newsletter_subscribers.sub_supplements IS 'Subscribed to Supplements & Peptides newsletter';
COMMENT ON COLUMN newsletter_subscribers.sub_fitness IS 'Subscribed to Fitness/workout newsletter';
COMMENT ON COLUMN newsletter_subscribers.sub_fitness_socials IS 'Subscribed to Fitness influencer/social media news (soosh, alex eubank, togi, tren twins, adamkyu)';
