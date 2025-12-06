"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AIProgressProps {
    value: number;
    label?: string;
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
    showValueLabel?: boolean;
    className?: string;
}

export function AIProgress({
    value,
    label = "Processing...",
    color = "primary",
    showValueLabel = true,
    className
}: AIProgressProps) {
    const getColorClass = (c: string) => {
        switch (c) {
            case "primary": return "bg-gradient-to-r from-indigo-500 to-purple-500";
            case "success": return "bg-emerald-500";
            case "warning": return "bg-amber-500";
            case "danger": return "bg-rose-500";
            default: return "bg-zinc-100";
        }
    };

    return (
        <div className={cn("w-full max-w-md space-y-2", className)}>
            {(label || showValueLabel) && (
                <div className="flex justify-between text-sm">
                    {label && <span className="font-medium text-zinc-400">{label}</span>}
                    {showValueLabel && <span className="text-zinc-500">{Math.round(value)}%</span>}
                </div>
            )}
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                <div
                    className={cn("h-full transition-all duration-300 rounded-full", getColorClass(color))}
                    style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                />
            </div>
        </div>
    );
}
