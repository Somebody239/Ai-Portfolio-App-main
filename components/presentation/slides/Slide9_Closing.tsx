"use client";

import SlideContainer from "../SlideContainer";
import { motion } from "framer-motion";

export default function Slide9_Closing() {
    return (
        <SlideContainer className="bg-black text-white relative overflow-hidden">
            {/* Background Blur */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 2 }}
                className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-blue-900/40 blur-3xl"
            />

            <div className="relative z-10 text-center max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-5xl font-medium leading-tight text-zinc-200">
                        “I’m building the tool I desperately needed at 14.”
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 mb-4">
                        Kishan
                    </h1>
                    <p className="text-zinc-500 text-lg">UniPlanner</p>
                </motion.div>
            </div>
        </SlideContainer>
    );
}
