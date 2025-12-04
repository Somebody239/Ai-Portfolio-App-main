import { supabase } from '../client';
import { UserSettings } from '@/lib/types';

export class UserSettingsRepository {
    async getByUserId(userId: string): Promise<UserSettings | null> {
        const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
        return data;
    }

    async upsert(userId: string, settings: Partial<UserSettings>): Promise<UserSettings> {
        const { data, error } = await supabase
            .from('user_settings')
            // @ts-ignore: Supabase generated types are too strict
            .upsert({ user_id: userId, ...settings })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}
