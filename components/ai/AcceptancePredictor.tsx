'use client';

import { useState } from 'react';
import { Loader2, TrendingUp, Award, Target } from 'lucide-react';
import { AIManager } from '@/managers/AIManager';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { AcceptancePredictionResult } from '@/lib/types';

export function AcceptancePredictor() {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AcceptancePredictionResult | null>(null);

    const [formData, setFormData] = useState({
        universityName: '',
        major: '',
        gpa: '',
        satScore: '',
        actScore: '',
        apCourses: '',
        extracurriculars: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id) {
            toast.error('Please log in to use this feature');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const prediction = await AIManager.predictAcceptance(user.id, {
                universityName: formData.universityName,
                major: formData.major,
                gpa: parseFloat(formData.gpa),
                satScore: formData.satScore ? parseInt(formData.satScore) : undefined,
                actScore: formData.actScore ? parseInt(formData.actScore) : undefined,
                apCourses: parseInt(formData.apCourses) || 0,
                extracurriculars: formData.extracurriculars
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
            });

            setResult(prediction);
            toast.success('Prediction complete');
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate prediction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">University Acceptance Predictor</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Get an AI-powered estimate of your acceptance likelihood
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">University Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.universityName}
                            onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Stanford University"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Intended Major *</label>
                        <input
                            type="text"
                            required
                            value={formData.major}
                            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Computer Science"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">GPA (4.0 scale) *</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
                            required
                            value={formData.gpa}
                            onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                            placeholder="3.85"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">SAT Score (optional)</label>
                        <input
                            type="number"
                            min="400"
                            max="1600"
                            value={formData.satScore}
                            onChange={(e) => setFormData({ ...formData, satScore: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                            placeholder="1450"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">ACT Score (optional)</label>
                        <input
                            type="number"
                            min="1"
                            max="36"
                            value={formData.actScore}
                            onChange={(e) => setFormData({ ...formData, actScore: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                            placeholder="32"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Number of AP/IB Courses</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.apCourses}
                            onChange={(e) => setFormData({ ...formData, apCourses: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                            placeholder="8"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Extracurriculars (comma-separated)
                    </label>
                    <textarea
                        value={formData.extracurriculars}
                        onChange={(e) => setFormData({ ...formData, extracurriculars: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                        placeholder="Debate Team Captain, Robotics Club, Volunteering at Local Hospital"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Target className="w-5 h-5" />
                            Predict Acceptance
                        </>
                    )}
                </button>
            </form>

            {/* Results */}
            {result && (
                <div className="space-y-4">
                    {/* Acceptance Likelihood */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Acceptance Likelihood</h3>
                            <Award className="w-8 h-8" />
                        </div>
                        <div className="text-5xl font-bold mb-2">{result.acceptanceLikelihood}%</div>
                        <div className="text-sm opacity-90">
                            Confidence: {result.confidenceLevel}
                        </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Score Breakdown
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(result.scoreBreakdown).map(([key, value]) => (
                                <div key={key}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className="font-semibold">{value}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Analysis */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold mb-3">Detailed Analysis</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.analysis}</p>
                    </div>

                    {/* Improvement Steps */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold mb-3">How to Improve Your Chances</h3>
                        <ul className="space-y-2">
                            {result.improvementSteps.map((step, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-semibold">
                                        {i + 1}
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
