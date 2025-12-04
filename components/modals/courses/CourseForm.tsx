import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CoursesManager, CourseFormData } from "@/managers/CoursesManager";
import { CourseTerm, CourseLevel } from "@/lib/types";

interface CourseFormProps {
  initialData?: Partial<CourseFormData>;
  onSubmit: (data: CourseFormData) => void | Promise<void>;
  isSubmitting?: boolean;
  formId?: string;
}

export function CourseForm({ initialData, onSubmit, isSubmitting, formId = "course-form" }: CourseFormProps) {
  const manager = new CoursesManager();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState<CourseFormData>({
    name: initialData?.name || "",
    year: initialData?.year || currentYear,
    semester: initialData?.semester || CourseTerm.Fall,
    level: initialData?.level || CourseLevel.Regular,
  });

  const handleChange = (field: keyof CourseFormData, value: string | number | CourseTerm | CourseLevel) => {
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
        label="Course Name"
        placeholder="e.g., AP Calculus BC"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        error={errors.name}
        required
        disabled={isSubmitting}
      />

      <Select
        label="Course Level"
        options={Object.values(CourseLevel).map(level => ({ value: level, label: level }))}
        value={formData.level}
        onChange={(e) => handleChange("level", e.target.value as CourseLevel)}
        error={errors.level}
        required
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Year"
          options={manager.getYearOptions()}
          value={formData.year.toString()}
          onChange={(e) => handleChange("year", parseInt(e.target.value))}
          error={errors.year}
          required
          disabled={isSubmitting}
        />

        <Select
          label="Semester"
          options={manager.getSemesterOptions()}
          value={formData.semester}
          onChange={(e) => handleChange("semester", e.target.value as CourseTerm)}
          error={errors.semester}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-300">
          💡 Grades will be tracked through assignments once the course is created.
        </p>
      </div>

      {errors.general && (
        <p className="text-sm text-rose-400">{errors.general}</p>
      )}
    </form>
  );
}
