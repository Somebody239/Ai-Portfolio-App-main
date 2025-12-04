-- PHASE 1: Make grade nullable
ALTER TABLE courses 
ALTER COLUMN grade DROP NOT NULL;

ALTER TABLE courses 
ALTER COLUMN grade SET DEFAULT NULL;

-- PHASE 2: Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    assignment_type text NOT NULL CHECK (assignment_type IN ('homework', 'quiz', 'test', 'project', 'lab', 'participation', 'final_exam', 'midterm', 'other')),
    total_points numeric NOT NULL DEFAULT 100,
    earned_points numeric,
    weight_percentage numeric NOT NULL DEFAULT 10 CHECK (weight_percentage >= 0 AND weight_percentage <= 100),
    due_date date,
    submitted_date date,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded', 'late', 'missing')),
    notes text,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

CREATE INDEX idx_assignments_course_id ON assignments(course_id);
CREATE INDEX idx_assignments_user_id ON assignments(user_id);
CREATE INDEX idx_assignments_status ON assignments(status);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);

-- PHASE 3: Create course grade history table
CREATE TABLE IF NOT EXISTS course_grade_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    calculated_grade numeric NOT NULL,
    report_card_grade numeric,
    grade_date date NOT NULL,
    is_final boolean DEFAULT false,
    notes text,
    created_at timestamp DEFAULT now()
);

CREATE INDEX idx_grade_history_course_id ON course_grade_history(course_id);
CREATE INDEX idx_grade_history_user_id ON course_grade_history(user_id);
CREATE INDEX idx_grade_history_date ON course_grade_history(grade_date);

-- PHASE 4: Enable RLS
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_grade_history ENABLE ROW LEVEL SECURITY;

-- PHASE 5: RLS policies for assignments
CREATE POLICY "Users can view their own assignments"
    ON assignments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assignments"
    ON assignments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assignments"
    ON assignments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assignments"
    ON assignments FOR DELETE
    USING (auth.uid() = user_id);

-- PHASE 6: RLS policies for course_grade_history
CREATE POLICY "Users can view their own grade history"
    ON course_grade_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own grade history"
    ON course_grade_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own grade history"
    ON course_grade_history FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own grade history"
    ON course_grade_history FOR DELETE
    USING (auth.uid() = user_id);
