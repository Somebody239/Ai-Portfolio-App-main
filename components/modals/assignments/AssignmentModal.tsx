'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { AssignmentForm } from './AssignmentForm';
import { AssignmentsManager, AssignmentFormData } from '@/managers/AssignmentsManager';
import { Assignment } from '@/lib/types';
import { toast } from '@/lib/utils/toast';

interface AssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    courseId: string;
    userId: string;
    initialData?: Assignment;
    mode: 'create' | 'edit';
}

export function AssignmentModal({
    isOpen,
    onClose,
    onSuccess,
    courseId,
    userId,
    initialData,
    mode,
}: AssignmentModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const manager = new AssignmentsManager();
    const formId = 'assignment-form';

    const handleSubmit = async (data: AssignmentFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            if (mode === 'edit' && initialData) {
                await manager.update(initialData.id, data);
                toast.success('Assignment updated successfully');
            } else {
                await manager.create(courseId, userId, data);
                toast.success('Assignment created successfully');
            }
            onSuccess();
            onClose();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to save assignment';
            setError(message);
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Add Assignment' : 'Edit Assignment'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Add a new assignment to track your progress.'
                            : 'Update the assignment details.'}
                    </DialogDescription>
                </DialogHeader>

                <AssignmentForm
                    formId={formId}
                    initialData={initialData ? {
                        title: initialData.title,
                        description: initialData.description || undefined,
                        assignment_type: initialData.assignment_type,
                        total_points: initialData.total_points,
                        earned_points: initialData.earned_points,
                        weight_percentage: initialData.weight_percentage,
                        due_date: initialData.due_date || null,
                        submitted_date: initialData.submitted_date || null,
                        status: initialData.status,
                        notes: initialData.notes || undefined,
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
                        {mode === 'create' ? 'Add Assignment' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
