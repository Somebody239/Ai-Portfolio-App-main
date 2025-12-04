'use client';

import { useState } from 'react';
import { Loader2, Lightbulb, Target, TrendingUp, ExternalLink } from 'lucide-react';
import { AIManager } from '@/managers/AIManager';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';
import type { PortfolioAdviceResult } from '@/lib/types';

export function PortfolioAdvisor() {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PortfolioAdviceResult | null>(null);

    const [formData, setFormData] = useState({
        interests: '',
        careerGoals: '',
        currentActivities: '',
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
            const advice = await AIManager.getPortfolioAdvice(user.id, {
                interests: formData.interests.split(',').map((s) => s.trim()).filter(Boolean),
                careerGoals: formData.careerGoals,
                currentActivities: formData.currentActivities.split(',').map((s) => s.trim()).filter(Boolean),
            });

            setResult(advice);
            toast.success('Recommendations generated');
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate recommendations');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Personalized Portfolio Advisor</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Get AI-powered recommendations to strengthen your college portfolio
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Your Interests (comma-separated) *</label>
                    <input
                        type="text"
                        required
                        value={formData.interests}
                        onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                        placeholder="AI, Robotics, Environmental Science, Music"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Career Goals *</label>
                    <textarea
                        required
                        value={formData.careerGoals}
                        onChange={(e) => setFormData({ ...formData, careerGoals: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                        placeholder="I want to become a software engineer and develop AI solutions for healthcare..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Current Activities (comma-separated)</label>
                    <textarea
                        value={formData.currentActivities}
                        onChange={(e) => setFormData({ ...formData, currentActivities: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                        placeholder="Math Club, School Newspaper, Part-time Tutoring"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating Advice...
                        </>
                    ) : (
                        <>
                            <Lightbulb className="w-5 h-5" />
                            Get Personalized Advice
                        </>
                    )}
                </button>
            </form>

            {/* Results */}
            {result && (
                <div className="space-y-6">
                    {/* Competitions */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-orange-500" />
                            Recommended Competitions
                        </h3>
                        <div className="grid gap-4">
                            {result.competitions.map((comp, i) => (
                                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-semibold">{comp.title}</h4>
                                        {comp.difficulty && (
                                            <span className={`text-xs px-2 py-1 rounded ${comp.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                                                comp.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                                                    'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                                }`}>
                                                {comp.difficulty}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{comp.description}</p>
                                    {comp.url && (
                                        <a href={comp.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                            Learn More <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Volunteer Opportunities */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold mb-4">Volunteer Opportunities</h3>
                        <div className="grid gap-4">
                            {result.volunteerOpportunities.map((opp, i) => (
                                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-semibold">{opp.title}</h4>
                                        {opp.type && (
                                            <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                                {opp.type}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{opp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Project Ideas */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold mb-4">Project Ideas</h3>
                        <div className="grid gap-4">
                            {result.projectIdeas.map((project, i) => (
                                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <h4 className="font-semibold mb-2">{project.title}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                                    {project.skills && project.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {project.skills.map((skill, j) => (
                                                <span key={j} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {project.timeCommitment && (
                                        <p className="text-xs text-gray-500">Time: {project.timeCommitment}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gap Analysis */}
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Portfolio Gap Analysis
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-2">Strengths</h4>
                                <ul className="space-y-1">
                                    {result.gapAnalysis.strengths.map((strength, i) => (
                                        <li key={i} className="text-sm opacity-90">✓ {strength}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Areas to Improve</h4>
                                <ul className="space-y-1">
                                    {result.gapAnalysis.areasToImprove.map((area, i) => (
                                        <li key={i} className="text-sm opacity-90">→ {area}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/20">
                            <h4 className="font-semibold mb-2">Key Recommendations</h4>
                            <ul className="space-y-1">
                                {result.gapAnalysis.recommendations.map((rec, i) => (
                                    <li key={i} className="text-sm opacity-90">• {rec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
