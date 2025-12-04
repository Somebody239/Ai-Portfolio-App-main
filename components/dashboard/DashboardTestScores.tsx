/**
 * DashboardTestScores - Standardized test scores display
 * Single responsibility: Show SAT/ACT breakdown
 */
"use client";

import React, { memo } from "react";
import { Card } from "@/components/ui/Atoms";

interface DashboardTestScoresProps {
  satScore: number | null;
  actScore: number | null;
  satSections: {
    math: number | null;
    readingWriting: number | null;
  };
}

export const DashboardTestScores = memo<DashboardTestScoresProps>(
  ({ satScore, actScore, satSections }) => {
    const { math: satMath, readingWriting: satReadingWriting } = satSections;

    return (
      <Card>
        <h4 className="text-lg font-medium text-white mb-4">Standardized Testing</h4>
        <div className="space-y-6">
          {satScore ? (
            <>
              {satMath && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">SAT Math</span>
                    <span className="text-white">{satMath} / 800</span>
                  </div>
                  <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white"
                      style={{ width: `${(satMath / 800) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {satReadingWriting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">SAT R&W</span>
                    <span className="text-white">{satReadingWriting} / 800</span>
                  </div>
                  <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-600"
                      style={{ width: `${(satReadingWriting / 800) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {!satMath && !satReadingWriting && satScore && (
                <div className="text-sm text-zinc-400 text-center py-4">
                  Total SAT: <span className="text-white font-semibold">{satScore}</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-zinc-500 text-center py-4">
              No test scores recorded yet
            </div>
          )}
          {actScore && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">ACT</span>
                <span className="text-white">{actScore} / 36</span>
              </div>
              <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-500"
                  style={{ width: `${(actScore / 36) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }
);

DashboardTestScores.displayName = "DashboardTestScores";

