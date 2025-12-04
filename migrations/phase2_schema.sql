-- Phase 2: Core Features - Database Migration
-- Run this SQL in your Supabase SQL Editor

-- 1. Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_frequency TEXT CHECK (email_frequency IN ('daily', 'weekly', 'never')) DEFAULT 'weekly',
  theme TEXT CHECK (theme IN ('dark', 'light')) DEFAULT 'dark',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Ensure opportunities table has correct columns (idempotent)
-- We use DO blocks to check if columns exist before adding them to avoid errors if they already exist

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opportunities' AND column_name = 'type') THEN
        ALTER TABLE opportunities ADD COLUMN type TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opportunities' AND column_name = 'location') THEN
        ALTER TABLE opportunities ADD COLUMN location TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opportunities' AND column_name = 'start_date') THEN
        ALTER TABLE opportunities ADD COLUMN start_date DATE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opportunities' AND column_name = 'end_date') THEN
        ALTER TABLE opportunities ADD COLUMN end_date DATE;
    END IF;
END $$;

-- 3. Create personality_inputs table if it doesn't exist (it should, but just in case)
CREATE TABLE IF NOT EXISTS personality_inputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_personality_inputs_user_id ON personality_inputs(user_id);
