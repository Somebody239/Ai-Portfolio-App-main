/**
 * OnboardingStep3 - University target selection step
 * Single responsibility: Allow user to select or create a target university
 */
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { School, Loader2, Plus, Check, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUniversities } from "@/hooks/useUniversities";
import { UniversitiesRepository } from "@/lib/supabase/repositories/universities.repository";
import { InputSanitizer } from "@/lib/security/InputSanitizer";
import type { TargetUniversityInput } from "@/lib/validation/Schemas";

interface OnboardingStep3Props {
  onNext: (data: TargetUniversityInput) => void;
  onBack: () => void;
  isSubmitting: boolean;
  error?: string;
}

interface SelectCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
}

const SelectCard: React.FC<SelectCardProps> = ({
  selected,
  onClick,
  title,
  subtitle,
}) => (
  <div
    onClick={onClick}
    className={cn(
      "cursor-pointer relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
      selected
        ? "bg-zinc-100 border-zinc-100"
        : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900"
    )}
  >
    <div>
      <h4 className={cn("font-semibold text-sm", selected ? "text-black" : "text-white")}>
        {title}
      </h4>
      <p className={cn("text-xs", selected ? "text-zinc-600" : "text-zinc-500")}>
        {subtitle}
      </p>
    </div>
    {selected && (
      <div className="h-6 w-6 bg-black rounded-full flex items-center justify-center text-white">
        <Check size={14} strokeWidth={3} />
      </div>
    )}
  </div>
);

export const OnboardingStep3: React.FC<OnboardingStep3Props> = ({
  onNext,
  onBack,
  isSubmitting,
  error: submitError,
}) => {
  const { universities, loading: universitiesLoading } = useUniversities();
  const universitiesRepo = new UniversitiesRepository();
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUniversityName, setNewUniversityName] = useState("");
  const [newUniversityCountry, setNewUniversityCountry] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [allUniversities, setAllUniversities] = useState(universities);

  useEffect(() => {
    if (universities.length > 0) {
      setAllUniversities(universities);
    }
  }, [universities]);

  const filteredUniversities = allUniversities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (uni.country?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const hasNoMatches =
    searchQuery.trim() !== "" &&
    filteredUniversities.length === 0 &&
    !showCreateForm;

  const handleCreateUniversity = async () => {
    // University creation is not supported with the read-only dataset
    // Just show an error message
    setError("Please select from the existing universities. Adding custom universities is not supported.");
    setIsCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length === 0) {
      setError("Please select at least one university to start.");
      return;
    }
    onNext({ dreamUniversities: selected.map(id => id.toString()) });
  };

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium text-white">
            Building your Portfolio...
          </h3>
          <p className="text-sm text-zinc-500">
            Calculating admission probabilities
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center mb-8">
        <div className="w-12 h-12 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center mx-auto mb-4">
          <School className="text-zinc-400" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Target Universities
        </h2>
        <p className="text-zinc-500 text-sm">
          Select your target universities ({selected.length} selected)
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">
          Search Universities
        </label>
        <div className="relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or country..."
            className={cn(
              "flex h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:border-transparent transition-all duration-300"
            )}
          />
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {universitiesLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
          </div>
        ) : showCreateForm ? (
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-4">
            <h4 className="text-sm font-semibold text-white">Add New University</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  University Name
                </label>
                <input
                  type="text"
                  value={newUniversityName}
                  onChange={(e) => setNewUniversityName(e.target.value)}
                  placeholder="e.g. Harvard University"
                  className={cn(
                    "flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:border-transparent transition-all duration-300"
                  )}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Country
                </label>
                <input
                  type="text"
                  value={newUniversityCountry}
                  onChange={(e) => setNewUniversityCountry(e.target.value)}
                  placeholder="e.g. United States"
                  className={cn(
                    "flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:border-transparent transition-all duration-300"
                  )}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCreateUniversity}
                  disabled={isCreating}
                  className="flex-1 h-10 bg-white text-black rounded-lg font-semibold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Add University
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewUniversityName("");
                    setNewUniversityCountry("");
                    setError("");
                  }}
                  className="h-10 px-4 border border-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-900 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : filteredUniversities.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <p className="text-zinc-500 text-sm">
              {searchQuery
                ? "No universities found matching your search."
                : "No universities available"}
            </p>
            {hasNoMatches && (
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(true);
                  setNewUniversityName(searchQuery);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors text-sm"
              >
                <Plus size={16} />
                Add &quot;{searchQuery}&quot; as new university
              </button>
            )}
          </div>
        ) : (
          <>
            {filteredUniversities.map((uni) => (
              <SelectCard
                key={uni.id}
                title={uni.name}
                subtitle={uni.country || "Unknown"}
                selected={selected.includes(uni.id)}
                onClick={() => {
                  setSelected(prev =>
                    prev.includes(uni.id)
                      ? prev.filter(id => id !== uni.id)
                      : [...prev, uni.id]
                  );
                  setError("");
                }}
              />
            ))}
            {hasNoMatches && (
              <div className="pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(true);
                    setNewUniversityName(searchQuery);
                  }}
                  className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900 hover:border-zinc-600 transition-all flex items-center justify-center gap-2 text-zinc-300 hover:text-white"
                >
                  <Plus size={16} />
                  <span className="text-sm font-medium">
                    Add &quot;{searchQuery}&quot; as new university
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {error && <p className="text-xs text-red-400 text-center">{error}</p>}
      {submitError && (
        <p className="text-xs text-red-400 text-center">{submitError}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="h-12 w-12 flex items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-900 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 group relative flex items-center justify-center gap-2 h-12 bg-white text-black rounded-xl font-semibold text-sm hover:bg-zinc-200 transition-colors"
        >
          Finish Setup
          <Check size={16} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

