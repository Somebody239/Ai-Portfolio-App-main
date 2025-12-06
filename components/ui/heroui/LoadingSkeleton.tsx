"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
    className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
    return (
        <div className={cn("w-full space-y-5 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl", className)}>
            <div className="animate-pulse rounded-lg bg-zinc-800 p-1">
                <div className="h-24 rounded-lg bg-zinc-800/50" />
            </div>
            <div className="space-y-3 animate-pulse">
                <div className="w-3/5 h-3 rounded-full bg-zinc-800" />
                <div className="w-4/5 h-3 rounded-full bg-zinc-800" />
                <div className="w-2/5 h-3 rounded-full bg-zinc-800" />
            </div>
        </div>
    );
}
