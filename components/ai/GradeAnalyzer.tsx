'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, TrendingUp, Target, Clock, AlertTriangle } from 'lucide-react';
import { AIManager } from '@/managers/AIManager';
import { CoursesRepository } from '@/lib/supabase/repositories/courses.repository';
import { AssignmentsRepository } from '@/lib/supabase/repositories/assignments.repository';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';
import type { GradeAnalysisResult, Course, Assignment } from '@/lib/types';

export function GradeAnalyzer() {
    const coursesRepo = useState(() => new CoursesRepository())[0];
    const assignmentsRepo = useState(() => new AssignmentsRepository())[0];
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [targetGrade, setTargetGrade] = useState('');
    const [result, setResult] = useState<GradeAnalysisResult | null>(null);

    const loadCourses = useCallback(async () => {
        if (!user?.id) return;

        try {
            const data = await coursesRepo.getByUserId(user.id);
            setCourses(data);
        } catch (error) {
            console.error('Error loading courses:', error);
        } finally {
            setLoadingCourses(false);
        }
    }, [user?.id, coursesRepo]);

    const loadAssignments = useCallback(async (courseId: string) => {
        if (!user?.id) return;

        try {
            const data = await assignmentsRepo.getByCourseId(courseId);
            setAssignments(data);
        } catch (error) {
            console.error('Error loading assignments:', error);
        }
    }, [user?.id, assignmentsRepo]);

    useEffect(() => {
        loadCourses();
    }, [loadCourses]);

    useEffect(() => {
        if (selectedCourseId) {
            loadAssignments(selectedCourseId);
        }
    }, [selectedCourseId, loadAssignments]);

    const calculateCurrentGrade = () => {
        const gradedAssignments = assignments.filter((a) => a.earned_points !== null && a.earned_points !== undefined);
        if (gradedAssignments.length === 0) return 0;

        let totalWeightedScore = 0;
        let totalWeight = 0;

        gradedAssignments.forEach((a) => {
            const score = ((a.earned_points || 0) / a.total_points) * 100;
            totalWeightedScore += score * a.weight_percentage;
            totalWeight += a.weight_percentage;
        });

        return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    };

    const handleAnalyze = async () => {
        if (!user?.id || !selectedCourseId) return;

        const course = courses.find((c) => c.id === selectedCourseId);
        if (!course) return;

        if (assignments.length === 0) {
            toast.error('No assignments found for this course');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const currentGrade = calculateCurrentGrade();

            const analysis = await AIManager.analyzeGrades(user.id, {
                courseName: course.name,
                currentGrade,
                assignments: assignments.map((a) => ({
                    title: a.title,
                    type: a.assignment_type,
                    earnedPoints: a.earned_points ?? null,
                    totalPoints: a.total_points,
                    weight: a.weight_percentage,
                })),
                targetGrade: targetGrade ? parseFloat(targetGrade) : undefined,
            });

            setResult(analysis);
            toast.success('Analysis complete');
        } catch (error) {
            console.error(error);
            toast.error('Failed to analyze grades');
        } finally {
            setLoading(false);
        }
    };

    const selectedCourse = courses.find((c) => c.id === selectedCourseId);
    const currentGrade = selectedCourseId ? calculateCurrentGrade() : 0;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Grade Analysis & Study Advice</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Get AI-powered insights and study recommendations for your courses
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Select Course *</label>
                    <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                        disabled={loadingCourses}
                    >
                        <option value="">Choose a course...</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.name} ({course.level}) - Grade {course.year}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedCourseId && (
                    <>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Current Grade</p>
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                        {currentGrade.toFixed(1)}%
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-blue-800 dark:text-blue-200">Assignments</p>
                                    <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                                        {assignments.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Target Grade (optional)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={targetGrade}
                                onChange={(e) => setTargetGrade(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 90"
                            />
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !selectedCourseId}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="w-5 h-5" />
                                    Analyze & Get Study Advice
                                </>
                            )}
                        </button>
                    </>
                )}
            </div>

            {/* Results */}
            {result && selectedCourse && (
                <div className="space-y-6">
                    {/* Current Standing */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold mb-4">Current Standing</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <div className="text-center mb-4">
                                    <p className="text-5xl font-bold text-blue-600">{result.currentStanding.grade.toFixed(1)}%</p>
                                    <p className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mt-2">
                                        {result.currentStanding.letterGrade}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Strengths</h4>
                                    <ul className="space-y-1">
                                        {result.currentStanding.strengths.map((s, i) => (
                                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300">✓ {s}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Weaknesses</h4>
                                    <ul className="space-y-1">
                                        {result.currentStanding.weaknesses.map((w, i) => (
                                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300">→ {w}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grade Projections */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-500" />
                            Grade Projections
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <p className="text-sm text-green-800 dark:text-green-200 font-medium">Best Case</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{result.projections.bestCase}%</p>
                            </div>
                            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">Most Likely</p>
                                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{result.projections.mostLikely}%</p>
                            </div>
                            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <p className="text-sm text-red-800 dark:text-red-200 font-medium">Worst Case</p>
                                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{result.projections.worstCase}%</p>
                            </div>
                        </div>
                        {result.projections.toReachTarget && (
                            <div className={`mt-4 p-4 rounded-lg ${result.projections.toReachTarget.achievable
                                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                                : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                                }`}>
                                <p className="text-sm font-medium mb-1">
                                    {result.projections.toReachTarget.achievable ? 'Target is achievable!' : 'Target may be challenging'}
                                </p>
                                <p className="text-sm opacity-80">
                                    You need an average of <strong>{result.projections.toReachTarget.required}%</strong> on remaining assignments
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Study Strategy */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Recommended Study Strategy
                        </h3>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2">Priorities</h4>
                            <ol className="space-y-1">
                                {result.studyStrategy.priorities.map((priority, i) => (
                                    <li key={i} className="text-sm opacity-90">
                                        {i + 1}. {priority}
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white/10 rounded-lg p-3">
                                <p className="text-xs opacity-80 mb-1">Homework</p>
                                <p className="font-semibold">{result.studyStrategy.timeAllocation.homework}</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3">
                                <p className="text-xs opacity-80 mb-1">Test Prep</p>
                                <p className="font-semibold">{result.studyStrategy.timeAllocation.testPrep}</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3">
                                <p className="text-xs opacity-80 mb-1">Review</p>
                                <p className="font-semibold">{result.studyStrategy.timeAllocation.review}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Specific Advice</h4>
                            <ul className="space-y-1">
                                {result.studyStrategy.specificAdvice.map((advice, i) => (
                                    <li key={i} className="text-sm opacity-90">• {advice}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Weakness Patterns */}
                    {result.weaknessPatterns.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-800 p-6">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                <AlertTriangle className="w-5 h-5" />
                                Pattern Analysis
                            </h3>
                            <ul className="space-y-2">
                                {result.weaknessPatterns.map((pattern, i) => (
                                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                                        → {pattern}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
