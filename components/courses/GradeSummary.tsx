'use client';

import React from 'react';
import { CourseGradesViewModel, GradeBreakdown } from '@/viewmodels/CourseGradesViewModel';
import { Assignment, AssignmentType, CourseLevel } from '@/lib/types';
import { TrendingUp, Award, AlertCircle } from 'lucide-react';

interface GradeSummaryProps {
    assignments: Assignment[];
    courseLevel: CourseLevel;
    reportCardGrade?: number | null;
}

export function GradeSummary({ assignments, courseLevel, reportCardGrade }: GradeSummaryProps) {
    const gradeBreakdown = CourseGradesViewModel.calculateGrade(
        assignments,
        CourseGradesViewModel.getSuggestedWeights()
    );
    const boostedGrade = CourseGradesViewModel.applyLevelBoost(
        gradeBreakdown.calculatedGrade,
        courseLevel
    );
    const letterGrade = CourseGradesViewModel.getLetterGrade(boostedGrade);

    const getGradeColor = (grade: number) => {
        if (grade >= 90) return 'text-emerald-400';
        if (grade >= 80) return 'text-blue-400';
        if (grade >= 70) return 'text-amber-400';
        return 'text-red-400';
    };

    return (
        <div className="space-y-4">
            {/* Current Grade Card */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-zinc-400">Current Grade</h3>
                    <Award className="w-5 h-5 text-zinc-600" />
                </div>

                <div className="flex items-baseline gap-3">
                    <span className={`text-4xl font-bold ${getGradeColor(boostedGrade)}`}>
                        {boostedGrade.toFixed(1)}%
                    </span>
                    <span className="text-2xl font-medium text-zinc-500">{letterGrade}</span>
                </div>

                {/* Level Boost Indicator */}
                {(courseLevel === CourseLevel.AP || courseLevel === CourseLevel.Honors || courseLevel === CourseLevel.DualEnrollment) && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-blue-400">
                        <TrendingUp className="w-3 h-3" />
                        <span>
                            {courseLevel} boost: +{
                                courseLevel === CourseLevel.AP ? '5' : '2.5'
                            }% (from {gradeBreakdown.calculatedGrade.toFixed(1)}%)
                        </span>
                    </div>
                )}
            </div>

            {/* Report Card Verification */}
            {reportCardGrade !== null && reportCardGrade !== undefined && (
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm text-blue-300 font-medium">Report Card: {reportCardGrade}%</p>
                            <p className="text-xs text-blue-400/70 mt-1">
                                Difference: {(boostedGrade - reportCardGrade).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Breakdown */}
            {gradeBreakdown.categoryGrades.size > 0 && (
                <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/50">
                    <h4 className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider">
                        Category Breakdown
                    </h4>
                    <div className="space-y-2">
                        {Array.from(gradeBreakdown.categoryGrades.entries()).map(([type, data]) => (
                            <div key={type} className="flex items-center justify-between text-xs">
                                <span className="text-zinc-400">{type}</span>
                                <div className="flex items-center gap-2">
                                    <span className={getGradeColor(data.percentage)}>
                                        {data.percentage.toFixed(1)}%
                                    </span>
                                    <span className="text-zinc-600">
                                        ({data.weight}% weight)
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Weight Warning */}
                    {gradeBreakdown.missingWeight > 0 && (
                        <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center gap-2 text-xs text-amber-400">
                            <AlertCircle className="w-3 h-3" />
                            <span>{gradeBreakdown.missingWeight}% of grade not yet assigned</span>
                        </div>
                    )}
                </div>
            )}

            {/* Empty State */}
            {assignments.length === 0 && (
                <div className="p-8 text-center text-zinc-500 text-sm">
                    No assignments yet. Add assignments to see your grade.
                </div>
            )}
        </div>
    );
}
