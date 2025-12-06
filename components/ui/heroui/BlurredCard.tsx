"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BlurredCardProps {
    title: string;
    subtitle?: string;
    description?: string;
    imageSrc?: string;
    footerContent?: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function BlurredCard({
    title,
    subtitle,
    description,
    imageSrc,
    footerContent,
    className,
    onClick
}: BlurredCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative w-full h-[300px] overflow-hidden rounded-xl bg-zinc-900/50 border border-zinc-800 transition-all",
                onClick && "cursor-pointer hover:border-zinc-700 active:scale-95",
                className
            )}
        >
            <div className="absolute z-10 top-0 left-0 right-0 p-6 flex flex-col items-start bg-gradient-to-b from-black/80 to-transparent">
                {subtitle && <p className="text-[10px] tracking-wider text-white/60 uppercase font-bold mb-1">{subtitle}</p>}
                <h4 className="text-white font-medium text-2xl">{title}</h4>
                {description && <p className="text-zinc-300 text-sm mt-2 line-clamp-2">{description}</p>}
            </div>

            {imageSrc && (
                <div className="absolute inset-0 z-0">
                    <img
                        alt="Card background"
                        className="w-full h-full object-cover opacity-50 scale-110"
                        src={imageSrc}
                    />
                </div>
            )}

            {footerContent && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-md border-t border-white/10 z-10 flex justify-between items-center">
                    {footerContent}
                </div>
            )}
        </div>
    );
}
