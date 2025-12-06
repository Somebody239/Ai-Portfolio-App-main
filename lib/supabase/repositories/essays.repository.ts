import { supabase } from '../client';
import { ApplicationEssay } from '@/lib/types';

export class EssaysRepository {
    async getByUserId(userId: string): Promise<ApplicationEssay[]> {
        const { data, error } = await supabase
            .from('application_essays')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    async getById(id: string): Promise<ApplicationEssay> {
        const { data, error } = await supabase
            .from('application_essays')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) throw new Error('Essay not found');
        return data as ApplicationEssay;
    }

    async create(userId: string, essay: Partial<ApplicationEssay>): Promise<ApplicationEssay> {
        const { data, error } = await supabase
            .from('application_essays')
            // @ts-ignore: Supabase generated types are too strict
            .insert({
                user_id: userId,
                question_text: essay.question_text,
                question_source: essay.question_source || 'Custom',
                word_limit: essay.word_limit,
                status: 'not_started'
            })
            .select()
            .single();

        if (error) throw error;
        return data as ApplicationEssay;
    }

    async update(id: string, updates: Partial<ApplicationEssay>): Promise<ApplicationEssay> {
        const { data, error } = await supabase
            .from('application_essays')
            // @ts-ignore: Supabase generated types are too strict
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as ApplicationEssay;
    }

    async updateDraft(id: string, draftText: string): Promise<void> {
        const { error } = await supabase
            .from('application_essays')
            // @ts-ignore: Supabase generated types are too strict
            .update({
                user_draft: draftText,
                status: draftText && draftText.trim().length > 0 ? 'drafting' : 'not_started'
            })
            .eq('id', id);

        if (error) throw error;
    }

    async updateAISuggestions(id: string, suggestions: string, tips?: string): Promise<void> {
        const { error } = await supabase
            .from('application_essays')
            // @ts-ignore: Supabase generated types are too strict
            .update({
                ai_suggestions: suggestions,
                ai_tips: tips
            })
            .eq('id', id);

        if (error) throw error;
    }

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('application_essays')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
}
