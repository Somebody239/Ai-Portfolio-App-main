import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

const EmptyGPAState: React.FC = () => (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-zinc-600" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No grades added yet</h3>
        <p className="text-sm text-zinc-500 mb-6 max-w-xs">
            Add your courses and grades to see your progress over time
        </p>
        <Link href="/academics">
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors">
                Add Grades
            </button>
        </Link>
    </div>
);

interface GPAProgressChartProps {
    currentGpa: number;
    targetGpa?: number;
    history?: { grade: string; gpa: number }[];
}

export const GPAProgressChart: React.FC<GPAProgressChartProps> = ({
    currentGpa,
    targetGpa = 4.0,
    history = [
        { grade: '9th', gpa: 3.5 },
        { grade: '10th', gpa: 3.65 },
        { grade: '11th', gpa: 3.8 },
        { grade: '12th', gpa: currentGpa || 3.85 }
    ]
}) => {
    // Show empty state if no GPA exists
    if (!currentGpa || currentGpa === 0) {
        return <EmptyGPAState />;
    }

    const progress = (currentGpa / targetGpa) * 100;

    return (
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white">GPA Progress</h3>
                    <p className="text-xs text-zinc-500">Cumulative performance</p>
                </div>
                <button className="text-xs text-[#FF6B35] hover:text-[#FF8F6B] font-medium transition-colors">
                    Update Grades
                </button>
            </div>

            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis
                            dataKey="grade"
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={[3.0, 4.0]}
                            tickFormatter={(value) => value.toFixed(1)}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => [value.toFixed(2), 'GPA']}
                        />
                        <Line
                            type="monotone"
                            dataKey="gpa"
                            stroke="#FF6B35"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#18181b', stroke: '#FF6B35', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#FF6B35' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6">
                <div className="flex justify-between text-xs mb-2">
                    <span className="text-zinc-400">Progress to {targetGpa.toFixed(1)}</span>
                    <span className="text-white font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FF8F6B] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
