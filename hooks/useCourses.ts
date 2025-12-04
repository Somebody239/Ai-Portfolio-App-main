/**
 * useCourses - Hook for managing courses globally
 * Single responsibility: Fetch and manage courses for the current user
 */

import { useState, useEffect } from "react";
import { Course } from "@/lib/types";
import { CoursesManager } from "@/managers/CoursesManager";
import { useUser } from "@/hooks/useUser";

export function useCourses() {
    const { user } = useUser();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const manager = new CoursesManager();

    const fetchCourses = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await manager.getByUserId(user.id);
            setCourses(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to load courses"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();

        const handleUpdate = () => fetchCourses();
        window.addEventListener('portfolio-updated', handleUpdate);
        return () => window.removeEventListener('portfolio-updated', handleUpdate);
    }, [user?.id]);

    return {
        courses,
        loading,
        error,
        refetch: fetchCourses,
    };
}
