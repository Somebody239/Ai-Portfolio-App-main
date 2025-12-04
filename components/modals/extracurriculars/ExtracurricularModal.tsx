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
import { ExtracurricularForm } from "./ExtracurricularForm";
import { ExtracurricularsManager, ExtracurricularFormData } from "@/managers/ExtracurricularsManager";
import { Extracurricular } from "@/lib/types";

interface ExtracurricularModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (extracurricular: Extracurricular) => void;
  userId: string;
  initialData?: Extracurricular;
  mode?: "create" | "edit";
}

export function ExtracurricularModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  initialData,
  mode = "create",
}: ExtracurricularModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const manager = new ExtracurricularsManager();
  const formId = "extracurricular-form";

  const handleSubmit = async (data: ExtracurricularFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let result: Extracurricular;

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
            {mode === "edit" ? "Edit Activity" : "Add Activity"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update your extracurricular activity details."
              : "Add a new extracurricular activity to your portfolio."}
          </DialogDescription>
        </DialogHeader>

        <ExtracurricularForm
          formId={formId}
          initialData={initialData ? {
            title: initialData.title,
            description: initialData.description || "",
            level: initialData.level,
            hours_per_week: initialData.hours_per_week,
            years_participated: initialData.years_participated
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
            {mode === "edit" ? "Save Changes" : "Add Activity"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
