"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { University } from "@/lib/types";

interface UniversityDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    university: University | null;
}

export function UniversityDetailsModal({
    isOpen,
    onClose,
    university,
}: UniversityDetailsModalProps) {
    if (!university) return null;

    const formatCurrency = (val?: number | null) => {
        if (!val) return "N/A";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(val);
    };

    const formatPercent = (val?: number | null) => {
        if (!val && val !== 0) return "N/A";
        return `${(val! * 100).toFixed(1)}%`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800">
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-2">
                        {university.image_url ? (
                            <img
                                src={university.image_url}
                                alt={university.name}
                                className="h-16 w-16 rounded-full object-cover border-2 border-zinc-700"
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center text-[#FF6B35] font-bold text-2xl border-2 border-zinc-700">
                                {university.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <DialogTitle className="text-2xl font-bold text-white">
                                {university.name}
                            </DialogTitle>
                            <p className="text-zinc-400">
                                {university.city}, {university.state} • {university.website && (
                                    <a href={`https://${university.website}`} target="_blank" rel="noopener noreferrer" className="text-[#FF6B35] hover:underline">
                                        {university.website}
                                    </a>
                                )}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-8 mt-4">
                    {/* Admissions Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-white mb-3 border-b border-zinc-800 pb-2">Admissions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
                                <p className="text-xs text-zinc-500 uppercase">Acceptance Rate</p>
                                <p className="text-lg font-bold text-white">{formatPercent(university.acceptance_rate)}</p>
                            </div>
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
                                <p className="text-xs text-zinc-500 uppercase">Avg GPA</p>
                                <p className="text-lg font-bold text-white">{university.avg_gpa?.toFixed(2) || "N/A"}</p>
                            </div>
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
                                <p className="text-xs text-zinc-500 uppercase">Avg SAT</p>
                                <p className="text-lg font-bold text-white">{university.avg_sat || "N/A"}</p>
                            </div>
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
                                <p className="text-xs text-zinc-500 uppercase">Avg ACT</p>
                                <p className="text-lg font-bold text-white">{university.avg_act || "N/A"}</p>
                            </div>
                        </div>

                        {(university.admissions_sat_math_25th || university.admissions_act_midpoint) && (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {university.admissions_sat_math_25th && (
                                    <div>
                                        <h4 className="text-sm font-medium text-zinc-300 mb-2">SAT Range (25th-75th)</h4>
                                        <div className="text-sm space-y-1 text-zinc-400">
                                            <div className="flex justify-between">
                                                <span>Math</span>
                                                <span className="font-medium text-white">{university.admissions_sat_math_25th} - {university.admissions_sat_math_75th}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Reading</span>
                                                <span className="font-medium text-white">{university.admissions_sat_reading_25th} - {university.admissions_sat_reading_75th}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {university.admissions_act_midpoint && (
                                    <div>
                                        <h4 className="text-sm font-medium text-zinc-300 mb-2">ACT Scores</h4>
                                        <div className="text-sm space-y-1 text-zinc-400">
                                            <div className="flex justify-between">
                                                <span>Midpoint</span>
                                                <span className="font-medium text-white">{university.admissions_act_midpoint}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>English (25-75)</span>
                                                <span className="font-medium text-white">{university.admissions_act_english_25th} - {university.admissions_act_english_75th}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Math (25-75)</span>
                                                <span className="font-medium text-white">{university.admissions_act_math_25th} - {university.admissions_act_math_75th}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Costs Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-white mb-3 border-b border-zinc-800 pb-2">Costs & Financial Aid</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
                                <p className="text-xs text-zinc-500 uppercase">In-State Tuition</p>
                                <p className="text-lg font-bold text-white">{formatCurrency(university.costs_tuition_in_state)}</p>
                            </div>
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
                                <p className="text-xs text-zinc-500 uppercase">Out-of-State Tuition</p>
                                <p className="text-lg font-bold text-white">{formatCurrency(university.costs_tuition_out_of_state)}</p>
                            </div>
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
                                <p className="text-xs text-zinc-500 uppercase">Avg Net Price</p>
                                <p className="text-lg font-bold text-white">{formatCurrency(university.costs_avg_net_price)}</p>
                            </div>
                        </div>
                        <div className="mt-2 text-sm text-zinc-400">
                            <p>Room & Board (On Campus): {formatCurrency(university.costs_roomboard_oncampus)}</p>
                            <p>Books & Supplies: {formatCurrency(university.costs_books_supplies)}</p>
                        </div>
                    </section>

                    {/* Demographics Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-white mb-3 border-b border-zinc-800 pb-2">Student Body</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-zinc-500">Undergraduate Enrollment</p>
                                <p className="text-lg font-medium text-white">{university.student_size?.toLocaleString() || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-zinc-500">Graduate Enrollment</p>
                                <p className="text-lg font-medium text-white">{university.grad_students?.toLocaleString() || "N/A"}</p>
                            </div>
                        </div>

                        <h4 className="text-sm font-medium text-zinc-300 mb-2">Demographics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div className="bg-zinc-800/50 p-2 rounded border border-zinc-700">
                                <span className="block text-zinc-500 text-xs">White</span>
                                <span className="font-medium text-white">{formatPercent(university.demographics_race_ethnicity_white)}</span>
                            </div>
                            <div className="bg-zinc-800/50 p-2 rounded border border-zinc-700">
                                <span className="block text-zinc-500 text-xs">Hispanic</span>
                                <span className="font-medium text-white">{formatPercent(university.demographics_race_ethnicity_hispanic)}</span>
                            </div>
                            <div className="bg-zinc-800/50 p-2 rounded border border-zinc-700">
                                <span className="block text-zinc-500 text-xs">Black</span>
                                <span className="font-medium text-white">{formatPercent(university.demographics_race_ethnicity_black)}</span>
                            </div>
                            <div className="bg-zinc-800/50 p-2 rounded border border-zinc-700">
                                <span className="block text-zinc-500 text-xs">Asian</span>
                                <span className="font-medium text-white">{formatPercent(university.demographics_race_ethnicity_asian)}</span>
                            </div>
                        </div>
                    </section>

                    {/* Outcomes Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-white mb-3 border-b border-zinc-800 pb-2">Outcomes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
                                <p className="text-xs text-zinc-500 uppercase">Graduation Rate</p>
                                <p className="text-lg font-bold text-white">{formatPercent(university.graduation_rate)}</p>
                            </div>
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
                                <p className="text-xs text-zinc-500 uppercase">Median Earnings (10yr)</p>
                                <p className="text-lg font-bold text-white">{formatCurrency(university.earnings_median_10yrs)}</p>
                            </div>
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
                                <p className="text-xs text-zinc-500 uppercase">Median Debt</p>
                                <p className="text-lg font-bold text-white">{formatCurrency(university.financial_aid_median_debt)}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}
