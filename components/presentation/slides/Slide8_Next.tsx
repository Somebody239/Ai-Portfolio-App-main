"use client";

import SlideContainer from "../SlideContainer";
import { motion } from "framer-motion";
import { Network, GraduationCap, Briefcase, CalendarClock, ArrowRight } from "lucide-react";

const RoadmapItem = ({ icon: Icon, title, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.6, type: "spring" }}
        className="flex items-center gap-6 bg-zinc-900 p-6 rounded-xl border border-zinc-800 w-full max-w-2xl hover:border-emerald-500/50 transition-colors group"
    >
        <div className="p-3 bg-zinc-800 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
            <Icon size={32} className="text-zinc-400 group-hover:text-emerald-400 transition-colors" />
        </div>
        <span className="text-xl md:text-2xl font-medium text-zinc-200">{title}</span>
        <ArrowRight className="ml-auto text-zinc-600 group-hover:text-emerald-500 transition-colors" />
    </motion.div>
);

export default function Slide8_Next() {
    return (
        <SlideContainer className="bg-zinc-950 text-white">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-bold mb-16"
            >
                What&apos;s Next
            </motion.h2>

            <div className="flex flex-col gap-6 w-full items-center">
                <RoadmapItem
                    icon={Network}
                    title="Multi-agent AI ecosystem"
                    delay={0.2}
                />
                <RoadmapItem
                    icon={GraduationCap}
                    title="Admissions simulator"
                    delay={0.4}
                />
                <RoadmapItem
                    icon={Briefcase}
                    title="Portfolio builder"
                    delay={0.6}
                />
                <RoadmapItem
                    icon={CalendarClock}
                    title="Smart yearly schedule generator"
                    delay={0.8}
                />
            </div>
        </SlideContainer>
    );
}
