"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface SlideContainerProps {
    children: ReactNode;
    className?: string;
}

export default function SlideContainer({ children, className = "" }: SlideContainerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`w-full h-full flex flex-col items-center justify-center p-8 ${className}`}
        >
            {children}
        </motion.div>
    );
}
