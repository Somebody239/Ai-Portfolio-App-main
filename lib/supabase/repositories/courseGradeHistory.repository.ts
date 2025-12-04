/**
 * CourseGradeHistoryRepository - Data access layer for course grade history
 * Single responsibility: Handle CRUD operations for course_grade_history table
 */

import { supabase } from "@/lib/supabase/client";
import { CourseGradeHistory } from "@/lib/types";

export class CourseGradeHistoryRepository {
    async create(data: Omit<CourseGradeHistory, "id" | "created_at">): Promise<CourseGradeHistory> {
        const { data: record, error } = await (supabase as any)
            .from("course_grade_history")
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        return record as CourseGradeHistory;
    }

    async update(id: string, data: Partial<Omit<CourseGradeHistory, "id" | "created_at">>): Promise<CourseGradeHistory> {
        const { data: record, error } = await (supabase as any)
            .from("course_grade_history")
            .update(data)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return record as CourseGradeHistory;
    }

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from("course_grade_history")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }

    async getByCourseId(courseId: string): Promise<CourseGradeHistory[]> {
        const { data, error } = await supabase
            .from("course_grade_history")
            .select("*")
            .eq("course_id", courseId)
            .order("grade_date", { ascending: false });

        if (error) throw error;
        return (data as CourseGradeHistory[]) || [];
    }

    async getLatestByCourseId(courseId: string): Promise<CourseGradeHistory | null> {
        const { data, error } = await supabase
            .from("course_grade_history")
            .select("*")
            .eq("course_id", courseId)
            .order("grade_date", { ascending: false })
            .limit(1)
            .single();

        if (error) {
            if (error.code === "PGRST116") return null;
            throw error;
        }
        return data as CourseGradeHistory;
    }

    async getFinalGrade(courseId: string): Promise<CourseGradeHistory | null> {
        const { data, error } = await supabase
            .from("course_grade_history")
            .select("*")
            .eq("course_id", courseId)
            .eq("is_final", true)
            .single();

        if (error) {
            if (error.code === "PGRST116") return null;
            throw error;
        }
        return data as CourseGradeHistory;
    }
}
