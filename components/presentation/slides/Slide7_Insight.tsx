"use client";

import SlideContainer from "../SlideContainer";
import { motion } from "framer-motion";

export default function Slide7_Insight() {
    const sentence1 = "Students don't need more information.".split(" ");
    const sentence2 = "They need interpreted information.".split(" ");

    return (
        <SlideContainer className="bg-black text-white">
            <div className="max-w-4xl text-center">
                <div className="mb-8 flex flex-wrap justify-center gap-x-3 gap-y-2">
                    {sentence1.map((word, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, filter: "blur(10px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="text-3xl md:text-5xl font-light text-zinc-400"
                        >
                            {word}
                        </motion.span>
                    ))}
                </div>

                <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
                    {sentence2.map((word, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5 + i * 0.1, duration: 0.5 }}
                            className="text-4xl md:text-6xl font-bold text-white"
                        >
                            {word}
                        </motion.span>
                    ))}
                </div>
            </div>
        </SlideContainer>
    );
}
