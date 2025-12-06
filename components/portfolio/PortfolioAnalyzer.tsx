"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Atoms";
import { Sparkles, Loader2, CheckCircle2, AlertTriangle, TrendingUp, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AIManager } from "@/managers/AIManager";
import { PortfolioAdviceResult } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PortfolioAnalyzerProps {
    userId: string;
    data: {
        interests: string[];
        careerGoals: string;
        currentActivities: string[];
        personalityTraits?: string[];
    };
    autoAnalyze?: boolean;
}

export function PortfolioAnalyzer({ userId, data, autoAnalyze = false }: PortfolioAnalyzerProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [advice, setAdvice] = useState<PortfolioAdviceResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasAutoAnalyzed, setHasAutoAnalyzed] = useState(false);

    const handleAnalyze = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await AIManager.getPortfolioAdvice(userId, data);
            setAdvice(result);
        } catch (err) {
            console.error("Portfolio analysis failed:", err);
            setError("Failed to analyze portfolio. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [userId, data]);

    React.useEffect(() => {
        if (autoAnalyze && !hasAutoAnalyzed && !advice && !isLoading) {
            setHasAutoAnalyzed(true);
            handleAnalyze();
        }
    }, [autoAnalyze, hasAutoAnalyzed, advice, isLoading, handleAnalyze]);

    if (advice) {
        return (
            <div className="space-y-6">
                <Card className="bg-gradient-to-r from-zinc-900 to-zinc-950 border-emerald-500/20 p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-emerald-400 mb-1">
                                <Sparkles className="w-5 h-5" />
                                <span className="text-sm font-medium uppercase tracking-wider">Analysis Complete</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">Your Portfolio Insights</h3>
                            <p className="text-zinc-400 max-w-xl">
                                Based on your profile, here are personalized recommendations to strengthen your application.
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            onClick={() => setAdvice(null)}
                            className="shrink-0 bg-white/10 text-white hover:bg-white/20 border-none"
                        >
                            Reset Analysis
                        </Button>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <Card className="p-6 border-emerald-500/20 bg-emerald-500/5">
                        <h4 className="flex items-center gap-2 font-bold text-emerald-400 mb-4">
                            <CheckCircle2 className="w-5 h-5" /> Key Strengths
                        </h4>
                        <ul className="space-y-3">
                            {advice.gapAnalysis.strengths.map((strength: string, i: number) => (
                                <li key={i} className="flex gap-3 text-sm text-zinc-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    {strength}
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* Weaknesses/Gaps */}
                    <Card className="p-6 border-amber-500/20 bg-amber-500/5">
                        <h4 className="flex items-center gap-2 font-bold text-amber-400 mb-4">
                            <AlertTriangle className="w-5 h-5" /> Areas for Growth
                        </h4>
                        <ul className="space-y-3">
                            {advice.gapAnalysis.areasToImprove.map((weakness: string, i: number) => (
                                <li key={i} className="flex gap-3 text-sm text-zinc-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                    {weakness}
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>

                {/* Recommendations */}
                <Card className="p-6 border-zinc-700/50 bg-zinc-900/30">
                    <h4 className="flex items-center gap-2 font-bold text-white mb-4">
                        <Lightbulb className="w-5 h-5 text-amber-400" /> Strategic Recommendations
                    </h4>
                    <div className="grid gap-4">
                        {advice.gapAnalysis.recommendations.map((rec: string, i: number) => (
                            <div key={i} className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                                <p className="text-sm text-zinc-300">{rec}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <Card className="bg-gradient-to-r from-zinc-900 to-zinc-950 border-emerald-500/20 p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm font-medium uppercase tracking-wider">AI Portfolio Analysis</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Unlock Your Acceptance Potential</h3>
                    <p className="text-zinc-400 max-w-xl">
                        Our AI analyzes your extracurriculars, awards, and essays to identify gaps and suggest high-impact improvements for your target universities.
                    </p>
                    {error && (
                        <Alert variant="error" className="bg-red-950/20 border-red-900/50 text-red-400 mt-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>
                <Button
                    variant="secondary"
                    onClick={handleAnalyze}
                    isLoading={isLoading}
                    className="shrink-0 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 border-none shadow-lg shadow-emerald-900/20 transition-all duration-200"
                >
                    {isLoading ? "Analyzing..." : "Analyze Portfolio"}
                    {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
            </div>
        </Card>
    );
}
