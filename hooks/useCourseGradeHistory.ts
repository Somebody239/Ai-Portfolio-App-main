/**
 * useCourseGradeHistory - Hook for managing course grade history
 * Single responsibility: Fetch and manage grade history for a course
 */

import { useState, useEffect } from "react";
import { CourseGradeHistory } from "@/lib/types";
import { CourseGradeHistoryRepository } from "@/lib/supabase/repositories/courseGradeHistory.repository";

export function useCourseGradeHistory(courseId: string | null) {
    const [history, setHistory] = useState<CourseGradeHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const repository = new CourseGradeHistoryRepository();

    const fetchHistory = async () => {
        if (!courseId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await repository.getByCourseId(courseId);
            setHistory(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to load grade history"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [courseId]);

    return {
        history,
        loading,
        error,
        refetch: fetchHistory,
    };
}
