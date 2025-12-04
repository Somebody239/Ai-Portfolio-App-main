'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { CoursesManager } from '@/managers/CoursesManager';
import { Course, Assignment, AssignmentType } from '@/lib/types';
import { useCourseAssignments } from '@/hooks/useCourseAssignments';
import { useCourseGradeHistory } from '@/hooks/useCourseGradeHistory';
import { GradeHistoryChart } from '@/components/courses/GradeHistoryChart';
import { AssignmentList } from '@/components/courses/AssignmentList';
import { GradeSummary } from '@/components/courses/GradeSummary';
import { QuickAssignmentForm } from '@/components/courses/QuickAssignmentForm';
import { AssignmentsManager } from '@/managers/AssignmentsManager';
import { Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { AssignmentStatus } from '@/lib/types';
import { AppShell } from '@/components/layout/AppShell';

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useUser();
    const courseId = params.courseId as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [loadingCourse, setLoadingCourse] = useState(true);

    const { assignments, loading: loadingAssignments, refetch: refetchAssignments } = useCourseAssignments(courseId);
    const { history, loading: loadingHistory, refetch: refetchHistory } = useCourseGradeHistory(courseId);

    const coursesManager = React.useMemo(() => new CoursesManager(), []);
    const assignmentsManager = React.useMemo(() => new AssignmentsManager(), []);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) return;
            try {
                const data = await coursesManager.getById(courseId);
                if (!data) {
                    toast.error("Course not found");
                    router.push('/academics');
                    return;
                }
                setCourse(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load course");
            } finally {
                setLoadingCourse(false);
            }
        };

        fetchCourse();
    }, [courseId, coursesManager, router]);

    const handleQuickAdd = async (data: { title: string; grade: number; type: AssignmentType }) => {
        if (!user || !course) return;

        // ...

        try {
            await assignmentsManager.create(
                course.id,
                user.id,
                {
                    title: data.title,
                    assignment_type: data.type,
                    total_points: 100,
                    earned_points: data.grade,
                    weight_percentage: 10, // Default weight, can be adjusted later
                    status: AssignmentStatus.Graded,
                    due_date: new Date().toISOString(),
                    submitted_date: new Date().toISOString(),
                }
            );

            toast.success("Assignment added!");
            refetchAssignments();
            refetchHistory();
            // Refresh course to get updated grade
            const updatedCourse = await coursesManager.getById(course.id);
            if (updatedCourse) setCourse(updatedCourse);

            // Trigger global update for sidebar
            window.dispatchEvent(new Event('portfolio-updated'));

        } catch (error) {
            console.error(error);
            toast.error("Failed to add assignment");
        }
    };

    const handleDeleteAssignment = async (id: string) => {
        if (!confirm("Are you sure you want to delete this assignment?")) return;
        try {
            await assignmentsManager.delete(id);
            toast.success("Assignment deleted");
            refetchAssignments();
            refetchHistory();

            // Refresh course to get updated grade
            if (course) {
                const updatedCourse = await coursesManager.getById(course.id);
                if (updatedCourse) setCourse(updatedCourse);
            }

            // Trigger global update for sidebar
            window.dispatchEvent(new Event('portfolio-updated'));
        } catch (error) {
            console.error("Failed to delete assignment:", error);
            toast.error("Failed to delete assignment");
        }
    };

    if (loadingCourse) {
        return (
            <AppShell>
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
                </div>
            </AppShell>
        );
    }

    if (!course) {
        return (
            <AppShell>
                <div className="flex items-center justify-center h-screen">
                    <p className="text-zinc-500">Course not found</p>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">{course.name}</h1>
                    <p className="text-zinc-400">
                        {course.semester} • Grade {course.year} • {course.level}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Quick Add */}
                        <section>
                            <h2 className="text-lg font-semibold text-white mb-4">Quick Add Grade</h2>
                            <QuickAssignmentForm onSubmit={handleQuickAdd} />
                        </section>

                        {/* Grade History Graph */}
                        <section>
                            <h2 className="text-lg font-semibold text-white mb-4">Performance Trend</h2>
                            {!loadingHistory && (
                                <GradeHistoryChart history={history} />
                            )}
                        </section>

                        {/* Assignments List */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-white">Assignments</h2>
                                <Button variant="outline" size="sm">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Schedule
                                </Button>
                            </div>
                            {!loadingAssignments && (
                                <AssignmentList
                                    assignments={assignments}
                                    onEdit={() => { }} // TODO: Implement full edit modal if needed
                                    onDelete={handleDeleteAssignment}
                                    onAdd={() => { }} // Not used here as we have Quick Add
                                />
                            )}
                        </section>
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="space-y-6">
                        {/* Grade Summary Card */}
                        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 sticky top-6">
                            <h2 className="text-lg font-semibold text-white mb-6">Current Standing</h2>
                            <GradeSummary
                                assignments={assignments}
                                reportCardGrade={course.grade || undefined}
                                courseLevel={course.level}
                            />

                            <div className="mt-8 pt-6 border-t border-zinc-800">
                                <h3 className="text-sm font-medium text-zinc-400 mb-4">Course Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Assignments</span>
                                        <span className="text-zinc-300">{assignments.length}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Missing</span>
                                        <span className="text-zinc-300">
                                            {assignments.filter(a => a.status === AssignmentStatus.Missing).length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Highest Grade</span>
                                        <span className="text-emerald-400">
                                            {Math.max(...assignments.map(a => a.earned_points || 0), 0)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
