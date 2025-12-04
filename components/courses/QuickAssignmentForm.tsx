'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { AssignmentType } from '@/lib/types';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface QuickAssignmentFormProps {
    onSubmit: (data: { title: string; grade: number; type: AssignmentType }) => Promise<void>;
    isSubmitting?: boolean;
}

export function QuickAssignmentForm({ onSubmit, isSubmitting = false }: QuickAssignmentFormProps) {
    const [title, setTitle] = useState('');
    const [grade, setGrade] = useState('');
    const [type, setType] = useState<AssignmentType>(AssignmentType.Test);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Please enter an assignment name");
            return;
        }

        const gradeNum = parseFloat(grade);
        if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
            toast.error("Please enter a valid grade (0-100)");
            return;
        }

        await onSubmit({
            title,
            grade: gradeNum,
            type
        });

        // Reset form
        setTitle('');
        setGrade('');
        setType(AssignmentType.Test);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
            <div className="flex-1 w-full">
                <Input
                    label="Assignment Name"
                    placeholder="e.g. Unit 3 Test"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isSubmitting}
                    required
                />
            </div>

            <div className="w-full md:w-32">
                <Input
                    label="Grade (%)"
                    placeholder="95"
                    type="number"
                    min="0"
                    max="100"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    disabled={isSubmitting}
                    required
                />
            </div>

            <div className="w-full md:w-40">
                <Select
                    label="Type"
                    options={[
                        { value: AssignmentType.Test, label: "Test" },
                        { value: AssignmentType.Quiz, label: "Quiz" },
                        { value: AssignmentType.Homework, label: "Homework" },
                        { value: AssignmentType.Project, label: "Project" },
                        { value: AssignmentType.FinalExam, label: "Final" },
                    ]}
                    value={type}
                    onChange={(e) => setType(e.target.value as AssignmentType)}
                    disabled={isSubmitting}
                />
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto mb-[2px]"
            >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Add
            </Button>
        </form>
    );
}
