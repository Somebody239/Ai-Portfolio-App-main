'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Assignment, AssignmentType } from '@/lib/types';
import { AssignmentCard } from './AssignmentCard';
import { Plus, Filter, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface AssignmentListProps {
    assignments: Assignment[];
    onAdd: () => void;
    onEdit: (assignment: Assignment) => void;
    onDelete: (id: string) => void;
}

export function AssignmentList({ assignments, onAdd, onEdit, onDelete }: AssignmentListProps) {
    const router = useRouter();
    const [filterType, setFilterType] = useState<AssignmentType | 'all'>('all');

    const filteredAssignments = filterType === 'all'
        ? assignments
        : assignments.filter(a => a.assignment_type === filterType);

    // Group by type for better organization
    const assignmentsByType = new Map<AssignmentType, Assignment[]>();
    filteredAssignments.forEach(assignment => {
        if (!assignmentsByType.has(assignment.assignment_type)) {
            assignmentsByType.set(assignment.assignment_type, []);
        }
        assignmentsByType.get(assignment.assignment_type)!.push(assignment);
    });

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Assignments</h3>
                <div className="flex gap-2">
                    <Button onClick={() => router.push('/ai/grade-analyzer')} variant="outline" size="sm" className="text-zinc-400 hover:text-white border-zinc-800 hover:bg-zinc-800">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Analyze Performance
                    </Button>
                    <Button onClick={onAdd} variant="primary" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Assignment
                    </Button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${filterType === 'all'
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                >
                    All ({assignments.length})
                </button>
                {Array.from(new Set(assignments.map(a => a.assignment_type))).map(type => {
                    const count = assignments.filter(a => a.assignment_type === type).length;
                    return (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${filterType === type
                                ? 'bg-zinc-800 text-white'
                                : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {type} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Assignment List */}
            {filteredAssignments.length > 0 ? (
                <div className="space-y-3">
                    <AnimatePresence>
                        {filteredAssignments.map(assignment => (
                            <AssignmentCard
                                key={assignment.id}
                                assignment={assignment}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="py-12 text-center border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                    <p className="text-zinc-500 mb-4">
                        {filterType === 'all'
                            ? 'No assignments yet'
                            : `No ${filterType} assignments`
                        }
                    </p>
                    <Button onClick={onAdd} variant="secondary" size="sm">
                        Add First Assignment
                    </Button>
                </div>
            )}
        </div>
    );
}
