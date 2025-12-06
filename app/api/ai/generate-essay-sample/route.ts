import { NextResponse } from 'next/server';
import { AIManager } from '@/managers/AIManager';
import { AchievementsRepository } from '@/lib/supabase/repositories/achievements.repository';
import { ExtracurricularsRepository } from '@/lib/supabase/repositories/extracurriculars.repository';
import { PersonalityRepository } from '@/lib/supabase/repositories/personality.repository';
import { UsersRepository } from '@/lib/supabase/repositories/users.repository';

export async function POST(request: Request) {
    try {
        const { userId, question, wordLimit } = await request.json();

        if (!userId || !question) {
            return NextResponse.json({ error: 'Missing userId or question' }, { status: 400 });
        }

        // Instantiate repositories
        const achievementsRepo = new AchievementsRepository();
        const extracurricularsRepo = new ExtracurricularsRepository();
        const personalityRepo = new PersonalityRepository();
        const usersRepo = new UsersRepository();

        // Fetch user context
        const [achievements, activities, personalityAnswers, user] = await Promise.all([
            achievementsRepo.getByUserId(userId),
            extracurricularsRepo.getByUserId(userId),
            personalityRepo.getByUserId(userId),
            usersRepo.getById(userId)
        ]);

        const context = {
            achievements: achievements.map(a => `${a.title} (${a.category})`),
            activities: activities.map(a => `${a.name} - ${a.title} (${a.hours_per_week} hrs/wk)`),
            personalityAnswers: personalityAnswers.map(p => `Q: ${p.question} A: ${p.answer}`),
            interests: user?.interests || []
        };

        const result = await AIManager.generateEssayAssistance(userId, {
            question,
            wordLimit: wordLimit || 650,
            portfolioContext: context
        });

        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error('Essay Generation Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
