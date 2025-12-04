-- ============================================
-- FIX: Update user_targets (CORRECTED VERSION)
-- ============================================

-- Step 1: Drop the old foreign key constraint
ALTER TABLE user_targets 
DROP CONSTRAINT IF EXISTS user_targets_university_id_fkey;

-- Step 2: Delete all existing user_targets (they reference old UUIDs)
-- WARNING: This clears your existing university targets
DELETE FROM user_targets;

-- Step 3: Drop and recreate the university_id column as INTEGER
ALTER TABLE user_targets 
DROP COLUMN university_id;

ALTER TABLE user_targets 
ADD COLUMN university_id INTEGER NOT NULL;

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
ORDER BY ordinal_position;
