/**
 * DashboardViewModel - Manages dashboard state and computed values
 * Single responsibility: Handle dashboard UI state and calculations
 */
import { useMemo } from "react";
import { StatsService } from "@/services/StatsService";
import { GPACalculator } from "@/services/GPACalculator";
import { TestType } from "@/lib/types";
import type {
  Course,
  StandardizedScore,
  University,
  UserTargetWithUniversity,
  Extracurricular,
  AIRecommendation,
  User,
  Achievement,
} from "@/lib/types";

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  type: 'target' | 'activity' | 'award';
  color: string;
  icon: any; // Lucide icon
}

interface DashboardViewModelProps {
  courses: Course[];
  scores: StandardizedScore[];
  targets: UserTargetWithUniversity[];
  universities: University[];
  recommendations: AIRecommendation[];
  extracurriculars: Extracurricular[];
  achievements: Achievement[];
  user: User | null;
}

export class DashboardViewModel {
  private statsService: StatsService;
  private courses: Course[];
  private scores: StandardizedScore[];
  private targets: UserTargetWithUniversity[];
  private universities: University[];
  private recommendations: AIRecommendation[];
  private extracurriculars: Extracurricular[];
  private achievements: Achievement[];
  private user: User | null;

  constructor(props: DashboardViewModelProps) {
    this.statsService = StatsService.getInstance();
    this.courses = props.courses;
    this.scores = props.scores;
    this.targets = props.targets;
    this.universities = props.universities;
    this.recommendations = props.recommendations;
    this.extracurriculars = props.extracurriculars;
    this.achievements = props.achievements;
    this.user = props.user;
  }

  getGPA(): number {
    // Always calculate from courses using the same method as academics page
    // This ensures consistency between dashboard and academics page
    return GPACalculator.calculateUnweightedGPA(this.courses);
  }

  getSATScore(): number | null {
    return this.statsService.getBestScore(this.scores, TestType.SAT);
  }

  getACTScore(): number | null {
    return this.statsService.getBestScore(this.scores, TestType.ACT);
  }

  getTargetUniversities(): University[] {
    return this.targets
      .filter(target => target.university)
      .map(target => target.university!);
  }

  getUniversityRisks(): Array<University & { risk: "Safety" | "Target" | "Reach" | "High Reach" }> {
    const gpa = this.getGPA();
    const satScore = this.getSATScore();

    return this.targets
      .filter(target => target.university)
      .map((target) => {
        const uni = target.university!;

        // Check for manual risk override in reason_for_interest
        // Format: "[Risk: Reach] ..."
        const manualRiskMatch = target.reason_for_interest?.match(/\[Risk: (Safety|Target|Reach|High Reach)\]/);

        let risk: "Safety" | "Target" | "Reach" | "High Reach";

        if (manualRiskMatch) {
          risk = manualRiskMatch[1] as "Safety" | "Target" | "Reach" | "High Reach";
        } else {
          risk = this.statsService.calculateAdmissionsRisk(gpa, satScore, uni);
        }

        return {
          ...uni,
          risk,
        };
      });
  }

  getSATSectionScores(): { math: number | null; readingWriting: number | null } {
    const satScoreRecord = this.scores.find((s) => s.test_type === TestType.SAT);
    if (!satScoreRecord?.section_scores) {
      return { math: null, readingWriting: null };
    }

    const math = satScoreRecord.section_scores.math || null;
    const readingWriting =
      satScoreRecord.section_scores.reading_writing ||
      satScoreRecord.section_scores["reading_writing"] ||
      satScoreRecord.section_scores["reading & writing"] ||
      null;

    return { math, readingWriting };
  }

  getRiskCounts(): Record<"Safety" | "Target" | "Reach" | "High Reach", number> {
    const risks = this.getUniversityRisks();
    const counts: Record<"Safety" | "Target" | "Reach" | "High Reach", number> = {
      Safety: 0,
      Target: 0,
      Reach: 0,
      "High Reach": 0,
    };

    risks.forEach((uni) => {
      counts[uni.risk]++;
    });

    return counts;
  }

