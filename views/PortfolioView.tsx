"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useUser } from "@/hooks/useUser";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ExtracurricularsSection } from "@/components/portfolio/ExtracurricularsSection";
import { AchievementsSection } from "@/components/portfolio/AchievementsSection";
import { PersonalitySection } from "@/components/portfolio/PersonalitySection";
import { AIInsightsPanel } from "@/components/portfolio/AIInsightsPanel";
import { ApplicationEssaysSection } from "@/components/portfolio/ApplicationEssaysSection";
import { PortfolioAnalyzer } from "@/components/portfolio/PortfolioAnalyzer";
import { ExtracurricularModal } from "@/components/modals/extracurriculars/ExtracurricularModal";
import { AchievementModal } from "@/components/modals/achievements/AchievementModal";
import { ExtracurricularsManager } from "@/managers/ExtracurricularsManager";
import { AchievementsManager } from "@/managers/AchievementsManager";
import { PersonalityManager } from "@/managers/PersonalityManager";
import { Extracurricular, Achievement, PersonalityInput } from "@/lib/types";
import { ExtracurricularFormData } from "@/components/portfolio/ExtracurricularInlineForm";

export default function PortfolioView() {
    const {
        extracurriculars,
        achievements,
        loading,
        error,
        refetch,
    } = usePortfolio();
    const { user, loading: userLoading } = useUser();

    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Extracurricular | null>(null);
    const [editingAward, setEditingAward] = useState<Achievement | null>(null);
    const [personalityResponses, setPersonalityResponses] = useState<PersonalityInput[]>([]);

    const searchParams = useSearchParams();
    const shouldAutoAnalyze = searchParams.get('action') === 'analyze';

    // Clean up URL if auto-analyzing
    useEffect(() => {
        if (shouldAutoAnalyze) {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, [shouldAutoAnalyze]);

    const personalityManager = useMemo(() => new PersonalityManager(), []);

    const loadPersonalityResponses = useCallback(async () => {
        if (!user) return;
        try {
            const responses = await personalityManager.getUserAnswers(user.id);
            setPersonalityResponses(responses);
        } catch (error) {
            console.error("Failed to load personality responses:", error);
        }
    }, [user, personalityManager]);

    useEffect(() => {
        loadPersonalityResponses();
    }, [loadPersonalityResponses]);

    const handleAddActivity = () => {
        setEditingActivity(null);
        setIsActivityModalOpen(true);
    };

    const handleEditActivity = (activity: Extracurricular) => {
        setEditingActivity(activity);
        setIsActivityModalOpen(true);
    };

    const handleDeleteActivity = async (id: string) => {
        if (!confirm("Are you sure you want to delete this activity?")) return;
        try {
            const manager = new ExtracurricularsManager();
            await manager.delete(id);
            refetch();
        } catch (error) {
            console.error("Failed to delete activity:", error);
            alert("Failed to delete activity. Please try again.");
        }
    };

    const handleAddActivityInline = async (data: ExtracurricularFormData) => {
        if (!user) return;
        const manager = new ExtracurricularsManager();
        await manager.create(user.id, data);
        await refetch();
    };

    const handleUpdateActivityInline = async (id: string, data: ExtracurricularFormData) => {
        const manager = new ExtracurricularsManager();
        await manager.update(id, data);
        await refetch();
    };

    const handleAddAward = () => {
        setEditingAward(null);
        setIsAwardModalOpen(true);
    };

    const handleEditAward = (award: Achievement) => {
        setEditingAward(award);
        setIsAwardModalOpen(true);
    };

    const handleDeleteAward = async (id: string) => {
        if (!confirm("Are you sure you want to delete this award?")) return;
        try {
            const manager = new AchievementsManager();
            await manager.delete(id);
            refetch();
        } catch (error) {
            console.error("Failed to delete award:", error);
            alert("Failed to delete award. Please try again.");
        }
    };

    const handleAddAwardInline = async (data: any) => {
        if (!user) return;
        const manager = new AchievementsManager();
        await manager.create(user.id, data);
        await refetch();
    };

    const handleUpdateAwardInline = async (id: string, data: any) => {
        const manager = new AchievementsManager();
        await manager.update(id, data);
        await refetch();
    };


    const isLoading = loading || userLoading;

    if (isLoading) {
        return (
            <AppShell>
                <div className="h-full flex items-center justify-center">
                    <span className="text-zinc-500 animate-pulse">Loading Portfolio...</span>
                </div>
            </AppShell>
        );
    }

    if (error) {
        return (
            <AppShell>
                <div className="h-full flex items-center justify-center">
                    <span className="text-red-400 text-sm">Failed to load portfolio. Please refresh.</span>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <Breadcrumbs items={[{ label: "Portfolio" }]} />

            <header className="mb-12">
                <h1 className="text-3xl font-bold text-white tracking-tight">Portfolio</h1>
                <p className="text-zinc-400 mt-2 max-w-2xl">
                    Build your holistic profile. Universities look for leadership, impact, and personal growth beyond just grades.
                </p>
            </header>

            <div className="space-y-10 max-w-5xl">
                {/* AI Analyzer */}
                {user && (
                    <PortfolioAnalyzer
                        userId={user.id}
                        data={{
                            interests: user.interests || [],
                            careerGoals: user.intended_major || "Undecided",
                            currentActivities: extracurriculars.map(e => e.name),
                            personalityTraits: [],
                        }}
                        autoAnalyze={shouldAutoAnalyze}
                    />
                )}

                <ExtracurricularsSection
                    items={extracurriculars}
                    onAdd={handleAddActivity}
                    onAddInline={handleAddActivityInline}
                    onUpdateInline={handleUpdateActivityInline}
                    onEdit={handleEditActivity}
                    onDelete={handleDeleteActivity}
                />

                <div className="w-full h-px bg-zinc-900" />

                <AchievementsSection
                    items={achievements}
                    onAdd={handleAddAward}
                    onAddInline={handleAddAwardInline}
                    onUpdateInline={handleUpdateAwardInline}
                    onEdit={handleEditAward}
                    onDelete={handleDeleteAward}
                />

                <div className="w-full h-px bg-zinc-900" />

                {user && (
                    <>
                        <PersonalitySection userId={user.id} />
                        <div className="w-full h-px bg-zinc-900" />
                        <AIInsightsPanel userId={user.id} responses={personalityResponses} />
                        <div className="w-full h-px bg-zinc-900" />
                        <ApplicationEssaysSection userId={user.id} />
                    </>
                )}
            </div>

            {/* Modals */}
            {user && (
                <>
                    <ExtracurricularModal
                        isOpen={isActivityModalOpen}
                        onClose={() => {
                            setIsActivityModalOpen(false);
                            setEditingActivity(null);
                        }}
                        onSuccess={() => {
                            refetch();
                            setEditingActivity(null);
                        }}
                        userId={user.id}
                        initialData={editingActivity || undefined}
                        mode={editingActivity ? "edit" : "create"}
                    />

                    <AchievementModal
                        isOpen={isAwardModalOpen}
                        onClose={() => {
                            setIsAwardModalOpen(false);
                            setEditingAward(null);
                        }}
                        onSuccess={() => {
                            refetch();
                            setEditingAward(null);
                        }}
                        userId={user.id}
                        initialData={editingAward || undefined}
                        mode={editingAward ? "edit" : "create"}
                    />
                </>
            )}
        </AppShell>
    );
}

