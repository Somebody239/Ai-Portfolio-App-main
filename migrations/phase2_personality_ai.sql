-- Phase 2: Portfolio Custom Questions & AI Analysis
-- Migration to add custom question support and AI extraction capability

-- Add is_custom column to distinguish user-created questions from preset questions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'personality_inputs' 
        AND column_name = 'is_custom'
    ) THEN
        ALTER TABLE personality_inputs 
        ADD COLUMN is_custom BOOLEAN DEFAULT false;
        
        -- Backfill existing records as non-custom (preset questions)
        UPDATE personality_inputs 
        SET is_custom = false 
        WHERE is_custom IS NULL;
    END IF;
END $$;

-- Add ai_extracted_data column to store AI analysis results
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'personality_inputs' 
        AND column_name = 'ai_extracted_data'
    ) THEN
        ALTER TABLE personality_inputs 
        ADD COLUMN ai_extracted_data JSONB;
    END IF;
END $$;

-- Create index for efficient querying of custom questions
CREATE INDEX IF NOT EXISTS idx_personality_inputs_user_custom 
ON personality_inputs(user_id, is_custom);

-- Create GIN index for JSONB AI data (for future querying)
CREATE INDEX IF NOT EXISTS idx_personality_inputs_ai_data 
ON personality_inputs USING GIN (ai_extracted_data);

-- Verify schema changes
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'personality_inputs' 
-- ORDER BY ordinal_position;
