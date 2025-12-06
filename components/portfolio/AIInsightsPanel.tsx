import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Atoms";
import { Button } from "@/components/ui/Button";
import { PersonalityInput, AIExtractedData } from "@/lib/types";
import { Sparkles, TrendingUp, Award, Lightbulb, BookOpen } from "lucide-react";

interface AIInsightsPanelProps {
    userId: string;
    responses: PersonalityInput[];
}

export function AIInsightsPanel({ userId, responses }: AIInsightsPanelProps) {
    const [aggregatedData, setAggregatedData] = useState<AIExtractedData>({
        achievements: [],
        personalityTraits: [],
        skills: [],
        interests: [],
        essayThemes: []
    });

    useEffect(() => {
        // Aggregate AI-extracted data from all responses
        const allData: AIExtractedData = {
            achievements: [],
            personalityTraits: [],
            skills: [],
            interests: [],
            essayThemes: []
        };

        responses.forEach(response => {
            if (response.ai_extracted_data) {
                const data = response.ai_extracted_data;
                if (data.achievements) allData.achievements!.push(...data.achievements);
                if (data.personalityTraits) allData.personalityTraits!.push(...data.personalityTraits);
                if (data.skills) allData.skills!.push(...data.skills);
                if (data.interests) allData.interests!.push(...data.interests);
                if (data.essayThemes) allData.essayThemes!.push(...data.essayThemes);
            }
        });

        // Remove duplicates
        allData.achievements = Array.from(new Set(allData.achievements));
        allData.personalityTraits = Array.from(new Set(allData.personalityTraits));
        allData.skills = Array.from(new Set(allData.skills));
        allData.interests = Array.from(new Set(allData.interests));
        allData.essayThemes = Array.from(new Set(allData.essayThemes));

        setAggregatedData(allData);
    }, [responses]);

    const hasAnyData =
        (aggregatedData.achievements?.length || 0) > 0 ||
        (aggregatedData.personalityTraits?.length || 0) > 0 ||
        (aggregatedData.skills?.length || 0) > 0 ||
        (aggregatedData.interests?.length || 0) > 0 ||
        (aggregatedData.essayThemes?.length || 0) > 0;

    if (!hasAnyData) {
        return null; // Don't show panel if no AI data exists
    }

    const handleAddToPortfolio = (item: string, type: string) => {
        // TODO: Implement adding to achievements/extracurriculars
        alert(`Feature coming soon: Add "${item}" to your ${type}`);
    };

    return (
        <Card className="space-y-6 bg-gradient-to-br from-emerald-950/20 to-amber-300/10 border-emerald-900/30">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950/50 border border-emerald-900/50">
                    <Sparkles className="h-6 w-6 text-amber-300" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">AI Insights</h2>
                    <p className="text-sm text-zinc-500">
                        Discovered from your responses
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Achievements */}
                {aggregatedData.achievements && aggregatedData.achievements.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                            <Award className="w-4 h-4" />
                            <span>Achievements Discovered</span>
                        </div>
                        <div className="space-y-2">
                            {aggregatedData.achievements.map((achievement, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start justify-between gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-colors group"
                                >
                                    <p className="text-sm text-zinc-300 flex-grow">{achievement}</p>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleAddToPortfolio(achievement, 'achievements')}
                                        className="shrink-0 text-emerald-400 hover:text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        + Add
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Personality Traits */}
                {aggregatedData.personalityTraits && aggregatedData.personalityTraits.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-amber-300">
                            <TrendingUp className="w-4 h-4" />
                            <span>Key Personality Traits</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {aggregatedData.personalityTraits.map((trait, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1.5 rounded-full bg-amber-300/10 border border-amber-300/20 text-xs font-medium text-amber-300 capitalize"
                                >
                                    {trait}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {aggregatedData.skills && aggregatedData.skills.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                            <Lightbulb className="w-4 h-4" />
                            <span>Skills Identified</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {aggregatedData.skills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-800/50 text-xs font-medium text-emerald-300"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Interests */}
                {aggregatedData.interests && aggregatedData.interests.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-amber-300">
                            <BookOpen className="w-4 h-4" />
                            <span>Academic Interests</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {aggregatedData.interests.map((interest, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1.5 rounded-full bg-amber-300/10 border border-amber-300/20 text-xs font-medium text-amber-300"
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Essay Themes */}
                {aggregatedData.essayThemes && aggregatedData.essayThemes.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                            <Sparkles className="w-4 h-4" />
                            <span>Potential Essay Themes</span>
                        </div>
                        <div className="space-y-2">
                            {aggregatedData.essayThemes.map((theme, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/30 text-sm text-emerald-200 italic"
                                >
                                    &quot;{theme}&quot;
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 text-center">
                    💡 Tip: Answer more personality questions to discover additional insights
                </p>
            </div>
        </Card>
    );
}
