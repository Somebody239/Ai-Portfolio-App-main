import React from 'react';
import { TrendingUp, Target, BookOpen, Plus } from 'lucide-react';

interface CompactKPISectionProps {
    gpa: number;
    riskCounts: {
        safety: number;
        target: number;
        reach: number;
        highReach: number;
    };
    satScore: number | null;
    actScore: number | null;
}

export const CompactKPISection: React.FC<CompactKPISectionProps> = ({
    gpa,
    riskCounts,
    satScore,
    actScore
}) => {
    const totalTargets = riskCounts.safety + riskCounts.target + riskCounts.reach + riskCounts.highReach;
    const bestTestScore = satScore ? `SAT ${satScore}` : actScore ? `ACT ${actScore}` : 'No Scores';

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* GPA Card */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 flex items-center justify-between backdrop-blur-sm hover:border-zinc-700/50 transition-all group">
                <div>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Current GPA</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-white">{gpa > 0 ? gpa.toFixed(2) : 'N/A'}</h3>
                        <span className="text-xs text-emerald-400 flex items-center gap-0.5 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">
                            <TrendingUp size={10} />
                            On Track
                        </span>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition-colors">
                    <TrendingUp size={18} />
                </div>
            </div>

            {/* Targets Card */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 flex items-center justify-between backdrop-blur-sm hover:border-zinc-700/50 transition-all group">
                <div>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">University Targets</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-white">{totalTargets}</h3>
                        <span className="text-xs text-zinc-400">
                            {riskCounts.reach + riskCounts.highReach} Reach
                        </span>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-[#FF6B35] group-hover:bg-[#FF6B35]/10 transition-colors">
                    <Target size={18} />
                </div>
            </div>

            {/* Test Scores Card */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 flex items-center justify-between backdrop-blur-sm hover:border-zinc-700/50 transition-all group cursor-pointer">
                <div>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Best Test Score</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-white">{bestTestScore}</h3>
                    </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center hover:bg-[#FF6B35] hover:text-white transition-all">
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
};
