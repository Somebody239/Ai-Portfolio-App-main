import { EssayAIRequest, EssayAIResponse, AIExtractedData } from "@/lib/types";
import {
    callAIWithRetry,
    parseAIResponse,
    generateEssayAssistancePrompt,
    AIFeatureType,
} from '@/lib/utils/ai';
import { AIRecommendationsRepository } from '@/lib/supabase/repositories/ai-recommendations.repository';

interface EssayAssistanceResult {
    responseType: 'sample_essay' | 'tips_only' | 'follow_up_questions';
    outline: {
        hook: string;
        bodyParagraphs: Array<{ theme: string; content: string }>;
        conclusion: string;
    };
    tips: string[];
    strengthsInDraft: string[];
    areasToImprove: string[];
    suggestedRevisions: string[];
}

export class AIEssayAssistant {
    /**
     * Provides AI assistance for essay writing using Grok
     */
    async getEssayHelp(request: EssayAIRequest): Promise<EssayAIResponse> {
        // Assess data sufficiency to provide better prompts
        const dataSufficiency = this.assessDataSufficiency(request.portfolioContext);

        // If insufficient data, still try AI but with lower expectations
        if (dataSufficiency === 'insufficient') {
            return {
                responseType: 'follow_up_questions',
                content: 'I need more information to help you write this essay effectively.',
                followUpQuestions: [
                    'Can you describe a specific challenge you faced and how you overcame it?',
                    'What activity or experience has been most meaningful to you and why?',
                    'How do you see this topic connecting to your future goals?'
                ]
            };
        }

        try {
            const prompt = generateEssayAssistancePrompt({
                question: request.question,
                wordLimit: request.wordLimit,
                portfolioContext: request.portfolioContext,
                existingDraft: request.draft,
            });

            const response = await callAIWithRetry(prompt, {
                featureType: AIFeatureType.EssayAssistance,
                temperature: 0.7,  // Higher for creative writing help
                max_tokens: 3000,  // Essays need more output
            });

            const result = parseAIResponse<EssayAssistanceResult>(response);

            // Save to database for caching
            await AIRecommendationsRepository.create({
                user_id: request.userId,
                feature_type: AIFeatureType.EssayAssistance,
                input_data: {
                    question: request.question,
                    wordLimit: request.wordLimit,
                    hasDraft: !!request.draft,
                },
                output_data: JSON.parse(JSON.stringify(result)),
                confidence_score: 80,
            });

            // Convert to EssayAIResponse format
            return this.convertToEssayResponse(result, request.wordLimit);
        } catch (error) {
            console.error('Essay AI error:', error);
            // Fallback to tips-only response if AI fails
            return {
                responseType: 'tips_only',
                content: 'Unable to generate full assistance. Here are some general tips:',
                tips: [
                    'Start with a specific moment or anecdote',
                    'Connect your experiences to personal growth',
                    'Be authentic - admissions officers value unique perspectives',
                    `Stay within the ${request.wordLimit || 650}-word limit`,
                    'Show, don\'t tell - use concrete examples'
                ]
            };
        }
    }

    /**
     * Convert AI response to EssayAIResponse format
     */
    private convertToEssayResponse(
        result: EssayAssistanceResult,
        wordLimit?: number
    ): EssayAIResponse {
        // Build the content from outline
        const outlineContent = `**Essay Outline**

**Opening Hook**: ${result.outline.hook}

${result.outline.bodyParagraphs.map((p, i) =>
            `**Body Paragraph ${i + 1}** - ${p.theme}:
${p.content}`).join('\n\n')}

**Conclusion**: ${result.outline.conclusion}

**Word Limit**: ${wordLimit || 650} words`;

        return {
            responseType: result.responseType,
            content: outlineContent,
            tips: result.tips,
            followUpQuestions: result.areasToImprove,
        };
    }

    /**
     * Assesses if student has enough portfolio data for AI to generate helpful content
     */
    assessDataSufficiency(context: EssayAIRequest['portfolioContext']): 'sufficient' | 'partial' | 'insufficient' {
        const achievementCount = context.achievements.length;
        const activityCount = context.activities.length;
        const personalityCount = context.personalityAnswers.length;
        const totalDataPoints = achievementCount + activityCount + personalityCount;

        if (totalDataPoints >= 5 && achievementCount >= 1 && activityCount >= 1) {
            return 'sufficient';
        }

        if (totalDataPoints >= 2) {
            return 'partial';
        }

        return 'insufficient';
    }
}
