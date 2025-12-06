import React from "react";
import { cn } from "@/lib/utils";

import { ArrowRight } from "lucide-react";

// --- Card Component ---
export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "bg-zinc-950 border border-zinc-800 rounded-xl p-6 overflow-hidden relative",
        className
      )}
    >
      {children}
    </div>
  );
};

// --- Badge Component ---
export const Badge = ({
  text,
  variant = "neutral",
  className,
}: {
  text: string;
  variant?: "success" | "warning" | "danger" | "neutral";
  className?: string;
}) => {
  const variants = {
    success: "bg-emerald-950/30 text-emerald-400 border-emerald-900",
    warning: "bg-amber-950/30 text-amber-400 border-amber-900",
    danger: "bg-rose-950/30 text-rose-400 border-rose-900",
    neutral: "bg-zinc-900 text-zinc-400 border-zinc-800",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 text-xs font-medium rounded-full border",
        variants[variant],
        className
      )}
    >
      {text}
    </span>
  );
};

// --- Progress Bar ---
export const ProgressBar = ({
  current,
  max,
  label,
}: {
  current: number;
  max: number;
  label?: string;
}) => {
  const percent = Math.min((current / max) * 100, 100);
  return (
    <div className="w-full space-y-1">
      {label && (
        <div className="flex justify-between text-xs text-zinc-500">
          <span>{label}</span>
          <span>
            {current} / {max}
          </span>
        </div>
      )}
      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-zinc-100 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

// --- Action Button ---
export const ActionButton = ({
  children,
  onClick,
  className,
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-950 text-sm font-semibold rounded-lg hover:bg-zinc-300 transition-colors",
        className
      )}
    >
      {children}
      <ArrowRight className="w-4 h-4" />
    </button>
  );
};


