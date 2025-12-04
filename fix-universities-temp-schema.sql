-- ============================================
-- FIX: Add ID column to universities_temp
-- ============================================

-- Step 1: Add an auto-incrementing ID column
ALTER TABLE universities_temp 
ADD COLUMN id SERIAL PRIMARY KEY;

-- Step 2: Create indexes for performance
CREATE INDEX idx_universities_temp_name ON universities_temp(name);
CREATE INDEX idx_universities_temp_state ON universities_temp(state);
CREATE INDEX idx_universities_temp_country ON universities_temp(country);

-- Step 3: Disable RLS or add SELECT policy (choose one)

-- Option A: Disable RLS entirely (simpler for development)
ALTER TABLE universities_temp DISABLE ROW LEVEL SECURITY;

-- Option B: Add RLS policy to allow public SELECT (more secure)
-- Uncomment these if you want to keep RLS enabled:
-- CREATE POLICY "Allow public read access to universities_temp"
--   ON universities_temp
--   FOR SELECT
--   TO public
--   USING (true);

-- Step 4: Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'universities_temp'
  AND column_name = 'id';

-- Step 5: Check sample data with new IDs
SELECT id, name, state, city, acceptance_rate
FROM universities_temp
LIMIT 5;
