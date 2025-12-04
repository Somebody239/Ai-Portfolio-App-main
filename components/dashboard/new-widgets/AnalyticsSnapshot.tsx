import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const AnalyticsSnapshot: React.FC = () => {
    const data = [
        { name: 'Apps', value: 8, total: 12, label: '8/12' },
        { name: 'Scholars', value: 5, total: 15, label: '5/15' },
        { name: 'Essays', value: 3, total: 8, label: '3/8' },
    ];

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
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#FF6B35' : index === 1 ? '#3B82F6' : '#10B981'} />
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
