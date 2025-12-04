"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import { Sparkles, Check, X, Plus } from "lucide-react";
import { BlurredCard } from "@/components/ui/heroui/BlurredCard";
import { LoadingSkeleton } from "@/components/ui/heroui/LoadingSkeleton";
import { DifficultyChip } from "@/components/ui/heroui/DifficultyChip";
import { AIManager } from "@/managers/AIManager";
interface CourseRecommendation {
    course_name: string;
    reasoning: string;
    difficulty: string;
    relevance_score: number;
}
import { toast } from "sonner";

interface InlineCourseRecommenderProps {
    userId: string;
    currentCourses: any[];
    onAddCourses: (courses: any[]) => void;
    isExpanded: boolean;
    onClose: () => void;
}

export function InlineCourseRecommender({
    userId,
    currentCourses,
    onAddCourses,
    isExpanded,
    onClose
}: InlineCourseRecommenderProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [hasFetched, setHasFetched] = useState(false);

    const fetchRecommendations = React.useCallback(async () => {
        setIsLoading(true);
        try {
            // Mock user data for now - in real app would come from context/props
            const userData = {
                currentCourses: currentCourses.map(c => c.name),
                currentYear: 12, // Default or from props
                intendedMajor: "Computer Science", // Default or from props
                targetUniversities: [],
                interests: ["AI", "Web Development"]
            };

            const result = await AIManager.recommendCourses(userId, userData);
            // Transform result to match our local interface
            const recs = result.recommendedCourses.map(r => ({
                course_name: r.courseName,
                reasoning: r.reason,
                difficulty: r.difficulty,
                relevance_score: r.priority === 'High' ? 95 : r.priority === 'Medium' ? 80 : 60
            }));
            setRecommendations(recs);
            setHasFetched(true);
        } catch (error) {
            console.error("Failed to fetch recommendations:", error);
            toast.error("Failed to load recommendations");
        } finally {
            setIsLoading(false);
        }
    }, [currentCourses, userId]);

    // Fetch recommendations when expanded if not already fetched
    React.useEffect(() => {
        if (isExpanded && !hasFetched && !isLoading) {
            fetchRecommendations();
        }
    }, [isExpanded, hasFetched, isLoading, fetchRecommendations]);

    const toggleSelection = (courseName: string) => {
        if (selectedCourses.includes(courseName)) {
            setSelectedCourses(prev => prev.filter(c => c !== courseName));
        } else {
            setSelectedCourses(prev => [...prev, courseName]);
        }
    };

    const handleAddSelected = () => {
        const coursesToAdd = recommendations
            .filter(r => selectedCourses.includes(r.course_name))
            .map(r => ({
                name: r.course_name,
                level: r.difficulty,
                grade: "In Progress",
                credits: 3 // Default
            }));

        onAddCourses(coursesToAdd);
        toast.success(`Added ${coursesToAdd.length} courses`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                >
                    <div className="py-8 px-4 space-y-6 border-t border-zinc-800 mt-8 bg-zinc-950/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-indigo-400">
                                <Sparkles className="w-5 h-5" />
                                <h3 className="text-lg font-semibold">AI Course Suggestions</h3>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="flat"
                                    color="danger"
                                    onPress={onClose}
                                    className="bg-red-500/10 text-red-400"
                                >
                                    Dismiss
                                </Button>
                                {selectedCourses.length > 0 && (
                                    <Button
                                        size="sm"
                                        color="primary"
                                        onPress={handleAddSelected}
                                        startContent={<Plus className="w-4 h-4" />}
                                    >
                                        Add Selected ({selectedCourses.length})
                                    </Button>
                                )}
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-32 rounded-lg bg-zinc-900 animate-pulse border border-zinc-800" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {recommendations.map((rec, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => toggleSelection(rec.course_name)}
                                        className={`
                                            group relative p-4 rounded-lg border cursor-pointer transition-all duration-200
                                            flex flex-col justify-between gap-3 h-full
                                            ${selectedCourses.includes(rec.course_name)
                                                ? "bg-indigo-500/10 border-indigo-500/50 hover:bg-indigo-500/20"
                                                : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                                            }
                                        `}
                                    >
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-medium text-zinc-100 line-clamp-2 text-sm">
                                                {rec.course_name}
                                            </h4>
                                            {selectedCourses.includes(rec.course_name) && (
                                                <div className="h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-xs text-zinc-500 line-clamp-3">
                                            {rec.reasoning}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-800/50">
                                            <DifficultyChip level={rec.difficulty} />
                                            <span className="text-xs font-medium text-emerald-400">
                                                {rec.relevance_score}% Match
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
