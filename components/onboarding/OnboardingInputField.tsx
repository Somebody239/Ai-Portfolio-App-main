/**
 * OnboardingInputField - Reusable input component for onboarding
 * Single responsibility: Render styled input with validation
 */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OnboardingInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const OnboardingInputField = React.forwardRef<
  HTMLInputElement,
  OnboardingInputFieldProps
>(({ className, label, error, ...props }, ref) => {
  return (
    <div className="space-y-2 w-full">
      <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          ref={ref}
          className={cn(
            "flex h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-100 ring-offset-black file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:border-transparent transition-all duration-300",
            error && "border-red-900 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
      </div>
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 ml-1 flex items-center gap-1"
        >
          <span className="w-1 h-1 rounded-full bg-red-400" />
          {error}
        </motion.span>
      )}
    </div>
  );
});

OnboardingInputField.displayName = "OnboardingInputField";

