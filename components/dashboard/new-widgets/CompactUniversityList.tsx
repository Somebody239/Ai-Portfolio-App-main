import React from 'react';
import { University } from '@/lib/types';
import { ExternalLink, Edit2, FileText } from 'lucide-react';

interface CompactUniversityListProps {
    universities: Array<University & { risk: "Safety" | "Target" | "Reach" | "High Reach" }>;
    onSelect: (uni: University) => void;
    onRemove: (id: number) => void;
}

export const CompactUniversityList: React.FC<CompactUniversityListProps> = ({
    universities,
    onSelect,
    onRemove
}) => {
    // Map risk level to badge style
    const getRiskBadge = (risk: "Safety" | "Target" | "Reach" | "High Reach") => {
        switch (risk) {
            case 'Safety':
                return { label: 'Safety', color: 'bg-emerald-500/10 text-emerald-400' };
            case 'Target':
                return { label: 'Target', color: 'bg-blue-500/10 text-blue-400' };
            case 'Reach':
                return { label: 'Reach', color: 'bg-amber-500/10 text-amber-400' };
            case 'High Reach':
                return { label: 'High Reach', color: 'bg-[#FF6B35]/10 text-[#FF6B35]' };
            default:
                return { label: 'Unknown', color: 'bg-zinc-800 text-zinc-400' };
        }
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white">Application Targets</h3>
                    <p className="text-xs text-zinc-500">Your university list</p>
                </div>
                <button className="text-xs text-[#FF6B35] hover:text-[#FF8F6B] font-medium transition-colors">
                    View All
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {universities.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500 text-sm">
                        No universities added yet.
                    </div>
                ) : (
                    universities.map((uni) => {
                        const badge = getRiskBadge(uni.risk);
                        return (
                            <div
                                key={uni.id}
                                className="group p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between"
                            >
                                <div className="flex-1 min-w-0 mr-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-medium text-white truncate max-w-[180px]">{uni.name}</h4>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${badge.color}`}>
                                            {badge.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                                        <span className="truncate">{uni.city}, {uni.state}</span>
                                        <span>•</span>
                                        <span className="whitespace-nowrap">Deadline: Jan 1</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ActionButton icon={<Edit2 size={12} />} onClick={() => onSelect(uni)} tooltip="Edit" />
                                    <ActionButton icon={<FileText size={12} />} onClick={() => { }} tooltip="Requirements" />
                                    <ActionButton icon={<ExternalLink size={12} />} onClick={() => uni.website && window.open(uni.website, '_blank')} tooltip="Website" />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

const ActionButton = ({ icon, onClick, tooltip }: { icon: React.ReactNode; onClick: () => void; tooltip: string }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors relative group/btn"
        title={tooltip}
    >
        {icon}
    </button>
);
