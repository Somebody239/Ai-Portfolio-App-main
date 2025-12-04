"use client";

import React from "react";
import { Card, Skeleton } from "@heroui/react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
    className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
    return (
        <Card className={cn("w-full space-y-5 p-4 bg-zinc-900/50 border-zinc-800", className)} radius="lg">
            <Skeleton className="rounded-lg bg-zinc-800">
                <div className="h-24 rounded-lg bg-zinc-800" />
            </Skeleton>
            <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg bg-zinc-800">
                    <div className="h-3 w-3/5 rounded-lg bg-zinc-800" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg bg-zinc-800">
                    <div className="h-3 w-4/5 rounded-lg bg-zinc-800" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg bg-zinc-800">
                    <div className="h-3 w-2/5 rounded-lg bg-zinc-800" />
                </Skeleton>
            </div>
        </Card>
    );
}
