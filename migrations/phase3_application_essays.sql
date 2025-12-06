-- Phase 3: Application Essays & Essay Assistant
-- Migration to add essay questions and drafts with AI assistance

-- Create application_essays table
CREATE TABLE IF NOT EXISTS application_essays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_source VARCHAR(100) DEFAULT 'Custom',
  word_limit INTEGER CHECK (word_limit > 0 AND word_limit <= 10000),
  user_draft TEXT,
  ai_suggestions TEXT,
  ai_tips TEXT,
  status VARCHAR(50) DEFAULT 'not_started' 
    CHECK (status IN ('not_started', 'drafting', 'reviewing', 'complete')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_essays_user_id ON application_essays(user_id);
CREATE INDEX IF NOT EXISTS idx_essays_status ON application_essays(user_id, status);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_essays_updated_at ON application_essays;
CREATE TRIGGER update_essays_updated_at
  BEFORE UPDATE ON application_essays
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verify schema
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'application_essays' 
-- ORDER BY ordinal_position;
