"use client";

import SlideContainer from "../SlideContainer";
import { motion } from "framer-motion";
import { LayoutDashboard, Sparkles, Bot, ArrowRight } from "lucide-react";

export default function Slide5_Demo() {
    return (
        <SlideContainer className="bg-black text-white">
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6">

                {/* Left: The Prototype */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            UniPlanner
                        </h2>
                        <p className="text-xl text-zinc-400">
                            Everything in one place.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {["Grades", "Awards", "Activities", "Extracurriculars"].map((item, i) => (
                            <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg text-zinc-300 text-sm flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                {item}
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Right: The AI Agent */}
                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative z-10"
                    >
                        <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
                            <div className="bg-emerald-500/20 p-2 rounded-lg">
                                <Bot className="text-emerald-400" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">UniPlanner Agent</h3>
                                <p className="text-xs text-zinc-500">Personal Guidance Counsellor</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 2.5 }}
                                className="bg-zinc-800/50 p-4 rounded-xl rounded-tl-none border border-zinc-700/50"
                            >
                                <p className="text-sm text-zinc-200">
                                    &quot;Here’s what you should do this month: Add <span className="text-emerald-400 font-semibold">Robotics Club</span> to strengthen your engineering profile.&quot;
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 3.5 }}
                                className="bg-zinc-800/50 p-4 rounded-xl rounded-tl-none border border-zinc-700/50"
                            >
                                <p className="text-sm text-zinc-200">
                                    &quot;Here are recommended courses for <span className="text-emerald-400 font-semibold">Grade 12</span>.&quot;
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Glow effect behind */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute inset-0 bg-emerald-500/20 blur-3xl -z-10 transform scale-110"
                    />
                </div>

            </div>


            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4.5 }}
                className="absolute bottom-8 text-center w-full pointer-events-none"
            >
                <p className="text-xl text-zinc-400 italic">
                    &ldquo;Like a personal guidance counsellor… who never forgets anything.&rdquo;
                </p>
            </motion.div>
        </SlideContainer >
    );
}
