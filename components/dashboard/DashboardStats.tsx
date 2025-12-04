/**
 * DashboardStats - Stat widgets section
 * Single responsibility: Display key statistics
 */
"use client";

import React, { memo } from "react";
import { StatWidget } from "./Widgets";
import { GraduationCap, BookOpen, Target, Zap } from "lucide-react";

interface DashboardStatsProps {
  gpa: number;
  satScore: number | null;
  actScore: number | null;
  riskCounts: {
    safety: number;
    target: number;
    reach: number;
    highReach: number;
  };
}

export const DashboardStats = memo<DashboardStatsProps>(
  ({ gpa, satScore, actScore, riskCounts }) => {
    const totalTargets = riskCounts.safety + riskCounts.target + riskCounts.reach + riskCounts.highReach;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatWidget
          label="Current GPA"
          value={gpa > 0 ? gpa.toFixed(2) : "N/A"}
          icon={<GraduationCap size={20} />}
          subtext={gpa > 0 ? "Cumulative" : "Not Set"}
        />
        <StatWidget
          label="SAT Score"
          value={satScore || "N/A"}
          icon={<BookOpen size={20} />}
          subtext={satScore ? "Best Score" : "No score"}
        />
        <StatWidget
          label="Target Unis"
          value={totalTargets}
          icon={<Target size={20} />}
          subtext={`${riskCounts.reach + riskCounts.highReach} Reach`}
        />
        <StatWidget
          label="ACT Score"
          value={actScore || "N/A"}
          icon={<Zap size={20} />}
          subtext={actScore ? "Best Score" : "No score"}
        />
      </div>
    );
  }
);

DashboardStats.displayName = "DashboardStats";

