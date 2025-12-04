import { supabase } from "../client";

export abstract class BaseRepository<T> {
    protected supabase = supabase;
    protected table: string;

    constructor(tableName: string) {
        this.table = tableName;
    }

    async create(data: Partial<T>): Promise<T> {
        const { data: result, error } = await this.supabase
            .from(this.table)
            // @ts-ignore: Supabase generated types are too strict
            .insert(data as any)
            .select()
            .single();

        if (error) throw error;
        return result as T;
    }

    async update(id: string, updates: Partial<T>): Promise<T> {
        const { data, error } = await this.supabase
            .from(this.table)
            // @ts-ignore: Supabase generated types are too strict
            .update(updates as any)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data as T;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from(this.table)
            .delete()
            .eq("id", id);

        if (error) throw error;
    }

    async getById(id: string): Promise<T | null> {
        const { data, error } = await this.supabase
            .from(this.table)
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            if (error.code === "PGRST116") return null; // Not found
            throw error;
        }
        return data as T;
    }
}
