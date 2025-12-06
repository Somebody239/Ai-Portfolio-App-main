import { EssaysRepository } from "@/lib/supabase/repositories/essays.repository";
import { ApplicationEssay } from "@/lib/types";
import { InputSanitizer } from "@/lib/security/InputSanitizer";

export class EssayManager {
    private repository: EssaysRepository;

    constructor() {
        this.repository = new EssaysRepository();
    }

    async getUserEssays(userId: string): Promise<ApplicationEssay[]> {
        return await this.repository.getByUserId(userId);
    }

    async getEssay(id: string): Promise<ApplicationEssay> {
        return await this.repository.getById(id);
    }

    async createEssay(
        userId: string,
        question: string,
        source: string,
        wordLimit?: number
    ): Promise<ApplicationEssay> {
        // Validate question
        if (!this.validateEssayQuestion(question)) {
            throw new Error("Essay question must be between 10 and 1000 characters");
        }

        // Validate word limit if provided
        if (wordLimit !== undefined && !this.validateWordLimit(wordLimit)) {
            throw new Error("Word limit must be between 1 and 10,000");
        }

        // Sanitize inputs
        const sanitizedQuestion = InputSanitizer.sanitizeString(question);
        const sanitizedSource = InputSanitizer.sanitizeString(source || 'Custom');

        return await this.repository.create(userId, {
            question_text: sanitizedQuestion,
            question_source: sanitizedSource,
            word_limit: wordLimit
        });
    }

    async updateEssay(id: string, updates: Partial<ApplicationEssay>): Promise<ApplicationEssay> {
        // Sanitize text fields if present
        if (updates.question_text) {
            updates.question_text = InputSanitizer.sanitizeString(updates.question_text);
        }
        if (updates.question_source) {
            updates.question_source = InputSanitizer.sanitizeString(updates.question_source);
        }

        return await this.repository.update(id, updates);
    }

    async saveDraft(id: string, draftText: string): Promise<void> {
        const sanitizedDraft = InputSanitizer.sanitizeString(draftText);
        await this.repository.updateDraft(id, sanitizedDraft);
    }

    async saveAISuggestions(id: string, suggestions: string, tips?: string): Promise<void> {
        await this.repository.updateAISuggestions(id, suggestions, tips);
    }

    async deleteEssay(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    validateEssayQuestion(question: string): boolean {
        const trimmed = question.trim();
        return trimmed.length >= 10 && trimmed.length <= 1000;
    }

    validateWordLimit(limit: number): boolean {
        return limit > 0 && limit <= 10000;
    }

    countWords(text: string): number {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    isWithinWordLimit(text: string, limit: number): boolean {
        const wordCount = this.countWords(text);
        return wordCount <= limit;
    }
}
