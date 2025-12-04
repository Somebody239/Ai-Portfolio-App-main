import { supabase } from '../client';
import { Opportunity } from '@/lib/types';

export class OpportunitiesRepository {
    async getAll(): Promise<Opportunity[]> {
        const { data, error } = await supabase
            .from('opportunities')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    async getByType(type: string): Promise<Opportunity[]> {
        const { data, error } = await supabase
            .from('opportunities')
            .select('*')
            .eq('type', type)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }
}
