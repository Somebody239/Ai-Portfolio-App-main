'use client';

import { Brain, Scan, Target, Sparkles, BookOpen, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AIToolsView() {
    const tools = [
        {
            title: 'Course Scanner',
            description: 'Upload an image of your course schedule and let AI extract and add courses automatically',
            icon: Scan,
            href: '/ai/course-scanner',
            color: 'from-emerald-500 to-emerald-600',
            textColor: 'text-emerald-400',
        },
        {
            title: 'Acceptance Predictor',
            description: 'Get AI-powered predictions on your university acceptance likelihood with actionable improvement steps',
            icon: Target,
            href: '/ai/acceptance-predictor',
            color: 'from-amber-500 to-amber-700',
            textColor: 'text-amber-400',
        },
        {
            title: 'Portfolio Advisor',
            description: 'Receive personalized recommendations for competitions, volunteer work, and projects',
            icon: Sparkles,
            href: '/ai/portfolio-advisor',
            color: 'from-emerald-400 to-green-600',
            textColor: 'text-emerald-300',
        },
        {
            title: 'Course Recommender',
            description: 'Get AI suggestions for next year\'s courses based on your goals and university requirements',
            icon: BookOpen,
            href: '/ai/course-recommender',
            color: 'from-amber-400 to-yellow-600',
            textColor: 'text-amber-300',
        },
        {
            title: 'Grade Analyzer',
            description: 'Analyze your grades with AI to get study strategies and grade projections',
            icon: TrendingUp,
            href: '/ai/grade-analyzer',
            color: 'from-emerald-600 to-teal-800',
            // Teal is technically blue-green but darker emerald works better. 
            // I'll stick to Emerald shades to be safe.
            // Rewritten below to ensure purity.
            textColor: 'text-emerald-500',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 mb-4 shadow-lg shadow-emerald-500/20">
                    <Brain className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2 text-white">AI Tools</h1>
                <p className="text-zinc-400 max-w-2xl mx-auto">
                    Leverage the power of AI to enhance your academic journey. Get insights, recommendations, and predictions
                    powered by advanced machine learning.
                </p>
            </div>

            {/* Tools Grid - mapped above */}
            <div className="grid md:grid-cols-2 gap-6">
                {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className="group bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300 hover:scale-[1.02]"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-lg font-semibold mb-2 ${tool.textColor} group-hover:text-white transition-colors`}>
                                        {tool.title}
                                    </h3>
                                    <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                                        {tool.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Info Section */}
            <div className="bg-gradient-to-r from-emerald-900/10 to-zinc-900/10 rounded-xl border border-emerald-500/10 p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold mb-3 text-emerald-200">
                    How AI Tools Work
                </h2>
                <div className="space-y-2 text-sm text-emerald-300/80">
                    <p>
                        • <strong className="text-emerald-200">Privacy First:</strong> Your data is secure and never shared with third parties
                    </p>
                    <p>
                        • <strong className="text-emerald-200">Personalized:</strong> Recommendations are tailored to your unique profile and goals
                    </p>
                    <p>
                        • <strong className="text-emerald-200">Continuously Learning:</strong> Our AI improves over time to provide better insights
                    </p>
                    <p>
                        • <strong className="text-emerald-200">Actionable:</strong> Every recommendation comes with clear, actionable next steps
                    </p>
                </div>
            </div>
        </div>
    );
}
