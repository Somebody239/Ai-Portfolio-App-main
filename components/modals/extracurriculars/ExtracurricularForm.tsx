"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ExtracurricularsManager, ExtracurricularFormData } from "@/managers/ExtracurricularsManager";

interface ExtracurricularFormProps {
  initialData?: Partial<ExtracurricularFormData>;
  onSubmit: (data: ExtracurricularFormData) => void | Promise<void>;
  isSubmitting?: boolean;
  formId?: string;
}

export function ExtracurricularForm({ initialData, onSubmit, isSubmitting, formId = "extracurricular-form" }: ExtracurricularFormProps) {
  const manager = new ExtracurricularsManager();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ExtracurricularFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    level: initialData?.level || "School",
    hours_per_week: initialData?.hours_per_week || 0,
    years_participated: initialData?.years_participated || 0,
  });

  const handleChange = (field: keyof ExtracurricularFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await onSubmit(formData);
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      }
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Activity Title"
        placeholder="e.g., Debate Team Captain"
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        error={errors.title}
        required
        disabled={isSubmitting}
      />

      <Textarea
        label="Description"
        placeholder="Describe your role and impact..."
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
        rows={3}
        disabled={isSubmitting}
      />

      <Select
        label="Level"
        options={manager.getLevelOptions()}
        value={formData.level}
        onChange={(e) => handleChange("level", e.target.value)}
        error={errors.level}
        required
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Hours Per Week"
          type="number"
          min="0"
          max="168"
          step="0.5"
          placeholder="10"
          value={formData.hours_per_week}
          onChange={(e) => handleChange("hours_per_week", parseFloat(e.target.value) || 0)}
          error={errors.hours_per_week}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Years Participated"
          type="number"
          min="0"
          max="20"
          step="0.5"
          placeholder="2"
          value={formData.years_participated}
          onChange={(e) => handleChange("years_participated", parseFloat(e.target.value) || 0)}
          error={errors.years_participated}
          required
          disabled={isSubmitting}
        />
      </div>

      {errors.general && (
        <p className="text-sm text-rose-400">{errors.general}</p>
      )}
    </form>
  );
}
