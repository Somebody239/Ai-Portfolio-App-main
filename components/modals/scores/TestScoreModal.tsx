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
import { TestScoreForm } from "./TestScoreForm";
import { TestScoresManager, TestScoreFormData } from "@/managers/TestScoresManager";
import { StandardizedScore } from "@/lib/types";

interface TestScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (score: StandardizedScore) => void;
  userId: string;
  initialData?: StandardizedScore;
  mode?: "create" | "edit";
}

export function TestScoreModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  initialData,
  mode = "create",
}: TestScoreModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const manager = new TestScoresManager();
  const formId = "test-score-form";

  const handleSubmit = async (data: TestScoreFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let result: StandardizedScore;

      if (mode === "edit" && initialData) {
        result = await manager.update(initialData.id, data);
      } else {
        result = await manager.create(userId, data);
      }

      onSuccess(result);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Test Score" : "Add Test Score"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update your test score details."
              : "Add a new standardized test score to your portfolio."}
          </DialogDescription>
        </DialogHeader>

        <TestScoreForm
          formId={formId}
          initialData={initialData ? {
            test_type: initialData.test_type,
            score: initialData.score,
            section_scores: initialData.section_scores,
            date_taken: initialData.date_taken || ""
          } : undefined}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={formId}
            isLoading={isSubmitting}
          >
            {mode === "edit" ? "Save Changes" : "Add Score"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
