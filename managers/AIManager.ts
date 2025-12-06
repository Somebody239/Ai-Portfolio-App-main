import { AIRecommendationsRepository } from '@/lib/supabase/repositories/ai-recommendations.repository';
import {
    callAIWithRetry,
    parseAIResponse,
    generateCourseExtractionPrompt,
    generateAcceptancePredictionPrompt,
    generatePortfolioAdvicePrompt,
    generateCourseRecommendationPrompt,
    generateGradeAnalysisPrompt,
    generateBatchAcceptancePredictionPrompt,
    generatePersonalityAnalysisPrompt,
    generateEssayAssistancePrompt,
    AIFeatureType,
} from '@/lib/utils/ai';
import type {
    UUID,
    CourseExtractionResult,
    AcceptancePredictionResult,
    PortfolioAdviceResult,
    CourseRecommendationResult,
    GradeAnalysisResult,
    BatchAcceptancePredictionResult,
} from '@/lib/types';

/**
 * AIManager - Centralized manager for all AI operations
 * Handles caching, logging, and error handling for AI features
 */
export class AIManager {
    /**
     * Extract courses from OCR text
     */
    static async extractCoursesFromText(
        userId: UUID,
        ocrText: string
    ): Promise<CourseExtractionResult> {
        const prompt = generateCourseExtractionPrompt(ocrText);

        try {
            const response = await callAIWithRetry(prompt, {
                featureType: AIFeatureType.CourseExtraction,
                temperature: 0.3, // Lower temperature for more precise extraction
            });

            const result = parseAIResponse<CourseExtractionResult>(response);

            // Save to database for caching
            await AIRecommendationsRepository.create({
                user_id: userId,
                feature_type: AIFeatureType.CourseExtraction,
                input_data: { ocrText },
                output_data: JSON.parse(JSON.stringify(result)), // Convert to plain object
                confidence_score: result.courses.length > 0 ? 85 : 50,
            });

            return result;
        } catch (error) {
            console.error('Course extraction error:', error);
            throw new Error(
                error instanceof Error
                    ? `Failed to extract courses: ${error.message}`
                    : 'Failed to extract courses'
            );
        }
    }

    /**
     * Predict university acceptance likelihood
     */
    static async predictAcceptance(
        userId: UUID,
        data: {
            universityName: string;
            major: string;
            gpa: number;
            satScore?: number;
            actScore?: number;
            apCourses: number;
            extracurriculars: string[];
            universityContext?: any; // Pass full university object for better context
        }
    ): Promise<AcceptancePredictionResult> {
        // Enrich prompt with university specific data if available
        const prompt = generateAcceptancePredictionPrompt({
            ...data,
            // Add context about university stats if available
            universityStats: data.universityContext ? {
                acceptanceRate: data.universityContext.acceptance_rate,
                avgGpa: data.universityContext.avg_gpa,
                sat25th: data.universityContext.admissions_sat_math_25th ? (data.universityContext.admissions_sat_math_25th + data.universityContext.admissions_sat_reading_25th) : null,
                sat75th: data.universityContext.admissions_sat_math_75th ? (data.universityContext.admissions_sat_math_75th + data.universityContext.admissions_sat_reading_75th) : null,
            } : undefined
        });

        try {
            const response = await callAIWithRetry(prompt, {
                featureType: AIFeatureType.AcceptancePrediction,
                temperature: 0.5,
            });

            const result = parseAIResponse<AcceptancePredictionResult>(response);

            // Save recommendation
            await AIRecommendationsRepository.create({
                user_id: userId,
                feature_type: AIFeatureType.AcceptancePrediction,
                input_data: data as Record<string, unknown>,
                output_data: JSON.parse(JSON.stringify(result)),
                confidence_score: result.acceptanceLikelihood,
            });

            return result;
        } catch (error) {
            console.error('Acceptance prediction error:', error);
            throw new Error(
                error instanceof Error
                    ? `Failed to predict acceptance: ${error.message}`
                    : 'Failed to predict acceptance'
            );
        }
    }

