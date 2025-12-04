"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { TestScoresManager, TestScoreFormData } from "@/managers/TestScoresManager";
import { TestType } from "@/lib/types";

interface TestScoreFormProps {
  initialData?: Partial<TestScoreFormData>;
  onSubmit: (data: TestScoreFormData) => void | Promise<void>;
  isSubmitting?: boolean;
  formId?: string;
}

export function TestScoreForm({ initialData, onSubmit, isSubmitting, formId = "test-score-form" }: TestScoreFormProps) {
  const manager = new TestScoresManager();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<TestScoreFormData>({
    test_type: initialData?.test_type || TestType.SAT,
    score: initialData?.score || 0,
    date_taken: initialData?.date_taken || "",
  });

  const [dateTaken, setDateTaken] = useState<Date | null>(
    initialData?.date_taken ? new Date(initialData.date_taken) : null
  );

  const scoreRange = manager.getScoreRange(formData.test_type);

  const handleChange = (field: keyof TestScoreFormData, value: string | number | TestType) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleTestTypeChange = (value: string) => {
    const testType = value as TestType;
    setFormData((prev) => ({ ...prev, test_type: testType, score: 0 }));
  };

  const handleDateChange = (date: Date | null) => {
    setDateTaken(date);
    setFormData((prev) => ({
      ...prev,
      date_taken: date ? date.toISOString().split('T')[0] : ""
    }));
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
      <Select
        label="Test Type"
        options={manager.getTestTypeOptions()}
        value={formData.test_type}
        onChange={(e) => handleTestTypeChange(e.target.value)}
        error={errors.test_type}
        required
        disabled={isSubmitting}
      />

      <Input
        label="Score"
        type="number"
        min={scoreRange.min}
        max={scoreRange.max}
        placeholder={`${scoreRange.min}-${scoreRange.max}`}
        value={formData.score}
        onChange={(e) => handleChange("score", parseFloat(e.target.value) || 0)}
        error={errors.score}
        helperText={`Valid range: ${scoreRange.min} - ${scoreRange.max}`}
        required
        disabled={isSubmitting}
      />

      {/* Date Taken */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Date Taken (Optional)
        </label>
        <DatePicker
          value={dateTaken}
          onChange={handleDateChange}
          placeholder="Select test date"
          disabled={isSubmitting}
        />
        {errors.date_taken && (
          <p className="text-sm text-rose-400 mt-1">{errors.date_taken}</p>
        )}
      </div>

      {errors.general && (
        <p className="text-sm text-rose-400">{errors.general}</p>
      )}
    </form>
  );
}
