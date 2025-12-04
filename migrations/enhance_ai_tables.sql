-- =====================================================
-- AI Tables Enhancement Migration
-- Run this AFTER the basic ai_recommendations and ai_query_log tables exist
-- =====================================================

-- Add enhanced columns to ai_query_log for monitoring and debugging
ALTER TABLE ai_query_log
  ADD COLUMN IF NOT EXISTS model_name TEXT DEFAULT 'grok-beta',
  ADD COLUMN IF NOT EXISTS model_version TEXT,
  ADD COLUMN IF NOT EXISTS prompt_template TEXT,
  ADD COLUMN IF NOT EXISTS request_id TEXT,
  ADD COLUMN IF NOT EXISTS raw_response JSONB,
  ADD COLUMN IF NOT EXISTS prompt_tokens INTEGER,
  ADD COLUMN IF NOT EXISTS completion_tokens INTEGER,
  ADD COLUMN IF NOT EXISTS total_tokens INTEGER;

-- Add size constraints to prevent database bloat
ALTER TABLE ai_recommendations
  DROP CONSTRAINT IF EXISTS ai_recommendations_input_size_ck,
  DROP CONSTRAINT IF EXISTS ai_recommendations_output_size_ck;

ALTER TABLE ai_recommendations
  ADD CONSTRAINT ai_recommendations_input_size_ck CHECK (octet_length(input_data::text) < 200000),
  ADD CONSTRAINT ai_recommendations_output_size_ck CHECK (octet_length(output_data::text) < 200000);

-- Update RLS policies to allow service role (Edge Functions) to insert
DROP POLICY IF EXISTS "Users or service role can insert AI recommendations" ON ai_recommendations;
CREATE POLICY "Users or service role can insert AI recommendations"
  ON ai_recommendations FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role or users can insert AI query logs" ON ai_query_log;
CREATE POLICY "Service role or users can insert AI query logs"
  ON ai_query_log FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.uid() = user_id);

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_ai_query_log_model_name ON ai_query_log(model_name);
CREATE INDEX IF NOT EXISTS idx_ai_query_log_request_id ON ai_query_log(request_id);

-- Now add comments (safe to run after columns exist)
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
