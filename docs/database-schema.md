# Database Schema Documentation

## Core Tables

### users
Stores user profile information and preferences.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | uuid | PRIMARY KEY | auth.uid() | User's unique identifier |
| name | text | - | NULL | User's full name |
| email | text | UNIQUE | NULL | User's email address |
| intended_major | text | - | NULL | Student's intended major |
| current_gpa | numeric | - | NULL | Manually entered GPA (optional) |
| curriculum_type | text | - | NULL | AP, IB, or Both |
| created_at | timestamp | - | now() | Account creation timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE on `email`
- INDEX on `curriculum_type`

---

### courses
Stores course information. Grade is now nullable and tracked separately via assignments.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | uuid | PRIMARY KEY | gen_random_uuid() | Course unique identifier |
| user_id | uuid | NOT NULL, FK → users(id) | - | Owner of the course |
| name | text | NOT NULL | - | Course name |
| grade | numeric | NULLABLE | NULL | Final grade (0-100), calculated from assignments |
| year | integer | NOT NULL | - | Academic year (9, 10, 11, 12) |
| semester | text | NOT NULL | - | Semester (Fall, Spring, Summer, Winter) |
| level | text | - | 'Regular' | Course level (Regular, Honors, AP, IB, Dual Enrollment) |
| credits | numeric | - | 1.0 | Credit hours for the course |
| created_at | timestamp | - | now() | Record creation timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `user_id`
- INDEX on `year`
- INDEX on `level`
- COMPOSITE INDEX on `user_id, year`
- COMPOSITE INDEX on `year, semester`

---

### assignments
Tracks individual assignments, tests, and assessments for courses.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | uuid | PRIMARY KEY | gen_random_uuid() | Assignment unique identifier |
| course_id | uuid | NOT NULL, FK → courses(id) CASCADE | - | Parent course |
| user_id | uuid | NOT NULL, FK → users(id) CASCADE | - | Owner |
| title | text | NOT NULL | - | Assignment title |
| description | text | - | NULL | Assignment details |
| assignment_type | text | NOT NULL, CHECK | - | Type: homework, quiz, test, project, lab, participation, final_exam, midterm, other |
| total_points | numeric | NOT NULL | 100 | Maximum points possible |
| earned_points | numeric | - | NULL | Points earned (NULL if not graded) |
| weight_percentage | numeric | NOT NULL, CHECK (0-100) | 10 | Weight toward final grade |
| due_date | date | - | NULL | When assignment is due |
| submitted_date | date | - | NULL | When student submitted |
| status | text | CHECK | 'pending' | Status: pending, submitted, graded, late, missing |
| notes | text | - | NULL | Additional notes |
| created_at | timestamp | - | now() | Record creation |
| updated_at | timestamp | - | now() | Last update |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `course_id`
- INDEX on `user_id`
- INDEX on `status`
- INDEX on `due_date`

---

### course_grade_history
Tracks grade snapshots over time for verification and trend analysis.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | uuid | PRIMARY KEY | gen_random_uuid() | History record identifier |
| course_id | uuid | NOT NULL, FK → courses(id) CASCADE | - | Course being tracked |
| user_id | uuid | NOT NULL, FK → users(id) CASCADE | - | Owner |
| calculated_grade | numeric | NOT NULL | - | Grade calculated from assignments |
| report_card_grade | numeric | - | NULL | Official grade from report card |
| grade_date | date | NOT NULL | - | Date of this grade snapshot |
| is_final | boolean | - | false | Whether this is the final grade |
| notes | text | - | NULL | Notes about the grade |
| created_at | timestamp | - | now() | Record creation |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `course_id`
- INDEX on `user_id`
- INDEX on `grade_date`

---

### standardized_scores
Stores SAT, ACT, AP, and other standardized test scores.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | uuid | PRIMARY KEY | gen_random_uuid() | Score unique identifier |
| user_id | uuid | NOT NULL, FK → users(id) | - | Owner of the score |
| test_type | text | NOT NULL | - | Test type (SAT, ACT, AP, IB, etc.) |
| score | numeric | NOT NULL | - | Overall score |
| section_scores | jsonb | - | NULL | Breakdown by section (e.g., Math, Reading) |
| date_taken | date | - | NULL | When test was taken |
| created_at | timestamp | - | now() | Record creation timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `user_id`
- INDEX on `test_type`

---

## Row Level Security (RLS)

All tables have RLS enabled with user-scoped policies:
- Users can only view/insert/update/delete their own records
- Policies check `auth.uid() = user_id`

## Grade Calculation Logic

