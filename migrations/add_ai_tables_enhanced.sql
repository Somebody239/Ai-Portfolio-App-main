-- Enhanced AI Tables Migration with Security & Observability Improvements
-- Based on production recommendations

-- ===================================
-- AI Recommendations Table (Enhanced)
-- ===================================

CREATE TABLE IF NOT EXISTS ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    feature_type TEXT NOT NULL CHECK (
        feature_type IN (
            'course_extraction',
            'acceptance_prediction',
            'portfolio_advice',
            'course_recommendation',
            'grade_analysis'
        )
    ),
    input_data JSONB NOT NULL,
    output_data JSONB NOT NULL,
    confidence_score NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Size constraints to prevent DB bloat
    CONSTRAINT ai_recommendations_input_size_ck CHECK (octet_length(input_data::text) < 200000),
    CONSTRAINT ai_recommendations_output_size_ck CHECK (octet_length(output_data::text) < 200000)
);

-- ===================================
-- AI Query Log Table (Enhanced with Observability)
-- ===================================

CREATE TABLE IF NOT EXISTS ai_query_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    feature_type TEXT NOT NULL CHECK (
        feature_type IN (
            'course_extraction',
            'acceptance_prediction',
            'portfolio_advice',
            'course_recommendation',
            'grade_analysis'
        )
    ),
    
    -- Request metadata
    prompt_length INTEGER,
    model_name TEXT DEFAULT 'grok-beta',
    model_version TEXT,
    prompt_template TEXT,
    request_id TEXT,
    
    -- Response metadata
    response_time_ms INTEGER,
    status TEXT NOT NULL CHECK (status IN ('success', 'error', 'timeout')),
    error_message TEXT,
    
    -- Token tracking for billing/observability
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    total_tokens INTEGER,
    tokens_used INTEGER, -- legacy, kept for compatibility
    
    -- Raw AI response for debugging
    raw_response JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================
-- Indexes for Performance
-- ===================================

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_feature_type ON ai_recommendations(feature_type);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_created_at ON ai_recommendations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_feature ON ai_recommendations(user_id, feature_type);

CREATE INDEX IF NOT EXISTS idx_ai_query_log_user_id ON ai_query_log(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_query_log_feature_type ON ai_query_log(feature_type);
CREATE INDEX IF NOT EXISTS idx_ai_query_log_created_at ON ai_query_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_query_log_status ON ai_query_log(status);
CREATE INDEX IF NOT EXISTS idx_ai_query_log_user_created ON ai_query_log(user_id, created_at DESC);

-- ===================================
-- Row Level Security (RLS) Policies
-- ===================================

ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_query_log ENABLE ROW LEVEL SECURITY;

-- ai_recommendations policies
DROP POLICY IF EXISTS "Users can view own AI recommendations" ON ai_recommendations;
CREATE POLICY "Users can view own AI recommendations"
    ON ai_recommendations FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users or service role can insert AI recommendations" ON ai_recommendations;
CREATE POLICY "Users or service role can insert AI recommendations"
    ON ai_recommendations FOR INSERT
    WITH CHECK (auth.role() = 'service_role' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own AI recommendations" ON ai_recommendations;
CREATE POLICY "Users can update own AI recommendations"
    ON ai_recommendations FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own AI recommendations" ON ai_recommendations;
CREATE POLICY "Users can delete own AI recommendations"
    ON ai_recommendations FOR DELETE
    USING (auth.uid() = user_id);

-- ai_query_log policies
DROP POLICY IF EXISTS "Users can view own AI query logs" ON ai_query_log;
CREATE POLICY "Users can view own AI query logs"
    ON ai_query_log FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role or users can insert AI query logs" ON ai_query_log;
CREATE POLICY "Service role or users can insert AI query logs"
    ON ai_query_log FOR INSERT
    WITH CHECK (auth.role() = 'service_role' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own AI query logs" ON ai_query_log;
CREATE POLICY "Users can delete own AI query logs"
    ON ai_query_log FOR DELETE
    USING (auth.uid() = user_id);

-- ===================================
-- Comments for Documentation
-- ===================================

COMMENT ON TABLE ai_recommendations IS 'Stores AI-generated recommendations with input/output data, confidence scores, and size constraints';
COMMENT ON TABLE ai_query_log IS 'Tracks all AI API calls for monitoring, analytics, billing, and debugging with full token tracking and raw response storage';

COMMENT ON COLUMN ai_recommendations.feature_type IS 'Type of AI feature: course_extraction, acceptance_prediction, portfolio_advice, course_recommendation, or grade_analysis';
COMMENT ON COLUMN ai_recommendations.input_data IS 'User input data sent to AI (max 200KB)';
COMMENT ON COLUMN ai_recommendations.output_data IS 'AI-generated output (max 200KB, validated before storage)';
COMMENT ON COLUMN ai_recommendations.confidence_score IS 'Computed confidence score (0-100) based on validation heuristics';

COMMENT ON COLUMN ai_query_log.model_name IS 'AI model used (e.g., grok-beta)';
COMMENT ON COLUMN ai_query_log.model_version IS 'Model version for debugging and rollback';
COMMENT ON COLUMN ai_query_log.prompt_template IS 'Template identifier for A/B testing and debugging';
COMMENT ON COLUMN ai_query_log.request_id IS 'Unique request ID for tracing';
COMMENT ON COLUMN ai_query_log.raw_response IS 'Full AI response for debugging (JSONB)';
COMMENT ON COLUMN ai_query_log.prompt_tokens IS 'Tokens used in prompt (for billing)';
COMMENT ON COLUMN ai_query_log.completion_tokens IS 'Tokens used in completion (for billing)';
COMMENT ON COLUMN ai_query_log.total_tokens IS 'Total tokens used (prompt + completion)';

-- ===================================
-- Sample Queries for Monitoring
-- ===================================

-- Monitor AI usage by feature type
-- SELECT feature_type, COUNT(*) as requests, AVG(response_time_ms) as avg_ms
-- FROM ai_query_log
-- WHERE created_at > NOW() - INTERVAL '7 days'
-- GROUP BY feature_type;

-- Track error rates
-- SELECT feature_type, status, COUNT(*) as count
-- FROM ai_query_log
-- WHERE created_at > NOW() - INTERVAL '24 hours'
-- GROUP BY feature_type, status;

-- Monitor token usage for billing
-- SELECT DATE(created_at) as date, SUM(total_tokens) as daily_tokens
-- FROM ai_query_log
-- WHERE created_at > NOW() - INTERVAL '30 days'
-- GROUP BY DATE(created_at)
-- ORDER BY date DESC;
