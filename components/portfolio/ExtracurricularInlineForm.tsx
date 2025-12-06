"use client";

import React, { useState } from 'react';
import { Save, X, Loader2 } from 'lucide-react';
import { Extracurricular } from '@/lib/types';
import { useUser } from '@/hooks/useUser';

// Explicit definition to match Manager expectations and avoid null vs undefined issues
export interface ExtracurricularFormData {
    name: string;
    title: string;
    description?: string;
    level: string;
    hours_per_week: number;
    years_participated: number;
}

interface ExtracurricularInlineFormProps {
    initialData?: Extracurricular;
    onSave: (data: ExtracurricularFormData) => Promise<void>;
    onCancel: () => void;
}

export const ExtracurricularInlineForm: React.FC<ExtracurricularInlineFormProps> = ({
    initialData,
    onSave,
    onCancel
}) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [level, setLevel] = useState(initialData?.level || 'School');
    const [hours, setHours] = useState(initialData?.hours_per_week?.toString() || '');
    const [years, setYears] = useState(initialData?.years_participated?.toString() || '');
    const [isSaving, setIsSaving] = useState(false);

    const levels = ['School', 'Community', 'State', 'National', 'International'];

    const handleSaveInternal = async () => {
        if (!title || !name || !hours || !years) return;
        setIsSaving(true);
        try {
            await onSave({
                name,
                title,
                description: description || undefined, // Ensure undefined if empty/falsy to match type
                level,
                hours_per_week: parseInt(hours),
                years_participated: parseInt(years)
            });
        } catch (e) { console.error(e); }
        finally { setIsSaving(false); }
    }

    return (
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Activity Name (e.g. Debate Club)"
                    className="bg-zinc-900/50 border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none w-full"
                    autoFocus
                />
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Role/Position (e.g. Member)"
                    className="bg-zinc-900/50 border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none w-full"
                />
            </div>

            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description of your involvement..."
                className="w-full bg-zinc-900/50 border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none resize-none h-16"
            />

            <div className="flex flex-wrap gap-3">
                <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="bg-zinc-900/50 border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-300 focus:ring-1 focus:ring-emerald-500/50 outline-none"
                >
                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>

                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        placeholder="Hrs/Wk"
                        className="w-20 bg-zinc-900/50 border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none"
                        min="0"
                    />
                    <input
                        type="number"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        placeholder="Yrs"
                        className="w-20 bg-zinc-900/50 border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none"
                        min="0"
                    />
                </div>

                <div className="flex-1 flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        disabled={isSaving}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                    <button
                        onClick={handleSaveInternal}
                        disabled={isSaving || !name || !title}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:to-amber-300 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                    >
                        {isSaving && <Loader2 size={14} className="animate-spin" />}
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
