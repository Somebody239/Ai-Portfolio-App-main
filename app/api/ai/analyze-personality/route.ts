import { NextResponse } from 'next/server';
import { AchievementsManager } from '@/managers/AchievementsManager';
import { AIManager } from '@/managers/AIManager';

export async function POST(request: Request) {
    try {
        const { userId, text, question } = await request.json();

        if (!userId || !text) {
            return NextResponse.json({ error: 'Missing userId or text' }, { status: 400 });
        }

        // Use the new AIManager method
        const analysis = await AIManager.analyzePersonality(userId, {
            question: question || "What motivates you?",
            answer: text
        });

        // Save extracted achievements
        const achievementsManager = new AchievementsManager();
        let savedCount = 0;

        if (analysis.achievements && Array.isArray(analysis.achievements)) {
            for (const achievement of analysis.achievements) {
                try {
                    await achievementsManager.create(userId, {
                        title: achievement.title,
                        category: achievement.category || "Other",
                        description: achievement.description || "Extracted from personality analysis"
                    });
                    savedCount++;
                } catch (err) {
                    console.error("Failed to save achievement:", err);
                }
            }
        }

        return NextResponse.json({
            success: true,
            count: savedCount,
            analysis: {
                rating: analysis.rating,
                strengths: analysis.strengths,
                weaknesses: analysis.weaknesses,
                improvements: analysis.improvements,
                personalityTraits: analysis.personalityTraits
            }
        });
    } catch (error) {
        console.error('AI Analysis Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
