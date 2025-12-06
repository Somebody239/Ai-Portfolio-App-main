/**
 * AIPortfolioAnalyzer - Analyzes personality responses with AI
 * Uses Grok to extract structured data from student responses
 */

import { AIExtractedData } from "@/lib/types";
import {
    callAIWithRetry,
    parseAIResponse,
    generatePersonalityAnalysisPrompt,
    AIFeatureType,
} from '@/lib/utils/ai';
import { AIRecommendationsRepository } from '@/lib/supabase/repositories/ai-recommendations.repository';

export class AIPortfolioAnalyzer {
    /**
     * Analyzes a student's response and extracts portfolio-relevant data using Grok
     */
    async analyzeResponse(
        userId: string,
        question: string,
        answer: string
    ): Promise<AIExtractedData> {
        // Don't process empty answers
        if (!answer || answer.trim().length < 10) {
            return {
                achievements: [],
                personalityTraits: [],
                skills: [],
                interests: [],
                essayThemes: []
            };
        }

        try {
            const prompt = generatePersonalityAnalysisPrompt({ question, answer });

            const response = await callAIWithRetry(prompt, {
                featureType: AIFeatureType.PersonalityAnalysis,
                temperature: 0.4,  // Lower for more accurate extraction
                max_tokens: 1500,
            });

            const result = parseAIResponse<AIExtractedData>(response);

            // Validate and sanitize the result
            const sanitizedResult: AIExtractedData = {
                achievements: Array.isArray(result.achievements) ? result.achievements : [],
                personalityTraits: Array.isArray(result.personalityTraits) ? result.personalityTraits.slice(0, 5) : [],
                skills: Array.isArray(result.skills) ? result.skills : [],
                interests: Array.isArray(result.interests) ? result.interests : [],
                essayThemes: Array.isArray(result.essayThemes) ? result.essayThemes : [],
            };

            // Save to database for caching
            await AIRecommendationsRepository.create({
                user_id: userId,
                feature_type: AIFeatureType.PersonalityAnalysis,
                input_data: { question, answerLength: answer.length },
                output_data: JSON.parse(JSON.stringify(sanitizedResult)),
                confidence_score: this.calculateConfidence(sanitizedResult),
            });

            return sanitizedResult;
        } catch (error) {
            console.error("Failed to analyze response with AI:", error);
            // Return empty data on failure - don't block the user
            return {
                achievements: [],
                personalityTraits: [],
                skills: [],
                interests: [],
                essayThemes: []
            };
        }
    }

    /**
     * Calculate confidence based on how much data was extracted
     */
    private calculateConfidence(data: AIExtractedData): number {
        const totalItems =
            (data.achievements?.length || 0) +
            (data.personalityTraits?.length || 0) +
            (data.skills?.length || 0) +
            (data.interests?.length || 0) +
            (data.essayThemes?.length || 0);

        // More extracted data = higher confidence
        if (totalItems >= 8) return 90;
        if (totalItems >= 5) return 75;
        if (totalItems >= 2) return 60;
        return 40;
    }
}
