"use client";

import React, { useState } from 'react';
import { Save, X, Loader2 } from 'lucide-react';
import { DatePicker } from '@/components/ui/DatePicker';
import { StandardizedScore, TestType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TestScoreInlineFormProps {
    initialData?: StandardizedScore;
    testType?: TestType; // For creating new score of specific type
    onSave: (data: any) => Promise<void>;
    onCancel: () => void;
}

export const TestScoreInlineForm: React.FC<TestScoreInlineFormProps> = ({
    initialData,
    testType,
    onSave,
    onCancel
}) => {
    const [score, setScore] = useState(initialData?.score?.toString() || '');
    const [date, setDate] = useState(initialData?.date_taken ? new Date(initialData.date_taken).toISOString().split('T')[0] : '');
    const [type, setType] = useState<TestType>(initialData?.test_type || testType || TestType.SAT);
    const [isSaving, setIsSaving] = useState(false);

    // TODO: Handle section scores if needed, for now sticking to main score to match "inline" simplicity
    // or we can add expander for sections.

    const handleSaveInternal = async () => {
        if (!score || !type) return;
        setIsSaving(true);
        try {
            await onSave({
                test_type: type,
                score: parseInt(score),
                date_taken: date || undefined
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    }

    const testTypes = Object.values(TestType);

    return (
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-4 space-y-3">
            <div className="flex gap-3">
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TestType)}
                    className="bg-zinc-900/50 border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none w-32"
                    disabled={!!initialData} // Lock type if editing
                >
                    {testTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input
                    type="number"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="Score"
                    className="bg-zinc-900/50 border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none w-24"
                    autoFocus
                />
                <div className="w-40">
                    <DatePicker
                        value={date}
                        onChange={(d) => setDate(d ? d.toISOString().split('T')[0] : '')}
                        placeholder="Date Taken"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <button
                    onClick={onCancel}
                    disabled={isSaving}
                    className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>
                <button
                    onClick={handleSaveInternal}
                    disabled={isSaving || !score}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:to-amber-300 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                >
                    {isSaving && <Loader2 size={14} className="animate-spin" />}
                    Save
                </button>
            </div>
        </div>
    );
};
