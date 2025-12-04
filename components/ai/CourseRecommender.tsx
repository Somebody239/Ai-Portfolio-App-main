'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';
import { AIManager } from '@/managers/AIManager';
import { CoursesRepository } from '@/lib/supabase/repositories/courses.repository';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';
import type { CourseRecommendationResult, Course } from '@/lib/types';

export function CourseRecommender() {
    const coursesRepo = useState(() => new CoursesRepository())[0];
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [currentCourses, setCurrentCourses] = useState<Course[]>([]);
    const [result, setResult] = useState<CourseRecommendationResult | null>(null);

    const [formData, setFormData] = useState({
        currentYear: '9',
        intendedMajor: '',
        targetUniversities: '',
        interests: '',
    });

    const loadCurrentCourses = useCallback(async () => {
        if (!user?.id) return;

        try {
            const courses = await coursesRepo.getByUserId(user.id);
            setCurrentCourses(courses);
        } catch (error) {
            console.error('Error loading courses:', error);
        } finally {
            setLoadingCourses(false);
        }
    }, [user?.id, coursesRepo]);

    useEffect(() => {
        loadCurrentCourses();
    }, [loadCurrentCourses]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id) {
            toast.error('Please log in to use this feature');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const recommendations = await AIManager.recommendCourses(user.id, {
                currentCourses: currentCourses.map((c) => `${c.name} (${c.level})`),
                currentYear: parseInt(formData.currentYear),
                intendedMajor: formData.intendedMajor,
                targetUniversities: formData.targetUniversities.split(',').map((s) => s.trim()).filter(Boolean),
                interests: formData.interests.split(',').map((s) => s.trim()).filter(Boolean),
            });

            setResult(recommendations);
            toast.success('Recommendations generated');
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate recommendation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Course Recommendation Engine</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Get personalized course suggestions for next year based on your goals
                </p>
            </div>

            {/* Current Courses Summary */}
            {!loadingCourses && currentCourses.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Your Current Courses ({currentCourses.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {currentCourses.slice(0, 8).map((course) => (
                            <span key={course.id} className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                                {course.name}
                            </span>
                        ))}
                        {currentCourses.length > 8 && (
                            <span className="text-xs text-blue-600 dark:text-blue-400">
                                +{currentCourses.length - 8} more
                            </span>
                        )}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Current Grade Level *</label>
                        <select
                            required
                            value={formData.currentYear}
                            onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="9">Grade 9</option>
                            <option value="10">Grade 10</option>
                            <option value="11">Grade 11</option>
                            <option value="12">Grade 12</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Intended Major *</label>
                        <input
                            type="text"
                            required
                            value={formData.intendedMajor}
                            onChange={(e) => setFormData({ ...formData, intendedMajor: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Engineering, Biology"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Target Universities (comma-separated) *</label>
                    <input
                        type="text"
                        required
                        value={formData.targetUniversities}
                        onChange={(e) => setFormData({ ...formData, targetUniversities: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                        placeholder="MIT, Stanford, UC Berkeley"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Academic Interests (comma-separated)</label>
                    <input
                        type="text"
                        value={formData.interests}
                        onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                        placeholder="Physics, Computer Science, Creative Writing"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating Recommendations...
                        </>
                    ) : (
                        <>
                            <BookOpen className="w-5 h-5" />
                            Get Course Recommendations
                        </>
                    )}
                </button>
            </form>

            {/* Results */}
            {result && (
                <div className="space-y-6">
                    {/* Recommended Courses */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            Recommended Courses for Next Year
                        </h3>
                        <div className="space-y-4">
                            {result.recommendedCourses.map((course, i) => (
                                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="font-semibold text-lg">{course.courseName}</h4>
                                            <p className="text-sm text-gray-500">{course.level}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className={`text-xs px-2 py-1 rounded ${course.priority === 'High' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                                course.priority === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                                                    'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                                }`}>
                                                {course.priority} Priority
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded ${course.difficulty === 'High' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                                                course.difficulty === 'Medium' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' :
                                                    'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                }`}>
                                                {course.difficulty} Difficulty
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>Why:</strong> {course.reason}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <strong>Alignment:</strong> {course.alignment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alternative Pathways */}
                    {result.alternativePathways.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold mb-4">Alternative Pathways</h3>
                            <div className="space-y-4">
                                {result.alternativePathways.map((pathway, i) => (
                                    <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <h4 className="font-semibold mb-3">{pathway.pathway}</h4>
                                        <div className="mb-3">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Courses:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {pathway.courses.map((course, j) => (
                                                    <span key={j} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                                        {course}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Pros:</p>
                                                <ul className="text-sm space-y-1">
                                                    {pathway.pros.map((pro, j) => (
                                                        <li key={j} className="text-gray-600 dark:text-gray-400">✓ {pro}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Cons:</p>
                                                <ul className="text-sm space-y-1">
                                                    {pathway.cons.map((con, j) => (
                                                        <li key={j} className="text-gray-600 dark:text-gray-400">✗ {con}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* University Requirements */}
                    <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <ArrowRight className="w-5 h-5" />
                            University Requirements Progress
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-2">Requirements Met</h4>
                                <ul className="space-y-1">
                                    {result.universityRequirements.met.map((req, i) => (
                                        <li key={i} className="text-sm opacity-90">✓ {req}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Remaining Requirements</h4>
                                <ul className="space-y-1">
                                    {result.universityRequirements.remaining.map((req, i) => (
                                        <li key={i} className="text-sm opacity-90">→ {req}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