    /**
     * Predict acceptance for multiple universities
     */
    static async predictAcceptanceBatch(
        userId: UUID,
        data: {
            universities: Array<{
                name: string;
                stats?: {
                    acceptanceRate?: number | null;
                    avgGpa?: number | null;
                }
            }>;
            studentProfile: {
                gpa: number;
                satScore?: number;
                actScore?: number;
                apCourses: number;
                extracurriculars: string[];
                major: string;
            }
        }
    ): Promise<BatchAcceptancePredictionResult> {
        const prompt = generateBatchAcceptancePredictionPrompt(data);

        try {
            const response = await callAIWithRetry(prompt, {
                featureType: AIFeatureType.AcceptancePrediction,
                temperature: 0.5,
                max_tokens: 3000
            });

            const result = parseAIResponse<BatchAcceptancePredictionResult>(response);

            // Save recommendation (using a generic input structure)
            await AIRecommendationsRepository.create({
                user_id: userId,
                feature_type: AIFeatureType.AcceptancePrediction,
                input_data: { ...data, type: 'batch' } as Record<string, unknown>,
                output_data: JSON.parse(JSON.stringify(result)),
                confidence_score: 85,
            });

            return result;
        } catch (error) {
            console.error('Batch acceptance prediction error:', error);
            throw new Error(
                error instanceof Error
                    ? `Failed to predict acceptance batch: ${error.message}`
                    : 'Failed to predict acceptance batch'
            );
        }
    }

    /**
     * Get personalized portfolio advice
     */
    static async getPortfolioAdvice(
        userId: UUID,
        data: {
            interests: string[];
            careerGoals: string;
            currentActivities: string[];
            personalityTraits?: string[];
        }
    ): Promise<PortfolioAdviceResult> {
        const prompt = generatePortfolioAdvicePrompt(data);

        try {
            const response = await callAIWithRetry(prompt, {
                featureType: AIFeatureType.PortfolioAdvice,
                temperature: 0.7,
                max_tokens: 3000, // More tokens for comprehensive advice
            });

            const result = parseAIResponse<PortfolioAdviceResult>(response);

            // Save recommendation
            await AIRecommendationsRepository.create({
                user_id: userId,
                feature_type: AIFeatureType.PortfolioAdvice,
                input_data: data as Record<string, unknown>,
                output_data: JSON.parse(JSON.stringify(result)),
                confidence_score: 80,
            });

            return result;
        } catch (error) {
            console.error('Portfolio advice error:', error);
            throw new Error(
                error instanceof Error
                    ? `Failed to get portfolio advice: ${error.message}`
                    : 'Failed to get portfolio advice'
            );
        }
    }

    /**
     * Get course recommendations for next year
     */
    static async recommendCourses(
        userId: UUID,
        data: {
            currentCourses: string[];
            currentYear: number;
            intendedMajor: string;
            targetUniversities: string[];
            interests: string[];
        }
    ): Promise<CourseRecommendationResult> {
        const prompt = generateCourseRecommendationPrompt(data);

        try {
            const response = await callAIWithRetry(prompt, {
                featureType: AIFeatureType.CourseRecommendation,
                temperature: 0.6,
                max_tokens: 2500,
            });

            const result = parseAIResponse<CourseRecommendationResult>(response);

            // Save recommendation
            await AIRecommendationsRepository.create({
                user_id: userId,
                feature_type: AIFeatureType.CourseRecommendation,
                input_data: data as Record<string, unknown>,
                output_data: JSON.parse(JSON.stringify(result)),
                confidence_score: 75,
            });

            return result;
        } catch (error) {
            console.error('Course recommendation error:', error);
            throw new Error(
                error instanceof Error
                    ? `Failed to recommend courses: ${error.message}`
                    : 'Failed to recommend courses'
            );
        }
    }

