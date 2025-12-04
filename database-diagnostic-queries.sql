-- ============================================
-- DATABASE DIAGNOSTIC QUERIES
-- Run these in Supabase SQL Editor
-- ============================================

-- 1. CHECK IF universities_temp TABLE EXISTS
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'universities_temp'
) AS table_exists;

-- 2. GET FULL SCHEMA OF universities_temp
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'universities_temp'
ORDER BY ordinal_position;

-- 3. COUNT ROWS IN universities_temp
SELECT COUNT(*) AS total_universities FROM universities_temp;

-- 4. GET SAMPLE DATA (first 5 universities)
SELECT 
    id,
    name,
    state,
    city,
    acceptance_rate,
    avg_sat,
    tuition
FROM universities_temp
LIMIT 5;

-- 5. CHECK PRIMARY KEY AND CONSTRAINTS
SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    tc.is_deferrable,
    tc.initially_deferred
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public'
    AND tc.table_name = 'universities_temp'
ORDER BY tc.constraint_type, tc.constraint_name;

-- 6. CHECK INDEXES ON universities_temp
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
    AND tablename = 'universities_temp';

-- 7. CHECK RLS (Row Level Security) POLICIES on universities_temp
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename = 'universities_temp';

-- 8. CHECK IF RLS IS ENABLED
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename = 'universities_temp';

-- 9. CHECK user_targets TABLE STRUCTURE
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'user_targets'
ORDER BY ordinal_position;

-- 10. GET SAMPLE user_targets DATA
SELECT 
    id,
    user_id,
    university_id,
    created_at
FROM user_targets
LIMIT 5;

-- 11. CHECK DATA TYPE MISMATCH BETWEEN TABLES
SELECT 
    'user_targets' as table_name,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'user_targets'
    AND column_name = 'university_id'
UNION ALL
SELECT 
    'universities_temp' as table_name,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'universities_temp'
    AND column_name = 'id';

-- 12. TEST QUERY THAT APP IS USING
SELECT * FROM universities_temp 
ORDER BY name ASC 
LIMIT 10;

-- 13. CHECK FOR UUID vs INTEGER ID ISSUE
-- This shows the actual data types being used
SELECT 
    pg_typeof(id) as id_type,
    id,
    name
FROM universities_temp
LIMIT 3;

-- 14. CHECK IF ANY FOREIGN KEY CONSTRAINTS EXIST
SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name IN ('user_targets', 'universities_temp');
