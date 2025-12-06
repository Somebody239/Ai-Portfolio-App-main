"use client";

import React, { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { ApplicationEssay } from '@/lib/types';

interface EssayInlineFormProps {
    initialData?: ApplicationEssay;
    onSave: (data: Partial<ApplicationEssay>) => Promise<void>;
    onCancel: () => void;
}

export const EssayInlineForm: React.FC<EssayInlineFormProps> = ({
    initialData,
    onSave,
    onCancel
}) => {
    const [questionSource, setQuestionSource] = useState(initialData?.question_source || 'Common App');
    const [questionText, setQuestionText] = useState(initialData?.question_text || '');
    const [wordLimit, setWordLimit] = useState(initialData?.word_limit?.toString() || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!questionText) return;
        setLoading(true);
        try {
            await onSave({
                question_source: questionSource,
                question_text: questionText,
                word_limit: wordLimit ? parseInt(wordLimit) : undefined
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-4 space-y-4">
            <div className="flex gap-4">
                <select
                    value={questionSource}
                    onChange={(e) => setQuestionSource(e.target.value)}
                    className="bg-zinc-900/50 border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none min-w-[140px]"
                >
                    <option value="Common App">Common App</option>
                    <option value="Supplemental">Supplemental</option>
                    <option value="Coalition">Coalition</option>
                    <option value="UC PIQ">UC PIQ</option>
                    <option value="Custom">Custom</option>
                </select>
                <input
                    placeholder="Word Limit (optional)"
                    type="number"
                    value={wordLimit}
                    onChange={(e) => setWordLimit(e.target.value)}
                    className="bg-zinc-900/50 border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none w-32"
                />
            </div>

            <textarea
                placeholder="Paste the essay question or prompt here..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full bg-zinc-900/50 border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none min-h-[80px]"
                autoFocus
            />

            <div className="flex justify-end gap-2">
                <button
                    onClick={onCancel}
                    disabled={loading}
                    className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={loading || !questionText}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:to-amber-300 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    Save Question
                </button>
            </div>
        </div>
    );
};