    /**
     * Analyze grades and provide study advice
     */
    static async analyzeGrades(
        userId: UUID,
        data: {
            courseName: string;
            currentGrade: number;
            assignments: Array<{
                title: string;
                type: string;
                earnedPoints: number | null;
                totalPoints: number;
                weight: number;
            }>;
            targetGrade?: number;
        }
    ): Promise<GradeAnalysisResult> {
        const prompt = generateGradeAnalysisPrompt(data);

        try {
            const response = await callAIWithRetry(prompt, {
                featureType: AIFeatureType.GradeAnalysis,
                temperature: 0.4,
            });

            const result = parseAIResponse<GradeAnalysisResult>(response);

            // Save recommendation
            await AIRecommendationsRepository.create({
                user_id: userId,
                feature_type: AIFeatureType.GradeAnalysis,
                input_data: data as Record<string, unknown>,
                output_data: JSON.parse(JSON.stringify(result)),
                confidence_score: result.currentStanding.grade,
            });

            return result;
        } catch (error) {
            console.error('Grade analysis error:', error);
            throw new Error(
                error instanceof Error
                    ? `Failed to analyze grades: ${error.message}`
                    : 'Failed to analyze grades'
            );
        }
    }

    /**
     * Get cached recommendation for a feature type
     */
    static async getCachedRecommendation(
        userId: UUID,
        featureType: AIFeatureType
    ) {
        try {
            return await AIRecommendationsRepository.findLatestByFeatureType(
                userId,
                featureType
            );
        } catch (error) {
            console.error('Error fetching cached recommendation:', error);
            return null;
        }
    }

    /**
     * Clear cache for a specific feature type
     */
    static async clearCache(userId: UUID, featureType: AIFeatureType): Promise<void> {
        try {
            const recommendations =
                await AIRecommendationsRepository.findByFeatureType(userId, featureType);

            for (const rec of recommendations) {
                await AIRecommendationsRepository.delete(rec.id);
            }
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }
    /**
     * Analyze personality response for insights and achievements
     */
    static async analyzePersonality(
        userId: UUID,
        data: {
            question: string;
            answer: string;
        }
    ): Promise<any> {
        const prompt = generatePersonalityAnalysisPrompt(data);

        try {
            const response = await callAIWithRetry(prompt, {
                featureType: AIFeatureType.PersonalityAnalysis,
                temperature: 0.5,
                max_tokens: 1500,
            });

            const result = parseAIResponse<any>(response);

            // Save recommendation
            await AIRecommendationsRepository.create({
                user_id: userId,
                feature_type: AIFeatureType.PersonalityAnalysis,
                input_data: data as Record<string, unknown>,
                output_data: JSON.parse(JSON.stringify(result)),
                confidence_score: result.rating || 75,
            });

            return result;
        } catch (error) {
            console.error('Personality analysis error:', error);
            throw new Error(
                error instanceof Error
                    ? `Failed to analyze personality: ${error.message}`
                    : 'Failed to analyze personality'
            );
        }
    }
    /**
     * Generate essay assistance (sample, tips, feedback)
     */
    static async generateEssayAssistance(
        userId: UUID,
        data: {
            question: string;
            wordLimit?: number;
            portfolioContext: {
                achievements: string[];
                activities: string[];
                personalityAnswers: string[];
                interests: string[];
            };
            existingDraft?: string;
        }
    ): Promise<any> {
        const prompt = generateEssayAssistancePrompt(data);

        try {
            const response = await callAIWithRetry(prompt, {
                featureType: AIFeatureType.EssayAssistance,
                temperature: 0.7,
                max_tokens: 2000,
            });

            const result = parseAIResponse<any>(response);

            // Save recommendation
            await AIRecommendationsRepository.create({
                user_id: userId,
                feature_type: AIFeatureType.EssayAssistance,
                input_data: data as Record<string, unknown>,
                output_data: JSON.parse(JSON.stringify(result)),
                confidence_score: 80,
            });

            return result;
        } catch (error) {
            console.error('Essay assistance error:', error);
            throw new Error(
                error instanceof Error
                    ? `Failed to generate essay assistance: ${error.message}`
                    : 'Failed to generate essay assistance'
            );
        }
    }
}
