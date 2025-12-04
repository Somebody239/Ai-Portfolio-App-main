"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export function AppPreviewSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
    });
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const scaleDimensions = () => {
        return isMobile ? [0.7, 0.9] : [1.05, 1];
    };

    const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
    const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <div
            className="relative flex h-[60rem] items-center justify-center bg-black p-2 md:h-[80rem] md:p-20"
            ref={containerRef}
        >
            <div
                className="relative w-full py-10 md:py-40"
                style={{
                    perspective: "1000px",
                }}
            >
                {/* Title */}
                <motion.div
                    style={{
                        translateY: translate,
                    }}
                    className="mx-auto max-w-5xl text-center"
                >
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                        See Your <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">Portfolio</span> Come to Life
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-zinc-400">
                        A comprehensive dashboard that gives you a complete view of your academic journey
                    </p>
                </motion.div>

                {/* 3D Card */}
                <motion.div
                    style={{
                        rotateX: rotate,
                        scale,
                        boxShadow:
                            "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
                    }}
                    className="mx-auto -mt-12 h-[30rem] w-full max-w-5xl rounded-[30px] border-4 border-zinc-700 bg-zinc-900 p-2 shadow-2xl md:h-[40rem] md:p-6"
                >
                    <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-950 p-4 md:rounded-2xl md:p-4">
                        {/* Placeholder for app screenshot - you can replace this with an actual screenshot */}
                        <div className="flex h-full w-full flex-col gap-4">
                            {/* Mock header */}
                            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600" />
                                    <div>
                                        <div className="h-4 w-32 rounded bg-zinc-800" />
                                        <div className="mt-1 h-3 w-24 rounded bg-zinc-800/50" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-zinc-800" />
                                    <div className="h-8 w-8 rounded-lg bg-zinc-800" />
                                </div>
                            </div>

                            {/* Mock content */}
                            <div className="grid flex-1 gap-4 md:grid-cols-3">
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                                    <div className="mb-3 h-4 w-20 rounded bg-zinc-800" />
                                    <div className="mb-4 h-12 w-full rounded bg-gradient-to-br from-emerald-500/20 to-transparent" />
                                    <div className="space-y-2">
                                        <div className="h-3 w-full rounded bg-zinc-800/50" />
                                        <div className="h-3 w-3/4 rounded bg-zinc-800/50" />
                                    </div>
                                </div>

                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                                    <div className="mb-3 h-4 w-24 rounded bg-zinc-800" />
                                    <div className="mb-4 h-12 w-full rounded bg-gradient-to-br from-amber-500/20 to-transparent" />
                                    <div className="space-y-2">
                                        <div className="h-3 w-full rounded bg-zinc-800/50" />
                                        <div className="h-3 w-2/3 rounded bg-zinc-800/50" />
                                    </div>
                                </div>

                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                                    <div className="mb-3 h-4 w-28 rounded bg-zinc-800" />
                                    <div className="mb-4 h-12 w-full rounded bg-gradient-to-br from-rose-500/20 to-transparent" />
                                    <div className="space-y-2">
                                        <div className="h-3 w-full rounded bg-zinc-800/50" />
                                        <div className="h-3 w-4/5 rounded bg-zinc-800/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
