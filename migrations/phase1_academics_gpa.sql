-- Phase 1: Academics & GPA System - Database Migration
-- Run this SQL in your Supabase SQL Editor

-- 1. Add curriculum_type column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS curriculum_type TEXT;

-- 2. Add constraint for curriculum_type values
ALTER TABLE users 
ADD CONSTRAINT curriculum_type_check 
  CHECK (curriculum_type IN ('AP', 'IB', 'Both', NULL));

-- 3. Add level column to courses table (if not exists)
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Regular';

-- 4. Add constraint for course level values
ALTER TABLE courses 
ADD CONSTRAINT courses_level_check 
  CHECK (level IN ('Regular', 'Honors', 'AP', 'IB', 'Dual Enrollment'));

-- 5. Add index for curriculum_type (optional, for query performance)
CREATE INDEX IF NOT EXISTS idx_users_curriculum_type 
ON users(curriculum_type);

-- 6. Add index for course level (optional, for query performance)
CREATE INDEX IF NOT EXISTS idx_courses_level 
ON courses(level);

-- Verify the changes
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'curriculum_type';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'level';
