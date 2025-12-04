"use client";

import SlideContainer from "../SlideContainer";
import { motion } from "framer-motion";
import { Network, GraduationCap, PenTool, CalendarClock } from "lucide-react";

const RoadmapItem = ({ icon: Icon, title, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.6 }}
        className="flex items-center gap-4 text-zinc-300"
    >
        <Icon className="text-emerald-500" size={24} />
        <span className="text-lg md:text-xl">{title}</span>
    </motion.div>
);

export default function Slide7_Next() {
    return (
        <SlideContainer className="bg-black text-white">
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-6">

                {/* Left: Roadmap */}
                <div>
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-8"
                    >
                        What&apos;s Next
                    </motion.h2>

                    <div className="space-y-6">
                        <RoadmapItem
                            icon={Network}
                            title="Full AI Ecosystem"
                            delay={0.2}
                        />
                        <RoadmapItem
                            icon={GraduationCap}
                            title="Admissions Simulator"
                            delay={0.4}
                        />
                        <RoadmapItem
                            icon={PenTool}
                            title="AI Narrative Builder"
                            delay={0.6}
                        />
                        <RoadmapItem
                            icon={CalendarClock}
                            title="Multi-Agent Journey Design"
                            delay={0.8}
                        />
                    </div>
                </div>

                {/* Right: Closing */}
                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl backdrop-blur-sm relative z-10"
                    >
                        <p className="text-2xl md:text-3xl font-medium leading-relaxed text-zinc-200 italic">
                            &ldquo;I’m building the tool I desperately needed at 16... so no one else has to plan their future in chaos.&rdquo;
                        </p>
                        <div className="mt-8 flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full" />
                            <div>
                                <p className="font-bold text-white">Kishan</p>
                                <p className="text-sm text-zinc-500">UniPlanner</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>

            {/* Final Thank You */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4 }}
                className="absolute bottom-8 text-zinc-600 text-sm uppercase tracking-widest"
            >
                Thank You
            </motion.div>
        </SlideContainer>
    );
}
