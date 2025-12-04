"use client";

import SlideContainer from "../SlideContainer";
import { motion } from "framer-motion";
import { BrainCircuit, ArrowRight, CheckCircle, Database, FileSearch, UserCheck } from "lucide-react";

export default function Slide4_Insights() {
    return (
        <SlideContainer className="bg-zinc-950 text-white">
            <div className="max-w-6xl w-full flex flex-col items-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">
                    What I Learned
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
                    {/* Step 1: Research */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center gap-4 p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 w-64"
                    >
                        <div className="flex gap-4">
                            <Database className="text-blue-400" />
                            <FileSearch className="text-purple-400" />
                            <UserCheck className="text-yellow-400" />
                        </div>
                        <p className="text-sm text-zinc-400 text-center">
                            Admissions Criteria <br /> Student Behavior <br /> AI Models
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <ArrowRight size={32} className="text-zinc-600 rotate-90 md:rotate-0" />
                    </motion.div>

                    {/* Step 2: Insight */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-center md:text-left max-w-lg"
                    >
                        <p className="text-2xl md:text-3xl font-light text-zinc-400 mb-4">
                            Students don’t need more information.
                        </p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5 }}
                            className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-xl"
                        >
                            <p className="text-3xl md:text-4xl font-bold text-white">
                                They need <span className="text-emerald-400">clearer, accurate, organized information</span>.
                            </p>
                            <p className="mt-2 text-emerald-200/70 text-lg">
                                Actionable steps. Clear direction.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </SlideContainer>
    );
}
