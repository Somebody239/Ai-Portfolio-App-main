import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { AssignmentsManager, AssignmentFormData } from "@/managers/AssignmentsManager";
import { AssignmentType, AssignmentStatus } from "@/lib/types";

interface AssignmentFormProps {
    initialData?: Partial<AssignmentFormData>;
    onSubmit: (data: AssignmentFormData) => void | Promise<void>;
    isSubmitting?: boolean;
    formId?: string;
}

export function AssignmentForm({
    initialData,
    onSubmit,
    isSubmitting,
    formId = "assignment-form",
}: AssignmentFormProps) {
    const manager = new AssignmentsManager();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<AssignmentFormData>({
        title: initialData?.title || "",
        description: initialData?.description || "",
        assignment_type: initialData?.assignment_type || AssignmentType.Homework,
        total_points: initialData?.total_points || 100,
        earned_points: initialData?.earned_points ?? null,
        weight_percentage: initialData?.weight_percentage || 10,
        due_date: initialData?.due_date || null,
        submitted_date: initialData?.submitted_date || null,
        status: initialData?.status || AssignmentStatus.Pending,
        notes: initialData?.notes || "",
    });

    const handleChange = (field: keyof AssignmentFormData, value: any) => {
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
                label="Title"
                placeholder="e.g., Chapter 5 Quiz"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                error={errors.title}
                required
                disabled={isSubmitting}
            />

            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Type"
                    options={manager.getTypeOptions()}
                    value={formData.assignment_type}
                    onChange={(e) => handleChange("assignment_type", e.target.value)}
                    required
                    disabled={isSubmitting}
                />

                <Select
                    label="Status"
                    options={manager.getStatusOptions()}
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    required
                    disabled={isSubmitting}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Total Points"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.total_points}
                    onChange={(e) => handleChange("total_points", parseFloat(e.target.value) || 0)}
                    required
                    disabled={isSubmitting}
                />

                <Input
                    label="Earned Points"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.earned_points ?? ""}
                    onChange={(e) =>
                        handleChange("earned_points", e.target.value ? parseFloat(e.target.value) : null)
                    }
                    helperText="Leave empty if not graded"
                    disabled={isSubmitting}
                />
            </div>

            <Input
                label="Weight (%)"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.weight_percentage}
                onChange={(e) => handleChange("weight_percentage", parseFloat(e.target.value) || 0)}
                helperText="Percentage this counts toward final grade"
                required
                disabled={isSubmitting}
            />

            <div className="grid grid-cols-2 gap-4">
                <DatePicker
                    label="Due Date"
                    value={formData.due_date}
                    onChange={(value) => handleChange("due_date", value ? value.toISOString().split('T')[0] : null)}
                    disabled={isSubmitting}
                />

                <DatePicker
                    label="Submitted Date"
                    value={formData.submitted_date}
                    onChange={(value) => handleChange("submitted_date", value ? value.toISOString().split('T')[0] : null)}
                    disabled={isSubmitting}
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">
                    Description/Notes
                </label>
                <textarea
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Any additional notes..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    disabled={isSubmitting}
                />
            </div>

            {errors.general && <p className="text-sm text-rose-400">{errors.general}</p>}
        </form>
    );
}
