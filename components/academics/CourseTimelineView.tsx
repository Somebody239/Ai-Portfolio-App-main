'use client';

import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Course, CourseTerm } from '@/lib/types';
import { CourseTimelineViewModel } from '@/viewmodels/CourseTimelineViewModel';
import { CourseYearCard } from './CourseYearCard';
import { UploadCloud, Plus, BookOpen, GraduationCap, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { InlineCourseRecommender } from "./InlineCourseRecommender";
import { InlineCourseScanner } from "./InlineCourseScanner";
import { Scan } from "lucide-react";

interface CourseTimelineViewProps {
    courses: Course[];
    onAddCourse: (semester?: CourseTerm) => void;
    onEditCourse: (course: Course) => void;
    onDeleteCourse: (course: Course) => void;
    onCourseClick: (course: Course) => void;
    selectedYear: number;
    onYearChange: (year: number) => void;
    onAddCourses: (courses: any[]) => void;
    userId: string;
}

export function CourseTimelineView({
    courses,
    onAddCourse,
    onEditCourse,
    onDeleteCourse,
    onCourseClick,
    selectedYear,
    onYearChange,
    onAddCourses,
    userId
}: CourseTimelineViewProps) {
    const [isRecommenderExpanded, setIsRecommenderExpanded] = useState(false);
    const [isScannerExpanded, setIsScannerExpanded] = useState(false);
    const prevYearRef = useRef(selectedYear);
    const direction = selectedYear > prevYearRef.current ? 1 : -1;

    // Update ref after calculating direction
    React.useEffect(() => {
        prevYearRef.current = selectedYear;
    }, [selectedYear]);

    const groupedCourses = useMemo(() =>
        CourseTimelineViewModel.groupCoursesByYear(courses),
        [courses]);

    const currentYearCourses = groupedCourses.get(selectedYear) || [];
    const yearStats = CourseTimelineViewModel.getYearStats(currentYearCourses);

    // Separate by semester for compact display
    const fallCourses = currentYearCourses.filter(c => c.semester === 'Fall');
    const springCourses = currentYearCourses.filter(c => c.semester === 'Spring');

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0
        })
    };

    // Helper to render empty slots
    const renderCourseGrid = (semesterCourses: Course[], semester: CourseTerm) => {
        const slots = Array(4).fill(null);

        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {slots.map((_, index) => {
                    const course = semesterCourses[index];

                    if (course) {
                        return (
                            <CourseYearCard
                                key={course.id}
                                course={course}
                                onEdit={onEditCourse}
                                onDelete={onDeleteCourse}
                                onClick={onCourseClick}
                            />
                        );
                    }

                    return (
                        <motion.button
                            key={`empty-${semester}-${index}`}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => onAddCourse(semester)}
                            className="group relative h-[88px] rounded-lg border-2 border-dashed border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all flex flex-col items-center justify-center gap-2"
                        >
                            <div className="p-2 rounded-full bg-zinc-800/50 text-zinc-600 group-hover:bg-zinc-800 group-hover:text-zinc-400 transition-colors">
                                <Plus className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-500">
                                Add Course
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header & Year Tabs */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Coursework</h2>
                    <Button
                        variant="secondary"
                        className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20"
                        onClick={() => setIsScannerExpanded(!isScannerExpanded)}
                    >
                        <Scan className="w-4 h-4 mr-2" />
                        Scan Schedule
                    </Button>
                </div>

                <InlineCourseScanner
                    userId={userId}
                    onCoursesDetected={onAddCourses}
                    isExpanded={isScannerExpanded}
                    onClose={() => setIsScannerExpanded(false)}
                />

                {/* Year Tabs */}
                <div className="flex p-1 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50 overflow-x-auto">
                    {[9, 10, 11, 12].map((year) => (
                        <button
                            key={year}
                            onClick={() => onYearChange(year)}
                            className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${selectedYear === year
                                ? 'text-white'
                                : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {selectedYear === year && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-zinc-800 rounded-lg shadow-sm"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">Grade {year}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50 flex flex-col items-center justify-center gap-1">
                    <div className="text-2xl font-bold text-white">{yearStats.gpa}</div>
                    <div className="text-xs text-zinc-500 flex items-center gap-1">
                        <Award className="w-3 h-3" /> GPA
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50 flex flex-col items-center justify-center gap-1">
                    <div className="text-2xl font-bold text-white">{yearStats.credits}</div>
                    <div className="text-xs text-zinc-500 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" /> Credits
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50 flex flex-col items-center justify-center gap-1">
                    <div className="text-2xl font-bold text-white">{yearStats.courseCount}</div>
                    <div className="text-xs text-zinc-500 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> Courses
                    </div>
                </div>
            </div>

            {/* Swipeable Content */}
            <div className="relative min-h-[400px]">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={selectedYear}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.15 }
                        }}
                        className="w-full space-y-8"
                    >
                        {/* Fall Semester */}
                        <div>
                            <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                                Fall Semester
                            </h3>
                            {renderCourseGrid(fallCourses, CourseTerm.Fall)}
                        </div>

                        {/* Spring Semester */}
                        <div>
                            <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                                Spring Semester
                            </h3>
                            {renderCourseGrid(springCourses, CourseTerm.Spring)}
                        </div>

                        {/* AI Course Recommendations Trigger */}
                        <div className="mt-8">
                            {!isRecommenderExpanded ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Button
                                        onClick={() => setIsRecommenderExpanded(true)}
                                        className="w-full h-auto py-8 border-2 border-dashed border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-indigo-500/50 group transition-all duration-300 whitespace-normal"
                                    >
                                        <div className="flex flex-col items-center gap-2 w-full">
                                            <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all duration-300">
                                                <Sparkles className="w-6 h-6" />
                                            </div>
                                            <div className="text-center w-full">
                                                <span className="text-lg font-semibold text-zinc-300 group-hover:text-white block">
                                                    Get AI Course Suggestions
                                                </span>
                                                <span className="text-sm text-zinc-500 group-hover:text-zinc-400 block mt-1 max-w-md mx-auto">
                                                    Discover courses based on your major and interests
                                                </span>
                                            </div>
                                        </div>
                                    </Button>
                                </motion.div>
                            ) : (
                                <InlineCourseRecommender
                                    userId={userId}
                                    currentCourses={courses}
                                    onAddCourses={onAddCourses}
                                    isExpanded={isRecommenderExpanded}
                                    onClose={() => setIsRecommenderExpanded(false)}
                                />
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
