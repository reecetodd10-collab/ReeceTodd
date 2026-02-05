-- Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  published_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on published_date for faster sorting
CREATE INDEX IF NOT EXISTS newsletters_published_date_idx ON newsletters(published_date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to newsletters
CREATE POLICY "Allow public read access to newsletters"
ON newsletters
FOR SELECT
USING (true);

-- Create policy to allow authenticated users with service role to insert/update/delete
-- (This will be used by your API endpoints with the service role key)
CREATE POLICY "Allow service role full access to newsletters"
ON newsletters
FOR ALL
USING (auth.role() = 'service_role');

-- Add comments for documentation
COMMENT ON TABLE newsletters IS 'Stores Aviera newsletter editions';
COMMENT ON COLUMN newsletters.id IS 'Unique identifier for the newsletter';
COMMENT ON COLUMN newsletters.title IS 'Newsletter title/headline';
COMMENT ON COLUMN newsletters.content IS 'Full newsletter content (supports markdown/HTML)';
COMMENT ON COLUMN newsletters.excerpt IS 'Brief preview/summary of the newsletter';
COMMENT ON COLUMN newsletters.published_date IS 'Date when the newsletter was published';
COMMENT ON COLUMN newsletters.created_at IS 'Timestamp when the record was created';
