"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Atoms";
import { Sparkles, Target, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AIManager } from "@/managers/AIManager";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useUser } from "@/hooks/useUser";
import { BatchAcceptancePredictionResult } from "@/lib/types";
import { toast } from "sonner";

export function AcceptancePredictionBanner() {
    const { user } = useUser();
    const {
        courses,
        scores,
        extracurriculars,
        targets,
        loading: portfolioLoading
    } = usePortfolio();

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<BatchAcceptancePredictionResult | null>(null);

    const handlePredict = async () => {
        if (!user || !targets || targets.length === 0) {
            toast.error("Please add target universities first!");
            return;
        }

        setIsLoading(true);
        try {
            // Calculate GPA (simple unweighted for now if not stored)
            const gpa = user.current_gpa || 3.5; // Fallback or calculate from courses

            // Get best test scores
            const satScore = scores.find(s => s.test_type === 'SAT')?.score;
            const actScore = scores.find(s => s.test_type === 'ACT')?.score;
            const apCount = courses.filter(c => c.level === 'AP').length;

            const prediction = await AIManager.predictAcceptanceBatch(user.id, {
                universities: targets.map(t => ({
                    name: t.university?.name || "Unknown University",
                    stats: t.university ? {
                        acceptanceRate: t.university.acceptance_rate,
                        avgGpa: t.university.avg_gpa,
                    } : undefined
                })),
                studentProfile: {
                    gpa,
                    satScore,
                    actScore,
                    apCourses: apCount,
                    extracurriculars: extracurriculars.map(e => e.name),
                    major: user.intended_major || "Undecided"
                }
            });

            setResult(prediction);
            toast.success("Analysis complete!");
        } catch (error) {
            console.error("Prediction failed:", error);
            toast.error("Failed to generate prediction. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (result) {
        return (
            <div className="space-y-6">
                <Card className="bg-gradient-to-r from-emerald-950 to-zinc-950 border-emerald-500/30 p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-emerald-300 mb-1">
                                <Target className="w-5 h-5" />
                                <span className="text-sm font-medium uppercase tracking-wider">Acceptance Analysis</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">Your Admission Chances</h3>
                            <p className="text-emerald-200/80 max-w-xl">
                                {result.overallAnalysis}
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            onClick={() => setResult(null)}
                            className="shrink-0 bg-white/10 text-white hover:bg-white/20 border-none"
                        >
                            Reset
                        </Button>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.predictions.map((pred, i) => (
                        <Card key={i} className="p-5 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-white line-clamp-1" title={pred.universityName}>
                                    {pred.universityName}
                                </h4>
                                <div className={`px-2 py-1 rounded text-xs font-bold ${pred.acceptanceLikelihood >= 70 ? 'bg-emerald-500/20 text-emerald-400' :
                                    pred.acceptanceLikelihood >= 40 ? 'bg-amber-500/20 text-amber-400' :
                                        'bg-red-500/20 text-red-400'
                                    }`}>
                                    {pred.acceptanceLikelihood}% Chance
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                        <span>Match Score</span>
                                        <span>{pred.matchScore}/100</span>
                                    </div>
                                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full"
                                            style={{ width: `${pred.matchScore}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="p-3 bg-zinc-950 rounded-lg">
                                    <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                                        <TrendingUp size={12} />
                                        <span>Percentile Standing</span>
                                    </div>
                                    <p className="text-lg font-bold text-white">
                                        {pred.percentile}th <span className="text-xs font-normal text-zinc-500">percentile</span>
                                    </p>
                                </div>

                                {pred.recommendations.length > 0 && (
                                    <div className="text-xs text-zinc-400">
                                        <span className="text-emerald-400 font-medium">Tip:</span> {pred.recommendations[0]}
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <Card className="bg-gradient-to-r from-emerald-950 to-zinc-950 border-emerald-500/30 p-6 relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />

            <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-300 mb-1">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm font-medium uppercase tracking-wider">AI Admission Predictor</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Predict Your Acceptance Chances</h3>
                    <p className="text-emerald-200/80 max-w-xl">
                        Our AI analyzes your stats against your target universities to calculate your acceptance probability and percentile standing.
                    </p>
                </div>
                <Button
                    variant="secondary"
                    onClick={handlePredict}
                    disabled={isLoading || portfolioLoading}
                    className="shrink-0 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 border-none shadow-lg shadow-emerald-500/30 transition-all duration-200 h-12 px-6"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            Predict Acceptance
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </Card>
    );
}
