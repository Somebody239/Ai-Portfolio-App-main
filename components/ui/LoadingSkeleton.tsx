import React from "react";
import { cn } from "@/lib/utils";

/**
 * Loading skeleton components for displaying loading states
 */

interface CardSkeletonProps {
    className?: string;
}

export function CardSkeleton({ className }: CardSkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse bg-zinc-900/50 rounded-xl border border-zinc-800",
                className
            )}
        >
            <div className="h-32 w-full" />
        </div>
    );
}

interface ListSkeletonProps {
    count?: number;
    className?: string;
}

export function ListSkeleton({ count = 3, className }: ListSkeletonProps) {
    return (
        <div className={cn("space-y-4", className)}>
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}

interface TableRowSkeletonProps {
    columns?: number;
}

export function TableRowSkeleton({ columns = 4 }: TableRowSkeletonProps) {
    return (
        <div className="flex gap-4 p-4 border-b border-zinc-800 animate-pulse">
            {Array.from({ length: columns }).map((_, i) => (
                <div
                    key={i}
                    className="h-4 bg-zinc-900/50 rounded"
                    style={{ width: `${100 / columns}%` }}
                />
            ))}
        </div>
    );
}

interface TextSkeletonProps {
    lines?: number;
    className?: string;
}

export function TextSkeleton({ lines = 3, className }: TextSkeletonProps) {
    return (
        <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="h-4 bg-zinc-900/50 rounded animate-pulse"
                    style={{ width: i === lines - 1 ? "70%" : "100%" }}
                />
            ))}
        </div>
    );
}

interface StatCardSkeletonProps {
    className?: string;
}

export function StatCardSkeleton({ className }: StatCardSkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse bg-zinc-900/50 rounded-xl border border-zinc-800 p-4 space-y-3",
                className
            )}
        >
            <div className="h-3 w-20 bg-zinc-800 rounded" />
            <div className="h-8 w-16 bg-zinc-800 rounded" />
        </div>
    );
}
