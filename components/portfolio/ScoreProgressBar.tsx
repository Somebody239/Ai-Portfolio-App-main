'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScoreProgressBarProps {
    score: number;
    maxScore: number;
    label: string;
    percentile?: number;
    className?: string;
}

export function ScoreProgressBar({
    score,
    maxScore,
    label,
    percentile,
    className = ''
}: ScoreProgressBarProps) {
    const percentage = (score / maxScore) * 100;

    // Determine color based on percentage
    const getColor = () => {
        if (percentage >= 90) return 'from-emerald-500 to-emerald-600';
        if (percentage >= 80) return 'from-blue-500 to-blue-600';
        if (percentage >= 70) return 'from-yellow-500 to-yellow-600';
        return 'from-red-500 to-red-600';
    };

    const getTextColor = () => {
        if (percentage >= 90) return 'text-emerald-400';
        if (percentage >= 80) return 'text-blue-400';
        if (percentage >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">{label}</span>
                <div className="flex items-center gap-2">
                    <span className={`font-bold ${getTextColor()}`}>
                        {score}/{maxScore}
                    </span>
                    {percentile !== undefined && (
                        <span className="text-xs text-zinc-500">
                            ({percentile}th percentile)
                        </span>
                    )}
                </div>
            </div>

            <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${getColor()} rounded-full shadow-lg`}
                />
            </div>
        </div>
    );
}
