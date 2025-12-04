
/**
 * PersonalityManager - Business logic for personality tests and essays
 * Single responsibility: Manage personality questions and essay prompts
 */

import { PersonalityRepository } from "@/lib/supabase/repositories/personality.repository";
import { PersonalityInput, EssayPrompt } from "@/lib/types";

export class PersonalityManager {
    private repository: PersonalityRepository;

    constructor() {
        this.repository = new PersonalityRepository();
    }

    async getUserAnswers(userId: string): Promise<PersonalityInput[]> {
        return await this.repository.getByUserId(userId);
    }

    async saveAnswer(userId: string, question: string, answer: string): Promise<PersonalityInput> {
        if (!answer.trim()) {
            throw new Error("Answer cannot be empty");
        }
        return await this.repository.upsert(userId, question, answer);
    }

    getQuestions(): string[] {
        return [
            "How would you describe your ideal learning environment?",
            "What is a topic or idea that you find so engaging that it makes you lose all track of time?",
            "Describe a problem you've solved or a problem you'd like to solve.",
            "What extracurricular activity has been most meaningful to you and why?",
            "What are your top 3 personal values?",
        ];
    }

    getEssayPrompts(): EssayPrompt[] {
        return [
            {
                id: "common-app-1",
                prompt_text: "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.",
                category: "common_app",
                word_limit: 650,
            },
            {
                id: "common-app-2",
                prompt_text: "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did you affect it, and what did you learn from the experience?",
                category: "common_app",
                word_limit: 650,
            },
            {
                id: "common-app-3",
                prompt_text: "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?",
                category: "common_app",
                word_limit: 650,
            },
            {
                id: "common-app-4",
                prompt_text: "Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?",
                category: "common_app",
                word_limit: 650,
            },
            {
                id: "common-app-5",
                prompt_text: "Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.",
                category: "common_app",
                word_limit: 650,
            },
            {
                id: "common-app-6",
                prompt_text: "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?",
                category: "common_app",
                word_limit: 650,
            },
            {
                id: "common-app-7",
                prompt_text: "Share an essay on any topic of your choice. It can be one you've already written, one that responds to a different prompt, or one of your own design.",
                category: "common_app",
                word_limit: 650,
            },
        ];
    }
}
