-- Migration: Add AI Features Tables
-- Description: Creates tables for AI recommendations and query logging

-- =============================================
-- Table: ai_recommendations
-- Stores AI-generated recommendations for users
-- =============================================
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
  confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX idx_ai_recommendations_feature_type ON ai_recommendations(feature_type);
CREATE INDEX idx_ai_recommendations_created_at ON ai_recommendations(created_at DESC);
CREATE INDEX idx_ai_recommendations_user_feature ON ai_recommendations(user_id, feature_type);

-- =============================================
-- Table: ai_query_log
-- Logs AI API calls for monitoring and analytics
-- =============================================
CREATE TABLE IF NOT EXISTS ai_query_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_type TEXT NOT NULL,
  prompt_length INTEGER NOT NULL,
  response_time_ms INTEGER,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'timeout')),
  error_message TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for analytics
CREATE INDEX idx_ai_query_log_user_id ON ai_query_log(user_id);
CREATE INDEX idx_ai_query_log_feature_type ON ai_query_log(feature_type);
CREATE INDEX idx_ai_query_log_created_at ON ai_query_log(created_at DESC);
CREATE INDEX idx_ai_query_log_status ON ai_query_log(status);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_query_log ENABLE ROW LEVEL SECURITY;

-- ai_recommendations policies
CREATE POLICY "Users can view their own AI recommendations"
  ON ai_recommendations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI recommendations"
  ON ai_recommendations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI recommendations"
  ON ai_recommendations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI recommendations"
  ON ai_recommendations
  FOR DELETE
  USING (auth.uid() = user_id);

-- ai_query_log policies
CREATE POLICY "Users can view their own AI query logs"
  ON ai_query_log
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI query logs"
  ON ai_query_log
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- Comments for documentation
-- =============================================
COMMENT ON TABLE ai_recommendations IS 'Stores AI-generated recommendations for various features';
COMMENT ON TABLE ai_query_log IS 'Logs AI API calls for monitoring and rate limiting';

COMMENT ON COLUMN ai_recommendations.feature_type IS 'Type of AI feature: course_extraction, acceptance_prediction, portfolio_advice, course_recommendation, grade_analysis';
COMMENT ON COLUMN ai_recommendations.input_data IS 'JSON snapshot of user input data';
COMMENT ON COLUMN ai_recommendations.output_data IS 'JSON of AI-generated recommendations';
COMMENT ON COLUMN ai_recommendations.confidence_score IS 'AI confidence score (0-100)';

COMMENT ON COLUMN ai_query_log.response_time_ms IS 'API response time in milliseconds';
COMMENT ON COLUMN ai_query_log.tokens_used IS 'Number of tokens consumed by the API call';
