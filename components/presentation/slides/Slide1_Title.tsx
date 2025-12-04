"use client";

import SlideContainer from "../SlideContainer";
import { motion } from "framer-motion";

export default function Slide1_Title() {
    return (
        <SlideContainer className="bg-black text-white">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center max-w-5xl px-4"
            >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
                    The Future of <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                        Student Planning
                    </span>
                </h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-xl md:text-2xl text-zinc-400 font-light"
                >
                    AI-Powered Guidance for Students Everywhere
                </motion.p>
            </motion.div>
        </SlideContainer>
    );
}
