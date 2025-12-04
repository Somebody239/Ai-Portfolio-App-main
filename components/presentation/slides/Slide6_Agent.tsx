"use client";

import SlideContainer from "../SlideContainer";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

export default function Slide6_Agent() {
    return (
        <SlideContainer className="bg-zinc-950 text-white">
            <div className="max-w-4xl text-center px-6">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl md:text-5xl font-light text-zinc-400 mb-12"
                >
                    Students don’t want another planner.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="bg-emerald-500/10 p-6 rounded-full border border-emerald-500/20">
                        <UserPlus size={64} className="text-emerald-400" />
                    </div>

                    <h2 className="text-5xl md:text-7xl font-bold text-white">
                        They want a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">partner</span>.
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5, duration: 1 }}
                    className="mt-16 text-xl text-zinc-500"
                >
                    A system that understands their goals and guides them.
                </motion.p>
            </div>
        </SlideContainer>
    );
}
