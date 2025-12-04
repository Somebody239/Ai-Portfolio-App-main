'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { CourseGradeHistory } from '@/lib/types';

interface GradeHistoryChartProps {
    history: CourseGradeHistory[];
}

export function GradeHistoryChart({ history }: GradeHistoryChartProps) {
    if (history.length < 2) {
        return (
            <div className="flex items-center justify-center h-[200px] text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                Not enough data for graph
            </div>
        );
    }

    // Sort by date ascending for the chart
    const data = [...history]
        .sort((a, b) => new Date(a.grade_date).getTime() - new Date(b.grade_date).getTime())
        .map(h => ({
            date: new Date(h.grade_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            grade: h.calculated_grade
        }));

    return (
        <div className="w-full h-[250px] bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-zinc-400 mb-4">Grade Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis
                        dataKey="date"
                        stroke="#71717a"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        domain={[60, 100]}
                        stroke="#71717a"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#18181b',
                            borderColor: '#27272a',
                            borderRadius: '8px',
                            color: '#e4e4e7'
                        }}
                        itemStyle={{ color: '#60a5fa' }}
                    />
                    <ReferenceLine y={90} stroke="#10b981" strokeDasharray="3 3" opacity={0.3} />
                    <Line
                        type="monotone"
                        dataKey="grade"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#60a5fa' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
