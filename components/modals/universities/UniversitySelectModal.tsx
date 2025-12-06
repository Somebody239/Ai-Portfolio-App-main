"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { UniversitySearchForm } from "./UniversitySearchForm";
import { UniversityTargetsManager } from "@/managers/UniversityTargetsManager";
import { University, UserTarget } from "@/lib/types";

interface UniversitySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (target: UserTarget) => void;
  userId: string;
  excludeUniversityIds?: number[];
}

export function UniversitySelectModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  excludeUniversityIds = [],
}: UniversitySelectModalProps) {
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [reasonForInterest, setReasonForInterest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manager = new UniversityTargetsManager();

  const handleUniversitySelect = (university: University) => {
    setSelectedUniversity(university);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedUniversity) {
      setError("Please select a university");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await manager.create(userId, {
        university_id: selectedUniversity.id,
        reason_for_interest: reasonForInterest || undefined,
      });

      onSuccess(result);
      onClose();
      setSelectedUniversity(null);
      setReasonForInterest("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedUniversity(null);
    setReasonForInterest("");
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] w-full">
        <DialogHeader>
          <DialogTitle>Add Target University</DialogTitle>
          <DialogDescription>
            Select a university to add to your target list.
          </DialogDescription>
        </DialogHeader>

        {!selectedUniversity ? (
          <UniversitySearchForm
            onSelect={handleUniversitySelect}
            excludeIds={excludeUniversityIds}
          />
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-medium text-white">{selectedUniversity.name}</h4>
                  <p className="text-sm text-zinc-400 mt-1">
                    {selectedUniversity.city}, {selectedUniversity.state}
                  </p>
                </div>
                {/* Website Link Section */}
                <div className="flex flex-col items-end gap-2">
                  {selectedUniversity.image_url && (
                    <img src={selectedUniversity.image_url} alt={selectedUniversity.name} className="h-10 w-10 rounded-full object-cover" />
                  )}
                  {selectedUniversity.website && (
                    <a
                      href={selectedUniversity.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
                    >
                      Visit Website ↗
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-zinc-800">
                <div>
                  <p className="text-xs text-zinc-500">Avg GPA</p>
                  <p className="text-sm font-medium text-white">
                    {selectedUniversity.avg_gpa ? selectedUniversity.avg_gpa.toFixed(2) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Acceptance Rate</p>
                  <p className="text-sm font-medium text-white">
                    {selectedUniversity.acceptance_rate
                      ? (selectedUniversity.acceptance_rate > 1
                        ? `${selectedUniversity.acceptance_rate.toFixed(1)}%`
                        : `${(selectedUniversity.acceptance_rate * 100).toFixed(1)}%`)
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Avg SAT</p>
                  <p className="text-sm font-medium text-white">
                    {selectedUniversity.avg_sat || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <Textarea
              label="Why are you interested in this university? (Optional)"
              placeholder="Describe what draws you to this school..."
              value={reasonForInterest}
              onChange={(e) => setReasonForInterest(e.target.value)}
              rows={4}
            />

            <button
              type="button"
              onClick={() => setSelectedUniversity(null)}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              ← Choose a different university
            </button>
          </div>
        )}

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          {selectedUniversity && (
            <Button type="button" onClick={handleSubmit} isLoading={isSubmitting}>
              Add University
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
