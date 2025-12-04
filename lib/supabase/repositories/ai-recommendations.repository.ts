import { supabase } from '../client';
import type { AIRecommendation, AIFeatureType, UUID } from '@/lib/types';

/**
 * Repository for AI Recommendations table
 * Handles CRUD operations with type safety
 */
export class AIRecommendationsRepository {
    /**
     * Create a new AI recommendation record
     */
    static async create(data: {
        user_id: string;
        feature_type: AIFeatureType;
        input_data: Record<string, unknown>;
        output_data: Record<string, unknown>;
        confidence_score?: number;
    }): Promise<AIRecommendation> {
        const { data: recommendation, error } = await (supabase as any)
            .from('ai_recommendations')
            .insert([data])
            .select()
            .single();

        if (error) throw error;
        return recommendation as AIRecommendation;
    }

    /**
     * Get all AI recommendations for a user
     */
    static async findByUser(userId: UUID): Promise<AIRecommendation[]> {
        const { data, error } = await supabase
            .from('ai_recommendations')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching AI recommendations:', error);
            throw new Error(`Failed to fetch AI recommendations: ${error.message}`);
        }

        return data || [];
    }

    /**
     * Get AI recommendations by feature type
     */
    static async findByFeatureType(
        userId: UUID,
        featureType: AIFeatureType
    ): Promise<AIRecommendation[]> {
        const { data, error } = await supabase
            .from('ai_recommendations')
            .select('*')
            .eq('user_id', userId)
            .eq('feature_type', featureType)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching AI recommendations by feature:', error);
            throw new Error(`Failed to fetch AI recommendations: ${error.message}`);
        }

        return data || [];
    }

    /**
     * Get the most recent AI recommendation for a feature type
     */
    static async findLatestByFeatureType(
        userId: UUID,
        featureType: AIFeatureType
    ): Promise<AIRecommendation | null> {
        const { data, error } = await supabase
            .from('ai_recommendations')
            .select('*')
            .eq('user_id', userId)
            .eq('feature_type', featureType)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') {
            // PGRST116 is "no rows returned", which is expected
            console.error('Error fetching latest AI recommendation:', error);
            throw new Error(`Failed to fetch AI recommendation: ${error.message}`);
        }

        return data || null;
    }

    /**
     * Delete an AI recommendation
     */
    static async delete(id: UUID): Promise<void> {
        const { error } = await supabase
            .from('ai_recommendations')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting AI recommendation:', error);
            throw new Error(`Failed to delete AI recommendation: ${error.message}`);
        }
    }

    /**
     * Delete all AI recommendations for a user
     */
    static async deleteAllByUser(userId: UUID): Promise<void> {
        const { error } = await supabase
            .from('ai_recommendations')
            .delete()
            .eq('user_id', userId);

        if (error) {
            console.error('Error deleting user AI recommendations:', error);
            throw new Error(`Failed to delete AI recommendations: ${error.message}`);
        }
    }

    /**
     * Get recommendation count by feature type
     */
    static async countByFeatureType(
        userId: UUID,
        featureType: AIFeatureType
    ): Promise<number> {
        const { count, error } = await supabase
            .from('ai_recommendations')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('feature_type', featureType);

        if (error) {
            console.error('Error counting AI recommendations:', error);
            throw new Error(`Failed to count AI recommendations: ${error.message}`);
        }

        return count || 0;
    }
}
