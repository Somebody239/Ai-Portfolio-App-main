import React from "react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps {
  text?: string;
  className?: string;
  onClick?: () => void;
}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, onClick }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(
        "px-4 py-2.5 bg-zinc-100 text-zinc-950 text-sm font-semibold rounded-lg hover:bg-zinc-300 transition-colors",
        className
      )}
    >
      {text}
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";


