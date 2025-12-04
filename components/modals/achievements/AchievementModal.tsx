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
import { AchievementForm } from "./AchievementForm";
import { AchievementsManager, AchievementFormData } from "@/managers/AchievementsManager";
import { Achievement } from "@/lib/types";

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (achievement: Achievement) => void;
  userId: string;
  initialData?: Achievement;
  mode?: "create" | "edit";
}

export function AchievementModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  initialData,
  mode = "create",
}: AchievementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const manager = new AchievementsManager();
  const formId = "achievement-form";

  const handleSubmit = async (data: AchievementFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let result: Achievement;

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
            {mode === "edit" ? "Edit Award" : "Add Award"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update your achievement details."
              : "Add a new award or achievement to your portfolio."}
          </DialogDescription>
        </DialogHeader>

        <AchievementForm
          formId={formId}
          initialData={initialData ? {
            title: initialData.title,
            description: initialData.description || "",
            category: initialData.category || "Academic",
            awarded_by: initialData.awarded_by || "",
            date_awarded: initialData.date_awarded || ""
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
            {mode === "edit" ? "Save Changes" : "Add Award"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
