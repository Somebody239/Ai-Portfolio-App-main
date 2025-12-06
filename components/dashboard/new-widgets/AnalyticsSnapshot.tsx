import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { usePortfolio } from '@/hooks/usePortfolio';
import { BarChart3 } from 'lucide-react';

export const AnalyticsSnapshot: React.FC = () => {
    const { courses, scores, essays } = usePortfolio();

    // Calculate real data from actual database
    const coursesCount = courses?.length || 0;
    const scoresCount = scores?.length || 0;
    const essaysCount = essays?.length || 0;
    const totalData = coursesCount + scoresCount + essaysCount;

    // Set realistic targets
    const coursesTarget = 24; // 6 per year average
    const scoresTarget = 3; // SAT, ACT, and AP tests
    const essaysTarget = 8; // Common App + supplements

    const data = [
        { name: 'Courses', value: coursesCount, total: coursesTarget, label: `${coursesCount}/${coursesTarget}` },
        { name: 'Tests', value: scoresCount, total: scoresTarget, label: `${scoresCount}/${scoresTarget}` },
        { name: 'Essays', value: essaysCount, total: essaysTarget, label: `${essaysCount}/${essaysTarget}` },
    ];

    // Empty state when no data
    if (totalData === 0) {
        return (
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm h-full flex flex-col">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white">Analytics</h3>
                    <p className="text-xs text-zinc-500">Progress snapshot</p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-3">
                        <BarChart3 className="w-6 h-6 text-zinc-600" />
                    </div>
                    <p className="text-sm text-zinc-400 font-medium">No data yet</p>
                    <p className="text-xs text-zinc-600 mt-1">
                        Add courses, test scores, or essays to see your progress
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm h-full flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">Analytics</h3>
                <p className="text-xs text-zinc-500">Progress snapshot</p>
            </div>

            <div className="flex-1 min-h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 0, right: 30 }}>
                        <XAxis type="number" hide domain={[0, 'dataMax']} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            width={60}
                            tick={{ fill: '#a1a1aa', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="total" barSize={8} fill="#27272a" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="value" barSize={8} radius={[0, 4, 4, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#3B82F6' : index === 1 ? '#10B981' : '#FF6B35'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                {data.map((item) => (
                    <div key={item.name}>
                        <p className="text-sm font-bold text-white">{item.label}</p>
                        <p className="text-[10px] text-zinc-500 uppercase">{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

