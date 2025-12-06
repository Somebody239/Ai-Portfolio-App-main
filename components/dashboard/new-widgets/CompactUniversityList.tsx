import React, { useState } from 'react';
import { University } from '@/lib/types';
import { ExternalLink, Edit2, FileText, Trash2, Search, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InlineUniversitySearch } from './InlineUniversitySearch';
import { ExpandableCard } from '@/components/common/ExpandableCard';

interface CompactUniversityListProps {
    universities: Array<University & { risk: "Safety" | "Target" | "Reach" | "High Reach" }>;
    onSelect: (uni: University) => void;
    onRemove: (id: number) => void;
    onAdd?: () => void; // Deprecated
    onAddUniversity?: (uni: University) => void;
    onEditRisk?: (uni: University) => void;
}

export const CompactUniversityList: React.FC<CompactUniversityListProps> = ({
    universities,
    onSelect,
    onRemove,
    onAdd,
    onAddUniversity,
    onEditRisk
}) => {
    const [isAdding, setIsAdding] = useState(false);

    // Map risk level to badge style
    const getRiskBadge = (risk: "Safety" | "Target" | "Reach" | "High Reach") => {
        switch (risk) {
            case 'Safety':
                return { label: 'Safety', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
            case 'Target':
                return { label: 'Target', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' };
            case 'Reach':
                return { label: 'Reach', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
            case 'High Reach':
                return { label: 'High Reach', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold' };
            default:
                return { label: 'Unknown', color: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
        }
    };

    const handleUniversitySelect = (uni: University) => {
        if (onAddUniversity) {
            onAddUniversity(uni);
            setIsAdding(false);
        }
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm h-full flex flex-col relative overflow-hidden">
            <AnimatePresence mode="wait">
                {isAdding ? (
                    <motion.div
                        key="search"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 flex flex-col"
                    >
                        <InlineUniversitySearch
                            onSelect={handleUniversitySelect}
                            onCancel={() => setIsAdding(false)}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col min-h-0"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Application Targets</h3>
                                <p className="text-xs text-zinc-500">Your university list</p>
                            </div>
                        </div>

                        {/* Search Trigger */}
                        <button
                            onClick={() => setIsAdding(true)}
                            className="w-full flex items-center gap-2 p-3 mb-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50 text-zinc-400 hover:text-white hover:border-emerald-500/30 transition-all group"
                        >
                            <div className="p-1.5 rounded-lg bg-zinc-800/50 group-hover:bg-zinc-700/50 transition-colors">
                                <Plus size={14} />
                            </div>
                            <span className="text-sm font-medium">Add University...</span>
                        </button>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {universities.length === 0 ? (
                                <div className="text-center py-8 text-zinc-500 text-sm">
                                    No universities added yet.
                                </div>
                            ) : (
                                universities.map((uni) => {
                                    const badge = getRiskBadge(uni.risk);
                                    return (
                                        <motion.div
                                            layout
                                            key={uni.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="group p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50 hover:border-emerald-500/30 transition-all flex items-center justify-between"
                                        >
                                            <div className="flex-1 min-w-0 mr-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-sm font-medium text-white truncate max-w-[180px]">{uni.name}</h4>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${badge.color}`}>
                                                        {badge.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-zinc-500">
                                                    <span className="truncate">{uni.city}, {uni.state}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ActionButton icon={<Edit2 size={12} />} onClick={() => onSelect(uni)} tooltip="Edit" />
                                                {uni.website && (
                                                    <ActionButton
                                                        icon={<ExternalLink size={12} />}
                                                        onClick={() => window.open(uni.website!, '_blank')}
                                                        tooltip="Website"
                                                        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                                                    />
                                                )}
                                                <ActionButton
                                                    icon={<Trash2 size={12} />}
                                                    onClick={() => onRemove(uni.id)}
                                                    tooltip="Remove"
                                                    className="text-zinc-500 hover:text-zinc-400 hover:bg-zinc-800"
                                                />
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ActionButton = ({ icon, onClick, tooltip, className }: { icon: React.ReactNode; onClick: () => void; tooltip: string; className?: string }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={`p-1.5 rounded-lg transition-colors relative ${className || 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
        title={tooltip}
    >
        {icon}
    </button>
);
