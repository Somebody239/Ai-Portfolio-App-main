"use client";

import React, { useState, useMemo } from "react";
import { StandardizedScore } from "@/lib/types";
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ScoreProgressBar } from "./ScoreProgressBar";

import { TestScoreInlineForm } from "./TestScoreInlineForm";
import { AnimatePresence, motion } from "framer-motion";

interface TestScoresSectionProps {
  scores: StandardizedScore[];
  onAdd: () => void;
  onEdit: (score: StandardizedScore) => void;
  onUpdate?: (id: string, data: Partial<StandardizedScore>) => Promise<void>;
  onCreate?: (data: any) => Promise<void>;
  onDelete: (id: string) => void;
}

export function TestScoresSection({
  scores,
  onAdd,
  onEdit,
  onUpdate,
  onCreate,
  onDelete,
}: TestScoresSectionProps) {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(['SAT', 'ACT']));
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Handlers for inline update
  // We need to know which score is being edited.
  // The logic might need to be slightly different than the card if we iterate over specific scores.
  // The Card logic was singular SAT/ACT. Here we have a list. 
  // We can make each score row editable.

  // Group scores by test type
  const groupedScores = useMemo(() => {
    const groups = new Map<string, StandardizedScore[]>();
    scores.forEach(score => {
      if (!groups.has(score.test_type)) {
        groups.set(score.test_type, []);
      }
      groups.get(score.test_type)?.push(score);
    });
    return groups;
  }, [scores]);

  const toggleExpanded = (type: string) => {
    setExpandedTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  const getMaxScore = (testType: string): number => {
    const maxScores: Record<string, number> = {
      'SAT': 1600,
      'ACT': 36,
      'TOEFL': 120,
      'IELTS': 9,
      'AP': 5,
      'IB': 7,
    };
    return maxScores[testType] || 100;
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Standardized Tests</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Track your standardized test performance
          </p>
        </div>
        <Button onClick={() => onCreate ? setIsAdding(true) : onAdd()} variant="secondary" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Score
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && onCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          >
            <TestScoreInlineForm
              onSave={async (data) => {
                await onCreate(data);
                setIsAdding(false);
              }}
              onCancel={() => setIsAdding(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {scores.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
          <p className="text-zinc-500 mb-4">No test scores yet</p>
          <Button onClick={onAdd} variant="secondary" size="sm">
            Add Your First Score
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from(groupedScores.entries()).map(([testType, testScores]) => {
            const isExpanded = expandedTypes.has(testType);
            const latestScore = testScores[testScores.length - 1];
            const maxScore = getMaxScore(testType);

            return (
              <div
                key={testType}
                className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm overflow-hidden"
              >
                {/* Header */}
                <button
                  onClick={() => toggleExpanded(testType)}
                  className="w-full p-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <h3 className="font-semibold text-white">{testType}</h3>
                      <p className="text-xs text-zinc-500">
                        {testScores.length} score{testScores.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-white">{latestScore.score}</div>
                      <div className="text-xs text-zinc-500">Latest</div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4 border-t border-zinc-800/50">
                    {testScores.map((score) => (
                      <div key={score.id}>
                        {editingScoreId === score.id && onUpdate ? (
                          <TestScoreInlineForm
                            initialData={score}
                            onSave={async (data) => {
                              await onUpdate(score.id, data);
                              setEditingScoreId(null);
                            }}
                            onCancel={() => setEditingScoreId(null)}
                          />
                        ) : (
                          <div
                            className="pt-4 space-y-3 group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-zinc-400">
                                {score.date_taken
                                  ? new Date(score.date_taken).toLocaleDateString()
                                  : 'Date not specified'}
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button
                                  onClick={() => {
                                    if (onUpdate) setEditingScoreId(score.id);
                                    else onEdit(score);
                                  }}
                                  className="p-1.5 hover:bg-zinc-800/50 rounded-lg text-zinc-400 hover:text-emerald-400 transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDelete(score.id)}
                                  className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Overall Score */}
                            <div className="flex items-center gap-4">
                              <ScoreProgressBar
                                score={score.score}
                                maxScore={maxScore}
                                label="Overall Score"
                              />
                            </div>

                            {/* Section Scores */}
                            {score.section_scores && Object.keys(score.section_scores).length > 0 && (
                              <div className="pl-4 space-y-2 border-l-2 border-zinc-800">
                                {Object.entries(score.section_scores).map(([section, sectionScore]) => (
                                  <ScoreProgressBar
                                    key={section}
                                    score={sectionScore as number}
                                    maxScore={testType === 'SAT' ? 800 : maxScore}
                                    label={section}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
