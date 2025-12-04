'use client';

import React from 'react';
import { Assignment, AssignmentType } from '@/lib/types';
import { Edit2, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AssignmentsManager } from '@/managers/AssignmentsManager';

interface AssignmentCardProps {
    assignment: Assignment;
    onEdit: (assignment: Assignment) => void;
    onDelete: (id: string) => void;
}

export function AssignmentCard({ assignment, onEdit, onDelete }: AssignmentCardProps) {
    const manager = new AssignmentsManager();

    const getStatusColor = () => {
        switch (assignment.status) {
            case 'graded':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            case 'submitted':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
            case 'late':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            case 'missing':
                return 'bg-red-500/10 text-red-400 border-red-500/30';
            default:
                return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30';
        }
    };

    const getStatusIcon = () => {
        switch (assignment.status) {
            case 'graded':
                return <CheckCircle2 className="w-3 h-3" />;
            case 'submitted':
                return <Clock className="w-3 h-3" />;
            case 'late':
            case 'missing':
                return <AlertCircle className="w-3 h-3" />;
            default:
                return <Clock className="w-3 h-3" />;
        }
    };

    const percentage = assignment.earned_points !== null && assignment.earned_points !== undefined
        ? manager.calculatePercentage(assignment.earned_points, assignment.total_points)
        : null;

    const getGradeColor = (pct: number) => {
        if (pct >= 90) return 'text-emerald-400';
        if (pct >= 80) return 'text-blue-400';
        if (pct >= 70) return 'text-amber-400';
        return 'text-red-400';
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="group p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h4 className="text-sm font-medium text-white mb-2 truncate" title={assignment.title}>
                        {assignment.title}
                    </h4>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                        {/* Type Badge */}
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded">
                            {assignment.assignment_type}
                        </span>

                        {/* Status Badge */}
                        <span className={`px-2 py-0.5 border rounded flex items-center gap-1 ${getStatusColor()}`}>
                            {getStatusIcon()}
                            {assignment.status}
                        </span>

                        {/* Weight */}
                        <span className="text-zinc-500">
                            {assignment.weight_percentage}% weight
                        </span>
                    </div>

                    {/* Points/Grade */}
                    <div className="flex items-center gap-3 text-xs">
                        {percentage !== null ? (
                            <>
                                <span className={`font-bold ${getGradeColor(percentage)}`}>
                                    {percentage.toFixed(1)}%
                                </span>
                                <span className="text-zinc-500">
                                    ({assignment.earned_points}/{assignment.total_points} pts)
                                </span>
                            </>
                        ) : (
                            <span className="text-zinc-600">
                                Not graded ({assignment.total_points} pts)
                            </span>
                        )}
                    </div>

                    {/* Due Date */}
                    {assignment.due_date && (
                        <div className="mt-2 text-xs text-zinc-500">
                            Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(assignment)}
                        className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-blue-400 transition-colors"
                        title="Edit assignment"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => onDelete(assignment.id)}
                        className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-red-400 transition-colors"
                        title="Delete assignment"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
