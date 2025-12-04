"use client";

import React from "react";
import { Card, CardHeader, CardFooter, Image, Button } from "@heroui/react";
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
        <Card
            isFooterBlurred
            className={cn("w-full h-[300px] col-span-12 sm:col-span-5 border-none bg-zinc-900/50", className)}
            radius="lg"
            isPressable={!!onClick}
            onPress={onClick}
        >
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
                {subtitle && <p className="text-tiny text-white/60 uppercase font-bold">{subtitle}</p>}
                <h4 className="text-white font-medium text-2xl">{title}</h4>
                {description && <p className="text-zinc-400 text-sm mt-2">{description}</p>}
            </CardHeader>

            {imageSrc && (
                <Image
                    removeWrapper
                    alt="Card background"
                    className="z-0 w-full h-full scale-125 -translate-y-6 object-cover opacity-50"
                    src={imageSrc}
                />
            )}

            {footerContent && (
                <CardFooter className="absolute bg-white/10 bottom-0 border-t-1 border-zinc-100/20 z-10 justify-between">
                    {footerContent}
                </CardFooter>
            )}
        </Card>
    );
}
