/**
 * DashboardView - Main dashboard container
 * Single responsibility: Orchestrate dashboard using ViewModel pattern
 */
"use client";

import React, { useState, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Plus } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useUniversities } from "@/hooks/useUniversities";
import { useUser } from "@/hooks/useUser";
import { useDashboardViewModel } from "@/viewmodels/DashboardViewModel";
import { UniversitySelectModal } from "@/components/modals/universities/UniversitySelectModal";
import { UniversityDetailsModal } from "@/components/modals/universities/UniversityDetailsModal";
import { University } from "@/lib/types";
import { UniversityTargetsManager } from "@/managers/UniversityTargetsManager";

// New Widgets
import { CompactKPISection } from "@/components/dashboard/new-widgets/CompactKPISection";
import { GPAProgressChart } from "@/components/dashboard/new-widgets/GPAProgressChart";
import { CompactUniversityList } from "@/components/dashboard/new-widgets/CompactUniversityList";
import { TestScoresCard } from "@/components/dashboard/new-widgets/TestScoresCard";
import { ActivitiesDonutChart } from "@/components/dashboard/new-widgets/ActivitiesDonutChart";
import { AIAssistantModule } from "@/components/dashboard/new-widgets/AIAssistantModule";
import { AnalyticsSnapshot } from "@/components/dashboard/new-widgets/AnalyticsSnapshot";
import { RecentEventsTimeline } from "@/components/dashboard/new-widgets/RecentEventsTimeline";


export default function DashboardView() {
  const [isUniversityModalOpen, setIsUniversityModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);

  const {
    courses,
    scores,
    targets,
    recommendations,
    extracurriculars,
    loading: portfolioLoading,
    refetch: refetchPortfolio,
  } = usePortfolio();
  const { universities, loading: universitiesLoading } = useUniversities();
  const { user, loading: userLoading } = useUser();

  const {
    gpa,
    satScore,
    actScore,
    targetUniversities,
    uniRisks,
    riskCounts,
    activityHours,
    improvementInsight,
  } = useDashboardViewModel({
    courses,
    scores,
    targets,
    universities,
    recommendations,
    extracurriculars,
    user,
  });

  const loading = portfolioLoading || universitiesLoading || userLoading;
  const targetsManager = new UniversityTargetsManager();

  // Ensure riskCounts has default values to prevent NaN
  const safeRiskCounts = {
    safety: riskCounts?.['Safety'] || 0,
    target: riskCounts?.['Target'] || 0,
    reach: riskCounts?.['Reach'] || 0,
    highReach: riskCounts?.['High Reach'] || 0,
  };

  // Map improvement insight to AI module format
  const aiInsight = improvementInsight ? {
    title: `Improve ${improvementInsight.courseName}`,
    description: `Raising your grade from ${improvementInsight.from.toFixed(0)}% to ${improvementInsight.to.toFixed(0)}% could boost your GPA to ${improvementInsight.projectedGpa.toFixed(2)}.`
  } : null;

  const handleRemoveTarget = useCallback(async (universityId: number) => {
    if (!user) return;
    const target = targets.find((t) => t.university_id === universityId);
    if (!target) return;

    try {
      await targetsManager.delete(target.id);
      await refetchPortfolio();
    } catch (error) {
      console.error("Failed to remove university:", error);
    }
  }, [user, targets, targetsManager, refetchPortfolio]);

  const handleSelectUniversity = useCallback((university: University) => {
    setSelectedUniversity(university);
  }, []);

  const handleTargetCreated = useCallback(async () => {
    await refetchPortfolio();
  }, [refetchPortfolio]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-100"></div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Welcome back, {user?.name?.split(" ")[0] || "Student"}
          </h1>
          <p className="text-zinc-400">
            Here's your college application progress overview.
          </p>
        </div>
        <button
          onClick={() => setIsUniversityModalOpen(true)}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-zinc-100 text-black hover:bg-white font-medium transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add University
        </button>
      </div>

      {/* Top KPI Row */}
      <CompactKPISection
        gpa={gpa}
        riskCounts={safeRiskCounts}
        satScore={satScore}
        actScore={actScore}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Column (Main Stats) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[400px]">
            <GPAProgressChart currentGpa={gpa} />
            <CompactUniversityList
              universities={uniRisks}
              onSelect={handleSelectUniversity}
              onRemove={handleRemoveTarget}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[340px]">
            <TestScoresCard satScore={satScore} actScore={actScore} />
            <ActivitiesDonutChart activityHours={activityHours} />
            <AnalyticsSnapshot />
          </div>
        </div>

        {/* Right Column (Assistant & Timeline) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="min-h-[400px]">
            <AIAssistantModule insight={aiInsight} />
          </div>
          <div className="min-h-[340px]">
            <RecentEventsTimeline />
          </div>
        </div>
      </div>

      {/* Modals */}
      {user && (
        <UniversitySelectModal
          isOpen={isUniversityModalOpen}
          onClose={() => setIsUniversityModalOpen(false)}
          onSuccess={handleTargetCreated}
          userId={user.id}
          excludeUniversityIds={targets.map((t) => Number(t.university_id))}
        />
      )}

      <UniversityDetailsModal
        university={selectedUniversity}
        isOpen={!!selectedUniversity}
        onClose={() => setSelectedUniversity(null)}
      />
    </AppShell>
  );
}
