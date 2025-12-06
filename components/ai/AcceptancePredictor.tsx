'use client';

import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, Award, Target, X, Calculator, RefreshCw } from 'lucide-react';
import { AIManager } from '@/managers/AIManager';
import { useUser } from '@/hooks/useUser';
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

    // Load persisted result on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('ai_acceptance_prediction');
            if (saved) {
                try {
                    setResult(JSON.parse(saved));
                } catch (e) {
                    console.error("Failed to load persisted prediction", e);
                }
            }
        }
    }, []);

    // Persist result on change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (result) {
                localStorage.setItem('ai_acceptance_prediction', JSON.stringify(result));
            } else {
                localStorage.removeItem('ai_acceptance_prediction');
            }
        }
    }, [result]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id) {
            toast.error('Please log in to use this feature');
            return;
        }

        setLoading(true);

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

    const handleDismiss = () => {
        setResult(null);
        setFormData({
            universityName: '',
            major: '',
            gpa: '',
            satScore: '',
            actScore: '',
            apCourses: '',
            extracurriculars: '',
        });
        toast.info("Result dismissed");
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-2 text-white">Acceptance Predictor</h2>
                    <p className="text-zinc-400">
                        Get an AI-powered estimate of your acceptance likelihood
                    </p>
                </div>
                {result && (
                    <button
                        onClick={handleDismiss}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
                    >
                        <RefreshCw size={16} /> New Prediction
                    </button>
                )}
            </div>

            {!result ? (
                <form onSubmit={handleSubmit} className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-zinc-300">University Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.universityName}
                                    onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-zinc-700 rounded-lg bg-zinc-900 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                    placeholder="e.g., Stanford University"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-zinc-300">Intended Major *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.major}
                                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-zinc-700 rounded-lg bg-zinc-900 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                    placeholder="e.g., Computer Science"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-zinc-300">GPA (4.0 scale) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="4"
                                    required
                                    value={formData.gpa}
                                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-zinc-700 rounded-lg bg-zinc-900 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                    placeholder="3.85"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-zinc-300">SAT Score</label>
                                    <input
                                        type="number"
                                        min="400"
                                        max="1600"
                                        value={formData.satScore}
                                        onChange={(e) => setFormData({ ...formData, satScore: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-zinc-700 rounded-lg bg-zinc-900 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        placeholder="1450"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-zinc-300">ACT Score</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="36"
                                        value={formData.actScore}
                                        onChange={(e) => setFormData({ ...formData, actScore: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-zinc-700 rounded-lg bg-zinc-900 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        placeholder="32"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-zinc-300">AP/IB Courses</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.apCourses}
                                    onChange={(e) => setFormData({ ...formData, apCourses: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-zinc-700 rounded-lg bg-zinc-900 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Number of courses"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-zinc-300">
                                    Extracurriculars
                                </label>
                                <textarea
                                    value={formData.extracurriculars}
                                    onChange={(e) => setFormData({ ...formData, extracurriculars: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2.5 border border-zinc-700 rounded-lg bg-zinc-900 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                                    placeholder="Debate Team Captain, Robotics Club..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing Profile...
                                </>
                            ) : (
                                <>
                                    <Target className="w-5 h-5" />
                                    Predict Acceptance Chance
                                </>
                            )}
                        </button>
                    </div>
                </form>
            ) : (
                /* Results Display */
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header Card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-8 text-white shadow-xl shadow-emerald-900/20">
                        <button
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <Award className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium opacity-90">Acceptance Likelihood</h3>
                                <p className="text-sm opacity-75">{formData.universityName || 'Target University'}</p>
                            </div>
                        </div>
                        <div className="flex items-end gap-4">
                            <div className="text-6xl font-bold tracking-tight text-white">{result.acceptanceLikelihood.toFixed(1)}%</div>
                            <div className="mb-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-100 text-sm font-medium backdrop-blur-sm border border-amber-400/20">
                                {result.confidenceLevel} Confidence
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Score Breakdown */}
                        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6">
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                Score Breakdown
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(result.scoreBreakdown).map(([key, value]) => (
                                    <div key={key}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="capitalize text-zinc-400">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="font-semibold text-white">{value}%</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Analysis */}
                        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                                <Calculator className="w-5 h-5 text-emerald-400" />
                                Detailed Analysis
                            </h3>
                            <p className="text-zinc-300 leading-relaxed text-sm">
                                {result.analysis}
                            </p>
                        </div>
                    </div>

                    {/* Improvement Steps */}
                    <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6">
                        <h3 className="text-lg font-semibold mb-6 text-white">How to Improve Your Chances</h3>
                        <div className="grid gap-4">
                            {result.improvementSteps.map((step, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-800/30 border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-sm font-bold">
                                        {i + 1}
                                    </span>
                                    <p className="text-zinc-300 text-sm leading-relaxed mt-1">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
