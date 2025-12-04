"use client";

import React from "react";
import { Card } from "@/components/ui/Atoms";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { Button } from "@/components/base/buttons/button";
import { Sparkles, BookOpen, TrendingUp, FileText } from "lucide-react";
import { useRouter } from "next/navigation";


interface AIInsightsWidgetProps {
    improvementInsight: {
        courseName: string;
        from: string;
        to: string;
        projectedGpa: number;
        delta: number;
    } | null;
    activityHours: {
        total: number;
        leadership: number;
        service: number;
        other: number;
    };
}

export const AIInsightsWidget = ({ improvementInsight, activityHours }: AIInsightsWidgetProps) => {
    const router = useRouter();

    return (
        <Card className="space-y-8 bg-zinc-950 border-zinc-800 p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Sparkles size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active
                </span>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Activity Hours/Week</span>
                        <span className="text-white font-medium">{activityHours.total.toFixed(1)} hrs</span>
                    </div>
                    <ProgressBar
                        value={Math.min(100, (activityHours.total / 20) * 100)}
                        className="bg-zinc-800"
                        progressClassName="bg-indigo-500"
                    />
                </div>

                {improvementInsight ? (
                    <Alert variant="info" className="bg-indigo-950/30 border-indigo-500/20 text-indigo-200">
                        <div className="flex gap-3 w-full">
                            <Sparkles className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                            <div className="w-full">
                                <AlertTitle className="text-indigo-300 mb-2 block">GPA Boost Opportunity</AlertTitle>
                                <AlertDescription className="text-indigo-200/80 block">
                                    Raise {improvementInsight.courseName} from {improvementInsight.from}→{improvementInsight.to} to push your GPA to {improvementInsight.projectedGpa.toFixed(2)} ({improvementInsight.delta >= 0 ? '+' : ''}{improvementInsight.delta.toFixed(2)}).
                                </AlertDescription>
                            </div>
                        </div>
                    </Alert>
                ) : (
                    <Alert variant="info" className="bg-indigo-950/30 border-indigo-500/20 text-indigo-200">
                        <div className="flex gap-3 w-full">
                            <Sparkles className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                            <div className="w-full">
                                <AlertTitle className="text-indigo-300 mb-2 block">AI Ready</AlertTitle>
                                <AlertDescription className="text-indigo-200/80 block">
                                    Add courses and activities to unlock personalized AI recommendations.
                                </AlertDescription>
                            </div>
                        </div>
                    </Alert>
                )}
            </div>
        </Card>
    );
};
