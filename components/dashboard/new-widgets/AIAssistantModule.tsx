import React from 'react';
import { Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

interface AIAssistantModuleProps {
    insight?: { title: string; description: string } | null;
}

export const AIAssistantModule: React.FC<AIAssistantModuleProps> = ({ insight }) => {
    const prompts = [
        "Draft engineering essay",
        "Find summer programs",
        "Review my resume"
    ];

    return (
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/50 rounded-2xl p-6 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B35]/10 blur-[50px] rounded-full pointer-events-none" />

            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8F6B] flex items-center justify-center shadow-lg shadow-[#FF6B35]/20">
                    <Sparkles size={20} className="text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online & Ready
                    </p>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                {/* Active Insight */}
                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                    <p className="text-xs text-[#FF6B35] font-medium mb-1 uppercase tracking-wider">Suggestion</p>
                    <p className="text-sm text-white font-medium mb-1">
                        {insight?.title || "Boost your portfolio"}
                    </p>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                        {insight?.description || "Consider adding a summer project to strengthen your engineering application."}
                    </p>
                </div>

                {/* Quick Prompts */}
                <div>
                    <p className="text-xs text-zinc-500 mb-2 font-medium">QUICK ACTIONS</p>
                    <div className="space-y-2">
                        {prompts.map((prompt, i) => (
                            <button
                                key={i}
                                className="w-full text-left px-3 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between group/btn"
                            >
                                <span className="text-sm text-zinc-300 group-hover/btn:text-white">{prompt}</span>
                                <ArrowRight size={14} className="text-zinc-500 group-hover/btn:text-[#FF6B35] transform group-hover/btn:translate-x-0.5 transition-all" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
