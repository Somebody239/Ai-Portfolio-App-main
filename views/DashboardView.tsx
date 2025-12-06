/**
 * DashboardView - Main dashboard container
 * Single responsibility: Orchestrate dashboard using ViewModel pattern
 */
"use client";

import React, { useState, useCallback, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Plus } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useUniversities } from "@/hooks/useUniversities";
import { useUser } from "@/hooks/useUser";
import { useDashboardViewModel } from "@/viewmodels/DashboardViewModel";
import { UniversitySelectModal } from "@/components/modals/universities/UniversitySelectModal";
import { UniversityDetailsModal } from "@/components/modals/universities/UniversityDetailsModal";
import { UniversityRiskModal } from "@/components/modals/universities/UniversityRiskModal";
import { TestScoreModal } from "@/components/modals/scores/TestScoreModal";
import { AcceptancePredictionBanner } from "@/components/dashboard/AcceptancePredictionBanner";
import { University, TestType } from "@/lib/types";
import { UniversityTargetsManager } from "@/managers/UniversityTargetsManager";
import { TestScoresManager } from "@/managers/TestScoresManager";

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
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [selectedRiskUniversity, setSelectedRiskUniversity] = useState<(University & { risk?: string }) | null>(null);

  const predictionBannerRef = useRef<HTMLDivElement>(null);

  const scrollToPrediction = () => {
    predictionBannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const {
    courses,
    scores,
    targets,
    recommendations,
    extracurriculars,
    achievements,
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
    timelineEvents,
  } = useDashboardViewModel({
    courses,
    scores,
    targets,
    universities,
    recommendations,
    extracurriculars,
    achievements,
    user,
  });

  const loading = portfolioLoading || universitiesLoading || userLoading;
  const targetsManager = new UniversityTargetsManager();
  const scoresManager = new TestScoresManager();

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



  const handleAddUniversity = useCallback(async (uni: University) => {
    if (!user) return;
    try {
      await targetsManager.create(user.id, { university_id: uni.id });
      await refetchPortfolio();
    } catch (error) {
      console.error("Failed to add university:", error);
    }
  }, [user, targetsManager, refetchPortfolio]);

  const getUniversityRisk = useCallback((universityId: number) => {
    return uniRisks.find(u => u.id === universityId)?.risk || "Target";
  }, [uniRisks]);

  const handleEditRisk = useCallback((uni: University) => {
    const currentRisk = getUniversityRisk(uni.id);
    setSelectedRiskUniversity({ ...uni, risk: currentRisk });
    setIsRiskModalOpen(true);
  }, [getUniversityRisk]);

  const handleUpdateRisk = useCallback(async (newRisk: string) => {
    if (!selectedUniversity || !user) return;
    const target = targets.find((t) => t.university_id === selectedUniversity.id);
    if (!target) return;

    // Preserve existing reason, remove old risk tag if present
    let currentReason = target.reason_for_interest || "";
    currentReason = currentReason.replace(/\[Risk: (Safety|Target|Reach|High Reach)\]\s*/g, "");

    // Prepend new risk tag
    const newReason = `[Risk: ${newRisk}] ${currentReason}`.trim();

    try {
      await targetsManager.update(target.id, { reason_for_interest: newReason });
      await refetchPortfolio();

      // Update selected university local state to reflect change immediately
      setSelectedUniversity(prev => prev ? { ...prev, risk: newRisk } : null);
    } catch (error) {
      console.error("Failed to update risk:", error);
    }
  }, [selectedUniversity, user, targets, targetsManager, refetchPortfolio]);

  const handleSaveRiskModal = useCallback(async (risk: string) => {
    if (!selectedRiskUniversity || !user) return;

    const target = targets.find(t => t.university_id === selectedRiskUniversity.id);
    if (!target) return;

    // Preserve existing reason content if any
    let existingReason = target.reason_for_interest || "";
    // Remove old risk tag if present
    existingReason = existingReason.replace(/\[Risk: .*?\]\s*/, "");

    const newReason = `[Risk: ${risk}] ${existingReason}`.trim();

    try {
      await targetsManager.update(target.id, { reason_for_interest: newReason });
      await refetchPortfolio();
      setIsRiskModalOpen(false); // Close the modal
      setSelectedRiskUniversity(null); // Clear selected university
    } catch (error) {
      console.error("Failed to update risk from modal:", error);
    }
  }, [user, targets, targetsManager, refetchPortfolio, selectedRiskUniversity]);


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
      </div>

      {/* Top KPI Row */}
      <CompactKPISection
        gpa={gpa}
        riskCounts={safeRiskCounts}
        extracurricularsCount={extracurriculars.length}
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
              onAdd={() => setIsUniversityModalOpen(true)}
              onAddUniversity={handleAddUniversity}
              onEditRisk={handleEditRisk} // Pass the new handler
            />
          </div>

          <div ref={predictionBannerRef}>
            <AcceptancePredictionBanner />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[340px]">
            <TestScoresCard
              satScore={satScore}
              actScore={actScore}
            />
            <ActivitiesDonutChart activityHours={activityHours} />
            <AnalyticsSnapshot />
          </div>
        </div>

        {/* Right Column (Assistant & Timeline) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="min-h-[400px]">
            <AIAssistantModule
              insight={aiInsight}
              onPredictAcceptance={scrollToPrediction}
            />
          </div>
          <div className="min-h-[340px]">
            <RecentEventsTimeline events={timelineEvents} />
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
        isOpen={!!selectedUniversity}
        onClose={() => setSelectedUniversity(null)}
        university={selectedUniversity ? {
          ...selectedUniversity,
          risk: getUniversityRisk(selectedUniversity.id)
        } : null}
      />

      <UniversityRiskModal
        isOpen={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
        university={selectedRiskUniversity}
        onSave={handleSaveRiskModal}
      />

      {user && (
        <TestScoreModal
          isOpen={isScoreModalOpen}
          onClose={() => setIsScoreModalOpen(false)}
          onSuccess={() => {
            setIsScoreModalOpen(false);
            refetchPortfolio();
          }}
          userId={user.id}
        />
      )}
    </AppShell>
  );
}
