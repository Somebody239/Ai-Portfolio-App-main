import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ActivitiesDonutChartProps {
    activityHours: {
        total: number;
        leadership: number;
        service: number;
        other: number;
    };
}

export const ActivitiesDonutChart: React.FC<ActivitiesDonutChartProps> = ({
    activityHours
}) => {
    const data = [
        { name: 'Leadership', value: activityHours.leadership, color: '#fcd34d' }, // Amber 300
        { name: 'Service', value: activityHours.service, color: '#10B981' }, // Emerald
        { name: 'Other', value: activityHours.other, color: '#059669' }, // Emerald-600
    ].filter(d => d.value > 0);

    // Fallback if no data
    const chartData = data.length > 0 ? data : [{ name: 'None', value: 1, color: '#27272a' }];

    return (
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="text-lg font-semibold text-white">Activities</h3>
                    <p className="text-xs text-zinc-500">Weekly hours breakdown</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-white">{activityHours.total}</p>
                    <p className="text-xs text-zinc-500">hrs/week</p>
                </div>
            </div>

            <div className="flex-1 min-h-[160px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={4}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => [`${value} hrs`, '']}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <span className="text-xs text-zinc-500 font-medium">FOCUS</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-2">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-zinc-400">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
