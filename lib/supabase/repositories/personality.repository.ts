import { supabase } from '../client';
import { PersonalityInput } from '@/lib/types';

export class PersonalityRepository {
    async getByUserId(userId: string): Promise<PersonalityInput[]> {
        const { data, error } = await supabase
            .from('personality_inputs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    }

    async upsert(userId: string, question: string, answer: string, isCustom: boolean = false): Promise<PersonalityInput> {
        const { data: existing } = await supabase
            .from('personality_inputs')
            .select('*')
            .eq('user_id', userId)
            .eq('question', question)
            .single() as { data: PersonalityInput | null; error: any };

        if (existing) {
            return await this.update(existing.id, { answer });
        } else {
            return await this.create({
                user_id: userId,
                question,
                answer,
                is_custom: isCustom
            });
        }
    }

    async create(data: Omit<PersonalityInput, 'id' | 'created_at'>): Promise<PersonalityInput> {
        const { data: result, error } = await supabase
            .from('personality_inputs')
            // @ts-ignore: Supabase generated types are too strict
            .insert(data as any)
            .select()
            .single();

        if (error) throw error;
        return result as PersonalityInput;
    }

    async update(id: string, updates: Partial<PersonalityInput>): Promise<PersonalityInput> {
        const { data, error } = await supabase
            .from('personality_inputs')
            // @ts-ignore: Supabase generated types are too strict
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as PersonalityInput;
    }
}
