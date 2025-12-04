'use client';

import React from 'react';
import { Course } from '@/lib/types';
import { MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";


interface CourseYearCardProps {
    course: Course;
    onEdit: (course: Course) => void;
    onDelete: (course: Course) => void;
    onClick?: (course: Course) => void;
}

export function CourseYearCard({ course, onEdit, onDelete, onClick }: CourseYearCardProps) {

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'AP':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
            case 'IB':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            case 'Honors':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
            case 'Dual Enrollment':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            default:
                return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30';
        }
    };

    const getGradeDisplay = () => {
        // Debug logging
        // console.log(`Course: ${course.name}, Grade: ${course.grade}, Type: ${typeof course.grade}`);

        if (course.grade === null || course.grade === undefined) {
            return <span className="text-zinc-600 text-xs font-medium">No grade</span>;
        }
        const gradeNum = Number(course.grade);
        if (isNaN(gradeNum)) {
            return <span className="text-zinc-600 text-xs font-medium">{course.grade}</span>;
        }
        const gradeColor = gradeNum >= 90 ? 'text-emerald-400' :
            gradeNum >= 80 ? 'text-blue-400' :
                gradeNum >= 70 ? 'text-amber-400' :
                    'text-red-400';
        return <span className={`font-bold ${gradeColor}`}>{gradeNum.toFixed(0)}%</span>;
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => onClick?.(course)}
            className="group relative rounded-lg bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all cursor-pointer overflow-hidden flex flex-col"
        >
            <div className="p-4 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        {/* Course Name */}
                        <h4 className="text-base font-semibold text-white leading-snug mb-2">
                            {course.name}
                        </h4>

                        {/* Metadata Row */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Level Badge */}
                            <span className={`px-2 py-0.5 text-[11px] font-medium rounded border ${getLevelColor(course.level || 'Regular')}`}>
                                {course.level || 'Regular'}
                            </span>

                            {/* Semester */}
                            <span className="text-[11px] text-zinc-500">
                                {course.semester}
                            </span>

                            {/* Credits */}
                            {course.credits && course.credits !== 1 && (
                                <span className="text-[11px] text-zinc-600">
                                    {course.credits} cr
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full shrink-0"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(course); }} className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer">
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(course); }} className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Course
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Grade Footer - Always at bottom */}
                <div className="pt-3 border-t border-zinc-800/50 flex items-center justify-between">
                    <span className="text-xs text-zinc-500 font-medium">Current Grade</span>
                    {getGradeDisplay()}
                </div>
            </div>


        </motion.div>
    );
}
