"use client";

import React from "react";
import { Progress } from "@heroui/react";
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
    return (
        <Progress
            aria-label={label}
            size="md"
            value={value}
            color={color}
            showValueLabel={showValueLabel}
            label={label}
            className={cn("max-w-md", className)}
            classNames={{
                base: "max-w-md",
                track: "drop-shadow-md border border-default",
                indicator: "bg-gradient-to-r from-indigo-500 to-purple-500",
                label: "tracking-wider font-medium text-default-600",
                value: "text-foreground/60",
            }}
        />
    );
}
