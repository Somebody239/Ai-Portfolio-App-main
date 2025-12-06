"use client";

import SlideContainer from "../SlideContainer";
import { motion } from "framer-motion";
import { FileText, StickyNote, File, GraduationCap, AlertCircle, FolderOpen } from "lucide-react";

export default function Slide2_Hook() {
    const chaoticItems = [
        { Icon: FileText, color: "text-blue-400", x: -200, y: -150, rotate: -15, scale: 1.2 },
        { Icon: StickyNote, color: "text-yellow-400", x: 250, y: -100, rotate: 10, scale: 1.1 },
        { Icon: File, color: "text-red-400", x: -150, y: 180, rotate: -20, scale: 1.3 },
        { Icon: GraduationCap, color: "text-purple-400", x: 200, y: 150, rotate: 15, scale: 1.2 },
        { Icon: AlertCircle, color: "text-amber-400", x: 0, y: -200, rotate: 5, scale: 1 },
        { Icon: FolderOpen, color: "text-emerald-400", x: -250, y: 50, rotate: -10, scale: 1.1 },
    ];

    return (
        <SlideContainer className="bg-zinc-950 overflow-hidden relative">
            <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.05 }}
                transition={{ duration: 10, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center opacity-20 blur-sm"
            >
                {chaoticItems.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ x: item.x, y: item.y, rotate: item.rotate, scale: item.scale }}
                        animate={{
                            x: item.x + (Math.random() * 30 - 15),
                            y: item.y + (Math.random() * 30 - 15),
                            rotate: item.rotate + (Math.random() * 10 - 5),
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                        }}
                        className={`absolute ${item.color}`}
                    >
                        <item.Icon size={100} strokeWidth={1.5} />
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center max-w-4xl px-6"
            >
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Universities require everything... <br />
                    <span className="text-zinc-500">But I had tracked nothing.</span>
                </h2>
            </motion.div>
        </SlideContainer>
    );
}
