import { supabase } from '../client';
import type { AIRecommendation, AIFeatureType } from '@/lib/types';

/**
 * DEPRECATED: Use AIRecommendationsRepository instead
 * This file is kept for backwards compatibility but maps to the new ai_recommendations table
 */
export class RecommendationsRepository {
  async getByUserId(userId: string): Promise<AIRecommendation[]> {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as AIRecommendation[];
  }

  async create(recommendation: Omit<AIRecommendation, 'id'>): Promise<AIRecommendation> {
    const { data, error } = await (supabase as any)
      .from('ai_recommendations')
      .insert([{
        user_id: recommendation.user_id,
        feature_type: recommendation.feature_type,
        input_data: recommendation.input_data,
        output_data: recommendation.output_data,
        confidence_score: recommendation.confidence_score,
      }])
      .select()
      .single();

    if (error) throw error;
    return data as AIRecommendation;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('ai_recommendations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