1. **Assignment Weights**: Each assignment has a `weight_percentage` (sum should = 100% per category)
2. **Category Weighting**: Assignment types can be grouped and weighted differently
3. **AP/Honors Boost**: 
   - AP courses: +5% to final grade (capped at 100)
   - Honors/Dual Enrollment: +2.5% to final grade (capped at 100)
4. **GPA Calculation**:
   - Unweighted: Standard 4.0 scale conversion
   - Weighted: Adds course level bonuses (AP +1.0, Honors +0.5)

## AI Tables (Production)

### `ai_recommendations`

Stores AI-generated recommendations with full input/output data, confidence scores, and size constraints for monitoring and debugging.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `user_id` | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | User who requested the recommendation |
| `feature_type` | TEXT | NOT NULL, CHECK constraint | Type of AI feature (course_extraction, acceptance_prediction, portfolio_advice, course_recommendation, grade_analysis) |
| `input_data` | JSONB | NOT NULL, max 200KB | User input data sent to AI |
| `output_data` | JSONB | NOT NULL, max 200KB | AI-generated output (validated before storage) |
| `confidence_score` | NUMERIC | NULL | Computed confidence score (0-100) based on validation heuristics |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp of creation |

**Indexes:**
- `idx_ai_recommendations_user_id` on `user_id`
- `idx_ai_recommendations_feature_type` on `feature_type`
- `idx_ai_recommendations_created_at` on `created_at DESC`
- `idx_ai_recommendations_user_feature` on `(user_id, feature_type)`

**RLS Policies:**
- Users can view their own recommendations (`auth.uid() = user_id`)
- Users or service role can insert (`auth.role() = 'service_role' OR auth.uid() = user_id`)
- Users can update their own recommendations
- Users can delete their own recommendations

**Constraints:**
- `feature_type` must be one of: `course_extraction`, `acceptance_prediction`, `portfolio_advice`, `course_recommendation`, `grade_analysis`
- `input_data` size limited to 200KB to prevent database bloat
- `output_data` size limited to 200KB to prevent database bloat

---

### `ai_query_log`

Tracks all AI API calls for monitoring, analytics, billing, and debugging with comprehensive token tracking and raw response storage.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `user_id` | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | User who made the request |
| `feature_type` | TEXT | NOT NULL, CHECK constraint | Type of AI feature |
| `prompt_length` | INTEGER | NULL | Length of the prompt in characters |
| `model_name` | TEXT | DEFAULT 'grok-beta' | AI model used (e.g., grok-beta) |
| `model_version` | TEXT | NULL | Model version for debugging and rollback |
| `prompt_template` | TEXT | NULL | Template identifier for A/B testing and debugging |
| `request_id` | TEXT | NULL | Unique request ID for tracing |
| `response_time_ms` | INTEGER | NULL | Response time in milliseconds |
| `status` | TEXT | NOT NULL, CHECK constraint | Request status (success, error, timeout) |
| `error_message` | TEXT | NULL | Error message if status is error |
| `prompt_tokens` | INTEGER | NULL | Tokens used in prompt (for billing) |
| `completion_tokens` | INTEGER | NULL | Tokens used in completion (for billing) |
| `total_tokens` | INTEGER | NULL | Total tokens used (prompt + completion) |
| `tokens_used` | INTEGER | NULL | Legacy token field (kept for compatibility) |
| `raw_response` | JSONB | NULL | Full AI response for debugging |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp of query |

**Indexes:**
- `idx_ai_query_log_user_id` on `user_id`
- `idx_ai_query_log_feature_type` on `feature_type`
- `idx_ai_query_log_created_at` on `created_at DESC`
- `idx_ai_query_log_status` on `status`
- `idx_ai_query_log_user_created` on `(user_id, created_at DESC)`
- `idx_ai_query_log_model_name` on `model_name`
- `idx_ai_query_log_request_id` on `request_id`

**RLS Policies:**
- Users can view their own query logs (`auth.uid() = user_id`)
- Service role or users can insert (`auth.role() = 'service_role' OR auth.uid() = user_id`)
- Users can delete their own query logs

**Constraints:**
- `feature_type` must be one of: `course_extraction`, `acceptance_prediction`, `portfolio_advice`, `course_recommendation`, `grade_analysis`
- `status` must be one of: `success`, `error`, `timeout`

**Monitoring Queries:**

