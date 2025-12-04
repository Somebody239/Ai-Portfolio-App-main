/**
 * CoursesSection - Course list display component
 * Single responsibility: Display and manage course list
 */
"use client";

import { useState } from "react";
import { Course } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { CourseModal } from "@/components/modals/courses/CourseModal";
import { CoursesManager } from "@/managers/CoursesManager";
import { EmptyState } from "@/components/common/EmptyState";
import { BookOpen } from "lucide-react";

interface CoursesSectionProps {
    courses: Course[];
    userId: string;
    onUpdate: () => void;
}

export function CoursesSection({ courses, userId, onUpdate }: CoursesSectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);

    // Group courses by Year -> Semester
    const groupedCourses = courses.reduce((acc, course) => {
        if (!acc[course.year]) acc[course.year] = [];
        acc[course.year].push(course);
        return acc;
    }, {} as Record<number, Course[]>);

    // Sort years descending
    const sortedYears = Object.keys(groupedCourses).map(Number).sort((a, b) => b - a);

    const handleSuccess = async () => {
        await onUpdate();
        setIsModalOpen(false);
        setEditingCourse(undefined);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this course?")) return;

        try {
            const manager = new CoursesManager();
            await manager.delete(id);
            await onUpdate();
        } catch (error) {
            console.error("Failed to delete course:", error);
            alert("Failed to delete course. Please try again.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-zinc-100">Coursework</h2>
                <Button
                    onClick={() => {
                        setEditingCourse(undefined);
                        setIsModalOpen(true);
                    }}
                    size="sm"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Course
                </Button>
            </div>

            {sortedYears.length === 0 ? (
                <EmptyState
                    icon={<BookOpen size={32} />}
                    title="No courses added yet"
                    description="Add your courses to calculate your GPA and track your academic progress."
                />
            ) : (
                sortedYears.map((year) => (
                    <div key={year} className="space-y-3">
                        <h3 className="text-sm font-medium text-zinc-400 bg-zinc-900/50 p-2 rounded-md">
                            {year} - {year + 1} School Year
                        </h3>
                        <div className="grid gap-3">
                            {groupedCourses[year].map((course) => (
                                <div
                                    key={course.id}
                                    className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="font-medium text-zinc-100">{course.name}</div>
                                        <div className="text-xs text-zinc-500 flex gap-2 mt-1">
                                            <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300">
                                                {course.level}
                                            </span>
                                            <span>{course.semester}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-emerald-400">{course.grade}</div>
                                            <div className="text-[10px] text-zinc-500 uppercase">Grade</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    setEditingCourse(course);
                                                    setIsModalOpen(true);
                                                }}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Edit2 className="w-4 h-4 text-zinc-400" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(course.id)}
                                                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}

            <CourseModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingCourse(undefined);
                }}
                onSuccess={handleSuccess}
                userId={userId}
                initialData={editingCourse}
                mode={editingCourse ? "edit" : "create"}
            />
        </div>
    );
}
