"use client";

import SlideContainer from "../SlideContainer";
import { motion } from "framer-motion";

export default function Slide3_Why() {
    return (
        <SlideContainer className="bg-zinc-950 text-white">
            <div className="max-w-5xl w-full px-6 flex flex-col items-center justify-center h-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-light text-zinc-300 mb-12 leading-relaxed">
                        Students don’t struggle because they’re <span className="text-white font-semibold">unmotivated</span>.
                    </h2>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="bg-zinc-900/50 border border-zinc-800 p-8 md:p-12 rounded-2xl backdrop-blur-sm"
                    >
                        <p className="text-4xl md:text-6xl font-bold text-white">
                            It’s a lack of <span className="text-emerald-400">structure</span>.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </SlideContainer>
    );
}