```sql
-- Monitor AI usage by feature type (last 7 days)
SELECT feature_type, 
       COUNT(*) as requests, 
       AVG(response_time_ms) as avg_ms,
       SUM(total_tokens) as total_tokens
FROM ai_query_log
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY feature_type;

-- Track error rates (last 24 hours)
SELECT feature_type, 
       status, 
       COUNT(*) as count
FROM ai_query_log
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY feature_type, status;

-- Monitor token usage for billing (last 30 days)
SELECT DATE(created_at) as date, 
       SUM(total_tokens) as daily_tokens,
       SUM(prompt_tokens) as prompt_tokens,
       SUM(completion_tokens) as completion_tokens
FROM ai_query_log
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## University Data Tables

### universities_temp
Comprehensive institutional profile of U.S. and international universities. Contains academic, demographic, financial, geographic, and admissions-related metrics.

**Dataset Overview:**
- **Total Rows**: 1,612 universities
- **Total Columns**: 116+ fields
- **Coverage**: Most major fields fully populated; some optional data sparse (image_url, some demographics, some tuition fields)

**⚠️ CRITICAL SCHEMA ISSUE:**
- **NO PRIMARY KEY**: Table was imported without an `id` column
- **RLS ENABLED**: Row Level Security is enabled but has no SELECT policy (blocks all reads)
- **NO INDEXES**: No performance indexes exist on this table
- **FIX REQUIRED**: Run `fix-universities-temp-schema.sql` to add ID column and indexes

#### Current Schema (As Imported - NO ID COLUMN!)

**Note**: This table is missing a primary key. You MUST run the migration SQL before the app will work.

#### 1. Basic Institution Information

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `name` | text | YES | Full official university name (PRIMARY DATA) |
| `alias` | text | YES | Alternative names or abbreviations |
| `website` | text | YES | Official website URL |
| `image_url` | text | YES | Image or logo URL (mostly empty) |
| `country` | text | YES | Country where the institution is located |
| `state` | text | YES | State/province |
| `city` | text | YES | City location |
| `zip` | text | YES | ZIP/postal code |
| `latitude` | text | YES | Latitude coordinate (stored as text!) |
| `longitude` | text | YES | Longitude coordinate (stored as text!) |
| `branches` | bigint | YES | Number of campus branches |
| `is_main_campus` | bigint | YES | Whether this entry is the primary campus (1=main, 0=branch) |
| `carnegie_classification` | text | YES | Classification of U.S. institutions |
| `carnegie_size_setting` | bigint | YES | Size classification numeric code |
| `accreditor` | text | YES | Accreditation body |
| `locale` | bigint | YES | IPEDS locale code (urban/rural classification) |

#### 2. Admissions & Academic Competitiveness

**⚠️ WARNING**: Most fields are stored as TEXT, not numeric!

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `avg_gpa` | text | YES | Average incoming GPA (text!) |
| `avg_sat` | text | YES | Reported SAT average (text!) |
| `avg_act` | text | YES | Reported ACT average (text!) |
| `acceptance_rate` | double precision | YES | Selectivity metric (0-1) |
| `admissions_admission_rate` | double precision | YES | Alternative selectivity metric (0-1) |
| `admissions_sat_average` | text | YES | Reported SAT average (text!) |
| `admissions_sat_math_25th` | text | YES | 25th percentile SAT Math score (text!) |
| `admissions_sat_math_75th` | text | YES | 75th percentile SAT Math score (text!) |
| `admissions_sat_reading_25th` | text | YES | 25th percentile SAT Reading score (text!) |
| `admissions_sat_reading_75th` | text | YES | 75th percentile SAT Reading score (text!) |
| `admissions_sat_writing_25th` | text | YES | 25th percentile SAT Writing score (text!) |
| `admissions_sat_writing_75th` | text | YES | 75th percentile SAT Writing score (text!) |
| `admissions_act_midpoint` | text | YES | ACT midpoint score (text!) |
| `admissions_act_cumulative_25th` | text | YES | 25th percentile ACT composite (text!) |
| `admissions_act_cumulative_75th` | text | YES | 75th percentile ACT composite (text!) |
| `admissions_act_english_midpoint` | text | YES | ACT English midpoint (text!) |
| `admissions_act_math_midpoint` | text | YES | ACT Math midpoint (text!) |
| `admissions_act_writing_midpoint` | text | YES | ACT Writing midpoint (text!) |

#### 3. Majors & Academic Programs

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `majors_offered` | jsonb | YES | JSON-like list of available majors |

**(37 program_percentage fields omitted for brevity - see full diagnostic output)**

#### 4. Cost & Tuition Data

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `tuition` | bigint | YES | Basic tuition |
| `costs_tuition_in_state` | bigint | YES | In-state tuition |
| `costs_tuition_out_of_state` | bigint | YES | Out-of-state tuition |
| `costs_total_cost_academic_year` | bigint | YES | Estimated yearly total cost |
| `costs_books_supplies` | text | YES | Books and supplies cost (text!) |
| `costs_roomboard_oncampus` | bigint | YES | On-campus housing costs |
| `costs_roomboard_offcampus` | bigint | YES | Off-campus housing costs |
| `costs_avg_net_price` | bigint | YES | Average net price after aid |
| `out_of_state_tuition` | bigint | YES | Specific out-of-state tuition metric |
| `price_calculator_url` | text | YES | Net price estimator URL |

**(Income-based net price fields stored as text - see full diagnostic)**

#### 5. Student Body Demographics

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `student_size` | bigint | YES | Total student population |
| `grad_students` | text | YES | Graduate enrollment (text!) |
| `demographics_age_entry` | bigint | YES | Average age at entry |
| `demographics_female_share` | text | YES | % female students (text!) |
| `demographics_men` | text | YES | % male students (text!) |
| `demographics_women` | text | YES | % female students (text!) |
| `demographics_race_ethnicity_white` | double precision | YES | % White students |
| `demographics_race_ethnicity_black` | text | YES | % Black students (text!) |
| `demographics_race_ethnicity_asian` | text | YES | % Asian students (text!) |
| `demographics_race_ethnicity_hispanic` | text | YES | % Hispanic students (text!) |
| `demographics_race_ethnicity_non_resident_alien` | double precision | YES | % non-resident alien students |
| `hispanic_serving` | text | YES | Designated HSI (text boolean!) |
| `historically_black` | text | YES | HBCU designation (text boolean!) |
| `men_only` | text | YES | Men-only institution (text boolean!) |
| `women_only` | text | YES | Women-only institution (text boolean!) |

**(Additional demographic fields omitted - see full diagnostic)**

#### 6. Completion, Graduation, & Retention

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `graduation_rate` | double precision | YES | Overall graduation rate (0-1) |
| `completion_rate_4yr` | double precision | YES | 4-year completion rate (0-1) |
| `completion_retention_rate_4yr_full_time` | text | YES | Retention rate (text!) |

**(Additional completion fields stored as text - see full diagnostic)**

#### 7. Earnings & Financial Outcomes

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `earnings_median_10yrs` | bigint | YES | Median earnings 10 years after entry |
| `earnings_median_6yrs` | text | YES | Median earnings 6 years after entry (text!) |
| `financial_aid_median_debt` | text | YES | Median debt at graduation (text!) |
| `financial_aid_pell_grant_rate` | double precision | YES | % receiving Pell Grants |
| `faculty_salary` | bigint | YES | Average faculty salary |

#### 8. Institutional Characteristics

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `ownership` | bigint | YES | Public (1) / Private nonprofit (2) / Private for-profit (3) |
| `online_only` | text | YES | Fully online institution (text boolean!) |
| `religious_affiliation` | text | YES | Religious affiliation code |

**Required Indexes (AFTER adding id column):**
- PRIMARY KEY on `id` (if implemented)
- INDEX on `name`
- INDEX on `state`
- INDEX on `country`
- INDEX on `acceptance_rate`
- INDEX on `ownership`
- COMPOSITE INDEX on `state, city`
- GIN INDEX on `majors_offered` (for JSONB queries)

**RLS Policies:**
- Read access for all authenticated users
- Insert/Update/Delete restricted to admin users

**Example Queries:**

```sql
-- Find universities by acceptance rate
SELECT name, state, acceptance_rate, avg_sat
FROM universities_temp
WHERE acceptance_rate < 0.20
ORDER BY acceptance_rate ASC;

-- Find universities with specific major offerings
SELECT name, state, program_percentage_engineering, program_percentage_computer
FROM universities_temp
WHERE program_percentage_engineering > 20 OR program_percentage_computer > 15
ORDER BY program_percentage_engineering DESC;

-- Compare costs by income bracket
SELECT name, state,
       costs_net_price_income_0_30k,
       costs_net_price_income_110k_plus
FROM universities_temp
WHERE costs_avg_net_price IS NOT NULL
ORDER BY costs_avg_net_price ASC;

-- Graduation outcomes analysis
SELECT name, state, graduation_rate, 
       earnings_median_10yrs,
       financial_aid_median_debt
FROM universities_temp
WHERE graduation_rate > 0.80
  AND earnings_median_10yrs > 60000
ORDER BY graduation_rate DESC;
```

---

## Future Tables (Placeholder)

- `extracurriculars` - Student activities (partially implemented)
- `achievements` - Awards and honors  
- `user_targets` - University targets (partially implemented)
- `universities` - University database (implemented)
- `personality_inputs` - Personality assessment data (partially implemented)
- `essay_prompts` - College essay responses (partially implemented)