  getActivityHours(): { total: number; leadership: number; service: number; other: number } {
    const total = this.extracurriculars.reduce(
      (sum, activity) => sum + (activity.hours_per_week || 0),
      0
    );

    const leadership = this.extracurriculars
      .filter(a =>
        a.title?.toLowerCase().includes('leader') ||
        a.title?.toLowerCase().includes('president') ||
        a.title?.toLowerCase().includes('captain') ||
        a.title?.toLowerCase().includes('officer')
      )
      .reduce((sum, a) => sum + (a.hours_per_week || 0), 0);

    const service = this.extracurriculars
      .filter(a =>
        a.name?.toLowerCase().includes('service') ||
        a.name?.toLowerCase().includes('volunteer') ||
        a.name?.toLowerCase().includes('community')
      )
      .reduce((sum, a) => sum + (a.hours_per_week || 0), 0);

    const other = total - leadership - service;

    return {
      total,
      leadership,
      service,
      other: Math.max(0, other) // Ensure non-negative
    };
  }

  getImprovementInsight(): {
    courseName: string;
    from: number;
    to: number;
    delta: number;
    projectedGpa: number;
  } | null {
    const gradedCourses = this.courses.filter(c => c.grade !== null);
    if (gradedCourses.length === 0) return null;

    const sorted = [...gradedCourses].sort((a, b) => a.grade! - b.grade!);
    const lowest = sorted[0];
    const bumpTarget = Math.min(100, lowest.grade! + 5);
    const updatedCourses = this.courses.map((course) =>
      course.id === lowest.id ? { ...course, grade: bumpTarget } : course
    );
    const projectedGpa = this.statsService.calculateGPA(updatedCourses);
    const currentGpa = this.getGPA();

    return {
      courseName: lowest.name,
      from: lowest.grade!,
      to: bumpTarget,
      delta: projectedGpa - currentGpa,
      projectedGpa,
    };
  }

  getTimelineEvents(): TimelineEvent[] {
    const events: TimelineEvent[] = [];

    // Targets
    this.targets.forEach(t => {
      if (t.created_at && t.university) {
        events.push({
          id: `target-${t.id}`,
          title: `Added ${t.university.name}`,
          date: new Date(t.created_at).toLocaleDateString(),
          type: 'target',
          color: 'bg-blue-500/20 text-blue-400',
          icon: 'Target'
        });
      }
    });

    // Activities
    this.extracurriculars.forEach(e => {
      if (e.created_at) {
        events.push({
          id: `activity-${e.id}`,
          title: `Added Activity: ${e.name}`,
          date: new Date(e.created_at).toLocaleDateString(),
          type: 'activity',
          color: 'bg-purple-500/20 text-purple-400',
          icon: 'BookOpen'
        });
      }
    });

    // Achievements
    this.achievements.forEach(a => {
      if (a.created_at) {
        events.push({
          id: `award-${a.id}`,
          title: `Added Award: ${a.title}`,
          date: new Date(a.created_at).toLocaleDateString(),
          type: 'award',
          color: 'bg-yellow-500/20 text-yellow-400',
          icon: 'Award'
        });
      }
    });

    // Sort by date desc
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }
}

/**
 * React hook wrapper for DashboardViewModel
 */
export function useDashboardViewModel(props: DashboardViewModelProps) {
  const viewModel = useMemo(() => new DashboardViewModel(props), [
    props.courses,
    props.scores,
    props.targets,
    props.universities,
    props.recommendations,
    props.extracurriculars,
    props.achievements,
    props.user,
  ]);

  const gpa = useMemo(() => viewModel.getGPA(), [viewModel]);
  const satScore = useMemo(() => viewModel.getSATScore(), [viewModel]);
  const actScore = useMemo(() => viewModel.getACTScore(), [viewModel]);
  const targetUniversities = useMemo(() => viewModel.getTargetUniversities(), [viewModel]);
  const uniRisks = useMemo(() => viewModel.getUniversityRisks(), [viewModel]);
  const satSections = useMemo(() => viewModel.getSATSectionScores(), [viewModel]);
  const riskCounts = useMemo(() => viewModel.getRiskCounts(), [viewModel]);
  const activityHours = useMemo(() => viewModel.getActivityHours(), [viewModel]);
  const improvementInsight = useMemo(() => viewModel.getImprovementInsight(), [viewModel]);
  const timelineEvents = useMemo(() => viewModel.getTimelineEvents(), [viewModel]);

  return {
    gpa,
    satScore,
    actScore,
    targetUniversities,
    uniRisks,
    satSections,
    riskCounts,
    activityHours,
    improvementInsight,
    timelineEvents,
  };
}

