/**
 * GPASection - GPA stats display component
 * Single responsibility: Display GPA calculations and trends
 */
"use client";

import { Course } from "@/lib/types";
import { GPACalculator } from "@/services/GPACalculator";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GPASectionProps {
    courses: Course[];
    selectedYear?: number;
}

export function GPASection({ courses, selectedYear }: GPASectionProps) {
    // Calculate GPA for display (either selected year or cumulative)
    const displayCourses = selectedYear
        ? courses.filter(c => c.year === selectedYear)
        : courses;

    const weightedGPA = GPACalculator.calculateWeightedGPA(displayCourses);
    const unweightedGPA = GPACalculator.calculateUnweightedGPA(displayCourses);

    // Trend should always be based on ALL courses
    const gpaTrend = GPACalculator.getGPAByYear(courses);

    return (
        <div className="space-y-6">
            {/* GPA Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <div className="text-sm text-zinc-400">Weighted GPA</div>
                    <div className="text-3xl font-bold text-white mt-1">
                        {weightedGPA > 0 ? weightedGPA.toFixed(2) : "—"}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">5.0 Scale</div>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <div className="text-sm text-zinc-400">Unweighted</div>
                    <div className="text-3xl font-bold text-white mt-1">
                        {unweightedGPA > 0 ? unweightedGPA.toFixed(2) : "—"}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">4.0 Scale</div>
                </div>
            </div>

            {/* GPA Trend Chart */}
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <h3 className="text-sm font-medium text-zinc-100 mb-4">GPA Trend</h3>
                {gpaTrend.length > 0 ? (
                    <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={gpaTrend.map(item => ({ year: item.year.toString(), gpa: item.gpa }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                <XAxis
                                    dataKey="year"
                                    stroke="#71717a"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    domain={[0, 5]}
                                    stroke="#71717a"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    ticks={[0, 1, 2, 3, 4, 5]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#18181b',
                                        border: '1px solid #27272a',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                    labelStyle={{ color: '#a1a1aa' }}
                                    formatter={(value: number) => [value.toFixed(2), 'GPA']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="gpa"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={{ fill: '#10b981', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-32 flex items-center justify-center text-xs text-zinc-500">
                        Add courses to see trend
                    </div>
                )}
            </div>

            {/* Course Stats */}
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
                <h3 className="text-sm font-medium text-zinc-100">Course Stats</h3>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">Total Courses</span>
                        <span className="text-white font-medium">{courses.length}</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500">
                        <span>Avg grade</span>
                        <span className="text-white font-medium">
                            {courses.length > 0
                                ? (courses
                                    .filter(c => c.grade !== null)
                                    .reduce((sum, c) => sum + (c.grade || 0), 0) /
                                    Math.max(1, courses.filter(c => c.grade !== null).length)
                                ).toFixed(1)
                                : "—"}
                        </span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">AP/IB Courses</span>
                        <span className="text-white font-medium">
                            {courses.filter(c => c.level === "AP" || c.level === "IB").length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
