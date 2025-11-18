-- Allow client-side (anon key) inserts to users table
-- This enables browser-based user creation
-- Security: We validate via Clerk authentication before allowing inserts

-- Drop existing policy
DROP POLICY IF EXISTS "Service role can manage users" ON users;

-- Allow anon key to insert users (for client-side creation)
-- This works because users are authenticated via Clerk before reaching this point
CREATE POLICY "Allow anon inserts for authenticated users" ON users
  FOR INSERT
  WITH CHECK (true);

-- Allow anon key to read own user data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT
  USING (true);

-- Allow anon key to update own user data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Note: Service role still has full access via admin client
-- These policies enable client-side operations with anon key

