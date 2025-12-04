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
            color: 'from-blue-500 to-cyan-500',
            textColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: 'Acceptance Predictor',
            description: 'Get AI-powered predictions on your university acceptance likelihood with actionable improvement steps',
            icon: Target,
            href: '/ai/acceptance-predictor',
            color: 'from-purple-500 to-pink-500',
            textColor: 'text-purple-600 dark:text-purple-400',
        },
        {
            title: 'Portfolio Advisor',
            description: 'Receive personalized recommendations for competitions, volunteer work, and projects',
            icon: Sparkles,
            href: '/ai/portfolio-advisor',
            color: 'from-pink-500 to-rose-500',
            textColor: 'text-pink-600 dark:text-pink-400',
        },
        {
            title: 'Course Recommender',
            description: 'Get AI suggestions for next year\'s courses based on your goals and university requirements',
            icon: BookOpen,
            href: '/ai/course-recommender',
            color: 'from-green-500 to-teal-500',
            textColor: 'text-green-600 dark:text-green-400',
        },
        {
            title: 'Grade Analyzer',
            description: 'Analyze your grades with AI to get study strategies and grade projections',
            icon: TrendingUp,
            href: '/ai/grade-analyzer',
            color: 'from-indigo-500 to-purple-500',
            textColor: 'text-indigo-600 dark:text-indigo-400',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
                    <Brain className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2">AI Tools</h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Leverage the power of AI to enhance your academic journey. Get insights, recommendations, and predictions
                    powered by advanced machine learning.
                </p>
            </div>

            {/* Tools Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-lg font-semibold mb-2 ${tool.textColor} group-hover:underline`}>
                                        {tool.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {tool.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Info Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
                <h2 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
                    How AI Tools Work
                </h2>
                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <p>
                        • <strong>Privacy First:</strong> Your data is secure and never shared with third parties
                    </p>
                    <p>
                        • <strong>Personalized:</strong> Recommendations are tailored to your unique profile and goals
                    </p>
                    <p>
                        • <strong>Continuously Learning:</strong> Our AI improves over time to provide better insights
                    </p>
                    <p>
                        • <strong>Actionable:</strong> Every recommendation comes with clear, actionable next steps
                    </p>
                </div>
            </div>
        </div>
    );
}
