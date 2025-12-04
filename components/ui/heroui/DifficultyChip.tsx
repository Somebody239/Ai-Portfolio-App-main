"use client";

import React from "react";
import { Chip } from "@heroui/react";
import { cn } from "@/lib/utils";

interface DifficultyChipProps {
    level: string; // e.g., "AP", "Honors", "Regular", "1", "2", "3"
    className?: string;
}

export function DifficultyChip({ level, className }: DifficultyChipProps) {
    const getColor = (lvl: string) => {
        const lower = lvl.toLowerCase();
        if (lower.includes("ap") || lower === "hard" || lower === "high") return "danger"; // Red/Pink
        if (lower.includes("honor") || lower === "medium") return "secondary"; // Purple
        if (lower.includes("ib")) return "success"; // Green
        if (lower.includes("dual")) return "warning"; // Orange
        return "default"; // Gray
    };

    return (
        <Chip
            color={getColor(level)}
            variant="flat"
            size="sm"
            className={cn("uppercase font-bold text-[10px]", className)}
        >
            {level}
        </Chip>
    );
}
