-- ============================================
-- FIX: Update user_targets to use integer IDs
-- ============================================

-- Step 1: Drop the old foreign key constraint
ALTER TABLE user_targets 
DROP CONSTRAINT IF EXISTS user_targets_university_id_fkey;

-- Step 2: Change university_id column type from UUID to INTEGER
ALTER TABLE user_targets 
ALTER COLUMN university_id TYPE INTEGER USING NULL;

-- Step 3: Make university_id NOT NULL again
ALTER TABLE user_targets 
ALTER COLUMN university_id SET NOT NULL;

-- Step 4: Add new foreign key pointing to universities_temp
ALTER TABLE user_targets 
ADD CONSTRAINT user_targets_university_id_fkey 
FOREIGN KEY (university_id) 
REFERENCES universities_temp(id) 
ON DELETE CASCADE;

-- Step 5: Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_targets_university_id 
ON user_targets(university_id);

-- Step 6: Verify the changes
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'user_targets'
    AND column_name = 'university_id';
