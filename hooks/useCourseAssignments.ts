/**
 * useCourseAssignments - Hook for managing course assignments
 * Single responsibility: Fetch and manage assignments for a course
 */

import { useState, useEffect } from "react";
import { Assignment } from "@/lib/types";
import { AssignmentsManager } from "@/managers/AssignmentsManager";

export function useCourseAssignments(courseId: string | null) {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const manager = new AssignmentsManager();

    const fetchAssignments = async () => {
        if (!courseId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await manager.getByCourseId(courseId);
            setAssignments(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to load assignments"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, [courseId]);

    return {
        assignments,
        loading,
        error,
        refetch: fetchAssignments,
    };
}
