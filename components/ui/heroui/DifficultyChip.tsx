"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DifficultyChipProps {
    level: string; // e.g., "AP", "Honors", "Regular", "1", "2", "3"
    className?: string;
}

export function DifficultyChip({ level, className }: DifficultyChipProps) {
    const getColorClasses = (lvl: string) => {
        const lower = lvl.toLowerCase();
        if (lower.includes("ap") || lower === "hard" || lower === "high") {
            return "bg-rose-500/10 text-rose-400 border-rose-500/20";
        }
        if (lower.includes("honor") || lower === "medium") {
            return "bg-purple-500/10 text-purple-400 border-purple-500/20";
        }
        if (lower.includes("ib")) {
            return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        }
        if (lower.includes("dual")) {
            return "bg-amber-500/10 text-amber-400 border-amber-500/20";
        }
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase border",
                getColorClasses(level),
                className
            )}
        >
            {level}
        </span>
    );
}
