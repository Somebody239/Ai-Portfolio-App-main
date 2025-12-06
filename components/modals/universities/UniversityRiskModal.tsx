import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { University, TestType } from "@/lib/types";
import { Sparkles, Save } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { StatsService } from "@/services/StatsService";

interface UniversityRiskModalProps {
    isOpen: boolean;
    onClose: () => void;
    university: (University & { risk?: string }) | null;
    onSave: (risk: string) => void;
}

export function UniversityRiskModal({
    isOpen,
    onClose,
    university,
    onSave
}: UniversityRiskModalProps) {
    const { courses, scores } = usePortfolio();
    const gpa = StatsService.getInstance().calculateGPA(courses);
    const [selectedRisk, setSelectedRisk] = useState<string>("Target");
    const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);

    useEffect(() => {
        if (university?.risk) {
            setSelectedRisk(university.risk);
        } else {
            setSelectedRisk("Target");
        }
        setAiRecommendation(null);
    }, [university, isOpen]);

    if (!university) return null;

    const handleAIRecommend = () => {
        const stats = StatsService.getInstance();
        const sat = stats.getBestScore(scores, TestType.SAT);
        const recommendation = stats.calculateAdmissionsRisk(gpa, sat, university);
        setAiRecommendation(recommendation);
        setSelectedRisk(recommendation);
    };

    const handleSave = () => {
        onSave(selectedRisk);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[400px] bg-zinc-900 border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                        Edit Risk Level
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                        {university.image_url ? (
                            <img
                                src={university.image_url}
                                alt={university.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-zinc-700 flex items-center justify-center text-[#FF6B35] font-bold">
                                {university.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <p className="font-medium text-white text-sm">{university.name}</p>
                            <p className="text-xs text-zinc-400">{university.city}, {university.state}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400">How do you categorize this school?</label>
                        <Select
                            value={selectedRisk}
                            onChange={(e) => setSelectedRisk(e.target.value)}
                            options={[
                                { value: "Safety", label: "Safety (Likely to get in)" },
                                { value: "Target", label: "Target (Good match)" },
                                { value: "Reach", label: "Reach (Difficult)" },
                                { value: "High Reach", label: "High Reach (Very difficult)" },
                            ]}
                            className="w-full"
                        />
                    </div>

                    <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-indigo-200 flex items-center gap-2">
                                <Sparkles size={14} />
                                AI Recommendation
                            </span>
                            {!aiRecommendation && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleAIRecommend}
                                    className="h-7 text-xs border-indigo-700 text-indigo-300 hover:bg-indigo-900/50"
                                >
                                    Analyze
                                </Button>
                            )}
                        </div>

                        {aiRecommendation ? (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <p className="text-sm text-zinc-300">
                                    Based on your GPA ({gpa.toFixed(2)}) and test scores, we recommend categorizing this as a <span className="font-bold text-white">{aiRecommendation}</span>.
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs text-zinc-500">
                                Let AI analyze your stats against this university&apos;s admissions data.
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                        <Save size={16} />
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
