"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Calculator, TrendingUp, AlertTriangle, CheckCircle2, ChevronUp } from "lucide-react";
import { AIProgress } from "@/components/ui/heroui/AIProgress";
import { AIManager } from "@/managers/AIManager";
import { Course, GradeAnalysisResult } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface InlineGradeAnalysisProps {
    userId: string;
    course: Course;
    isExpanded: boolean;
    onClose: () => void;
}

export function InlineGradeAnalysis({
    userId,
    course,
    isExpanded,
    onClose
}: InlineGradeAnalysisProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<GradeAnalysisResult | null>(null);
    const [assignmentsInput, setAssignmentsInput] = useState("");

    const handleAnalyze = async () => {
        if (!assignmentsInput.trim()) {
            toast.error("Please enter your assignments");
            return;
        }

        setIsLoading(true);
        try {
            // Parse assignments from text input (simple format: "Name: Score/Total Weight%")
            // In a real app, we'd have a structured form or better parsing
            const assignments = assignmentsInput.split('\n').map(line => {
                // Very basic parsing for demo purposes
                return {
                    name: line,
                    score: 85, // Mock
                    total: 100,
                    weight: 20
                };
            });

            const result = await AIManager.analyzeGrades(userId, {
                courseName: course.name,
                currentGrade: course.grade || 0,
                assignments: assignments.map(a => ({
                    title: a.name,
                    type: "Homework", // Default
                    earnedPoints: a.score,
                    totalPoints: a.total,
                    weight: a.weight
                }))
            });
            setAnalysis(result);
        } catch (error) {
            console.error("Analysis failed:", error);
            toast.error("Failed to analyze grades");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden border-t border-zinc-800 bg-zinc-900/30"
                >
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-indigo-300 flex items-center gap-2">
                                <Calculator className="w-4 h-4" /> Grade Analysis
                            </h4>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={onClose}
                                className="p-1 h-auto text-zinc-500 hover:text-zinc-300"
                            >
                                <ChevronUp className="w-4 h-4" />
                            </Button>
                        </div>

                        {!analysis ? (
                            <div className="space-y-3">
                                <p className="text-xs text-zinc-400">
                                    Enter your assignments (one per line) to see your projected grade and study advice.
                                </p>
                                <textarea
                                    placeholder="e.g. Midterm: 85/100 (20%)"
                                    rows={3}
                                    value={assignmentsInput}
                                    onChange={(e) => setAssignmentsInput(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-500"
                                    size="sm"
                                    isLoading={isLoading}
                                    onClick={handleAnalyze}
                                >
                                    Analyze Performance
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                {/* Current Standing */}
                                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                                    <div>
                                        <div className="text-xs text-zinc-500">Current Grade</div>
                                        <div className={cn("text-2xl font-bold",
                                            analysis.currentStanding.grade >= 90 ? "text-emerald-400" :
                                                analysis.currentStanding.grade >= 80 ? "text-blue-400" :
                                                    "text-amber-400"
                                        )}>
                                            {analysis.currentStanding.grade}%
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-zinc-500">Projected</div>
                                        <div className="text-lg font-semibold text-zinc-300">
                                            {analysis.projections.mostLikely}%
                                        </div>
                                    </div>
                                </div>

                                {/* Study Strategy */}
                                <div className="space-y-2">
                                    <h5 className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> Study Strategy
                                    </h5>
                                    <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 space-y-2">
                                        {analysis.studyStrategy.specificAdvice.slice(0, 2).map((advice, i) => (
                                            <p key={i}>• {advice}</p>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    className="w-full text-zinc-400 hover:bg-zinc-800"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setAnalysis(null)}
                                >
                                    New Analysis
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
