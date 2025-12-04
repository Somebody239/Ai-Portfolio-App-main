/**
 * AssignmentsRepository - Data access layer for assignments
 * Single responsibility: Handle CRUD operations for assignments table
 */

import { supabase } from "@/lib/supabase/client";
import { Assignment } from "@/lib/types";

export class AssignmentsRepository {
    async create(data: Omit<Assignment, "id" | "created_at" | "updated_at">): Promise<Assignment> {
        const { data: assignment, error } = await (supabase as any)
            .from("assignments")
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        return assignment as Assignment;
    }

    async update(id: string, data: Partial<Omit<Assignment, "id" | "created_at">>): Promise<Assignment> {
        const { data: assignment, error } = await (supabase as any)
            .from("assignments")
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return assignment as Assignment;
    }

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from("assignments")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }

    async getById(id: string): Promise<Assignment | null> {
        const { data, error } = await supabase
            .from("assignments")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            if (error.code === "PGRST116") return null;
            throw error;
        }
        return data as Assignment;
    }

    async getByCourseId(courseId: string): Promise<Assignment[]> {
        const { data, error } = await supabase
            .from("assignments")
            .select("*")
            .eq("course_id", courseId)
            .order("due_date", { ascending: true, nullsFirst: false });

        if (error) throw error;
        return (data as Assignment[]) || [];
    }

    async getByUserId(userId: string): Promise<Assignment[]> {
        const { data, error } = await supabase
            .from("assignments")
            .select("*")
            .eq("user_id", userId)
            .order("due_date", { ascending: true, nullsFirst: false });

        if (error) throw error;
        return (data as Assignment[]) || [];
    }

    async getUpcoming(userId: string, daysAhead: number = 7): Promise<Assignment[]> {
        const today = new Date().toISOString().split('T')[0];
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);
        const futureDateStr = futureDate.toISOString().split('T')[0];

        const { data, error } = await supabase
            .from("assignments")
            .select("*")
            .eq("user_id", userId)
            .gte("due_date", today)
            .lte("due_date", futureDateStr)
            .order("due_date", { ascending: true });

        if (error) throw error;
        return (data as Assignment[]) || [];
    }
}
