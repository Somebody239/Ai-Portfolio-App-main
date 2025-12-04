# Database Diagnostic Summary & Action Plan

## 🔍 Key Findings

### CRITICAL ISSUE #1: Missing ID Column
**Problem**: The `universities_temp` table has NO `id` column  
**Impact**: All university queries fail  
**Evidence**: Query #4 and #13 both error with "column 'id' does not exist"  
**Root Cause**: Table was imported from CSV without adding a primary key

### CRITICAL ISSUE #2: RLS Blocking All Reads
**Problem**: Row Level Security is enabled but has no SELECT policy  
**Impact**: Even with an ID, nobody can read the data  
**Evidence**: Query #8 shows `rowsecurity: true`, Query #7 shows no policies  

### CRITICAL ISSUE #3: Data Type Mismatches
**Problem**: Many numeric fields are stored as TEXT  
**Impact**: Need type conversions in application code  
**Examples**:
- `avg_gpa`: text (should be numeric)
- `avg_sat`: text (should be numeric)  
- `admissions_sat_math_25th`: text (should be numeric)
- `grad_students`: text (should be integer)
- `demographics_female_share`: text (should be numeric)

### CRITICAL ISSUE #4: Foreign Key Mismatch
**Problem**: `user_targets.university_id` points to old `universities` table (UUID), not `universities_temp` (integer)  
**Impact**: Cannot create relationships between user targets and university data  
**Evidence**: Query #14 shows FK to `universities.id`, not `universities_temp`

---

## ✅ Good News

1. **Data exists**: 1,612 universities are in the table
2. **Data quality**: Sample queries show universities with rich data
3. **Structure**: All 116 columns are properly named and accessible

---

## 🛠️ Required Actions

### STEP 1: Run Database Migration (IMMEDIATE)

```bash
# In Supabase SQL Editor, run:
```
```sql
-- Add ID column with auto-increment
ALTER TABLE universities_temp 
ADD COLUMN id SERIAL PRIMARY KEY;

-- Disable RLS (simpler option for development)
ALTER TABLE universities_temp DISABLE ROW LEVEL SECURITY;

-- OR keep RLS and add SELECT policy
CREATE POLICY "Allow public read access"
  ON universities_temp
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_universities_temp_name ON universities_temp(name);
CREATE INDEX idx_universities_temp_state ON universities_temp(state);
CREATE INDEX idx_universities_temp_country ON universities_temp(country);
```

### STEP 2: Verify the Fix

```sql
-- Check ID column exists
SELECT id, name, state, acceptance_rate
FROM universities_temp
LIMIT 5;

-- Should return data successfully with auto-generated IDs (1, 2, 3, etc.)
```

---

## 📊 Database Schema Summary

### universities_temp (BEFORE fix)
- **Total Rows**: 1,612
- **Primary Key**: ❌ NONE (CRITICAL)
- **Indexes**: ❌ NONE
- **RLS**: ✅ Enabled (but blocking reads)
- **Data Quality**: ✅ Good (see sample data)

### user_targets (Current)
- **Primary Key**: `id` (UUID)
- **Foreign Keys**:
  - `user_id` → `users.id` (UUID) ✅
  - `university_id` → `universities.id` (UUID) ⚠️ Points to OLD table!

---

## 🔄 Migration Impact

### What Changes
- `universities_temp` gets `id` column (integer, auto-increment)
- RLS disabled OR SELECT policy added
- Performance indexes created

### What DOESN'T Change
-  `user_targets` still uses UUIDs (references old `universities` table)
- Existing user targets won't automatically work with new data
- Need migration strategy for existing user data

---

## 🎯 Code Updates Needed (AFTER database fix)

### Already Updated ✅
1. `lib/types.ts` - University interface uses `number` for ID
2. `lib/supabase/repositories/universities.repository.ts` - Queries `universities_temp`
3. `components/modals/universities/UniversitySelectModal.tsx` - Accepts `number[]` for exclude IDs
4. `views/DashboardView.tsx` - Works with number IDs

### Still Needs Update 🔧
1. `lib/supabase/database.types.ts` - Add `id: number` to universities_temp type
2. Repository number parsing for Text-stored-numbers (avg_sat, avg_gpa, etc.)

---

## 📝 Sample Data (For Reference)

```json
{
  "name": "Abilene Christian University",
  "state": "TX",
  "city": "Abilene",
  "acceptance_rate": 63.88,
  "tuition": 42380,
  "avg_gpa": "3",
  "avg_sat": "1189",
  "avg_act": "25",
  "student_size": 3129,
  "graduation_rate": 60.21,
  "majors_offered": ["Agriculture", "Communications", ...]
}
```

---

## 🚀 Next Steps

1. **RUN** `fix-universities-temp-schema.sql` in Supabase SQL Editor
2. **VERIFY** universities appear in the app's "Add University" modal
3. **TEST** adding a university to your target list
4. **MONITOR** for any type conversion errors with text-stored numbers
5. **DECIDE** migration strategy for existing `user_targets` data

---

## ❓ Questions for User

1. Do you want to keep existing user targets (UUIDs from old `universities` table)?
2. Should we migrate old targets to new table, or start fresh?
3. Do you want RLS enabled or disabled on `universities_temp`?

---

**Created**: 2025-12-03  
**Status**: Awaiting database migration  
**Files**: 
- Migration SQL: `fix-universities-temp-schema.sql`
- Diagnostic Queries: `database-diagnostic-queries.sql`
- Documentation: `docs/database-schema.md` (updated)
