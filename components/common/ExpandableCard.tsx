"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExpandableCardProps {
    isExpanded: boolean;
    onCollapse?: () => void;
    collapsedContent: React.ReactNode;
    expandedContent: React.ReactNode;
    className?: string;
    layoutId?: string;
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
    isExpanded,
    onCollapse,
    collapsedContent,
    expandedContent,
    className,
    layoutId,
}) => {
    return (
        <motion.div
            layout
            layoutId={layoutId}
            className={cn(
                "relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-xl transition-colors",
                isExpanded ? "ring-2 ring-blue-500/20 border-blue-500/30" : "hover:border-zinc-700",
                className
            )}
            initial={false}
            animate={{
                height: "auto",
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
            }}
        >
            <AnimatePresence mode="wait" initial={false}>
                {isExpanded ? (
                    <motion.div
                        key="expanded"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                    >
                        {expandedContent}
                    </motion.div>
                ) : (
                    <motion.div
                        key="collapsed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                    >
                        {collapsedContent}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
