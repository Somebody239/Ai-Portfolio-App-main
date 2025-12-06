"use client";

import React, { useState } from 'react';
import { Save, X, Loader2 } from 'lucide-react';
import { DatePicker } from '@/components/ui/DatePicker';
import { Achievement } from '@/lib/types';

interface AchievementInlineFormProps {
    initialData?: Achievement;
    onSave: (data: Partial<Achievement>) => Promise<void>;
    onCancel: () => void;
}

export const AchievementInlineForm: React.FC<AchievementInlineFormProps> = ({
    initialData,
    onSave,
    onCancel
}) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [awardedBy, setAwardedBy] = useState(initialData?.awarded_by || '');
    const [date, setDate] = useState(initialData?.date_awarded ? new Date(initialData.date_awarded).toISOString().split('T')[0] : '');
    const [category, setCategory] = useState(initialData?.category || 'Academic');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!title) return;
        setLoading(true);
        try {
            await onSave({
                title,
                awarded_by: awardedBy,
                date_awarded: date ? new Date(date).toISOString() : undefined,
                category
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    placeholder="Honor Title (e.g. National Merit Scholar)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}

                    className="bg-zinc-900/50 border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none w-full"
                    autoFocus
                />
                <input
                    placeholder="Awarded By (e.g. School, Organization)"
                    value={awardedBy}
                    onChange={(e) => setAwardedBy(e.target.value)}

                    className="bg-zinc-900/50 border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none w-full"
                />
            </div>

            <div className="flex gap-4">
                <div className="w-40">
                    <DatePicker
                        value={date}
                        onChange={(d) => setDate(d ? d.toISOString().split('T')[0] : '')}
                        placeholder="Date Awarded"
                    />
                </div>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}

                    className="bg-zinc-900/50 border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none"
                >
                    <option value="Academic">Academic</option>
                    <option value="Athletic">Athletic</option>
                    <option value="Arts">Arts</option>
                    <option value="Service">Service</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Other">Other</option>
                </select>
            </div>

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
                    disabled={loading || !title}

                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:to-amber-300 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    Save Honor
                </button>
            </div>
        </div>
    );
};
