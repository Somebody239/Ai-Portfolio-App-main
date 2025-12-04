"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Context ---
type SidebarContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
};

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider");
  return ctx;
}

// --- Main Provider ---
export function Sidebar({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = openProp !== undefined ? openProp : internalOpen;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setInternalOpen;

  const value = useMemo(() => ({ open, setOpen, animate }), [open, setOpen, animate]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

// --- Layout Container ---
export function SidebarBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <>
      <DesktopSidebar className={className}>{children}</DesktopSidebar>
      <MobileSidebar className={className}>{children}</MobileSidebar>
    </>
  );
}

// --- Desktop Implementation ---
function DesktopSidebar({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open, setOpen, animate } = useSidebar();

  const handleHover = useCallback(
    (next: boolean) => {
      if (animate) setOpen(next);
    },
    [animate, setOpen]
  );

  return (
    <motion.aside
      className={cn(
        "hidden h-screen flex-col overflow-hidden border-r border-zinc-800 bg-zinc-950 px-4 py-6 md:flex md:sticky md:top-0 flex-shrink-0",
        className
      )}
      initial={false}
      animate={{ width: animate ? (open ? 280 : 76) : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      {children}
    </motion.aside>
  );
}

// --- Mobile Implementation ---
function MobileSidebar({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open, setOpen } = useSidebar();

  return (
    <div className="md:hidden flex flex-col w-full">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 p-4">
        <span className="text-sm font-bold text-white tracking-tight">UniPlanner</span>
        <button onClick={() => setOpen(!open)} className="text-zinc-400 hover:text-white">
          <Menu size={24} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className={cn(
                "fixed inset-y-0 left-0 z-50 w-[280px] bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col",
                className
              )}
            >
              <div className="flex justify-end mb-6">
                <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sidebar Group (Collapsible) ---
export function SidebarGroup({
  label,
  icon,
  children,
  defaultOpen = false,
  href
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  href?: string;
}) {
  const { open, animate, setOpen } = useSidebar();
  const [isExpanded, setIsExpanded] = useState(defaultOpen);
  const pathname = usePathname();
  const isActive = href && pathname.startsWith(href);

  const handleChevronClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!open && animate) {
      setOpen(true);
      setIsExpanded(true);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const content = (
    <>
      <span className={cn("flex-shrink-0", isActive ? "text-white" : "text-zinc-500 group-hover:text-white")}>
        {icon}
      </span>
      <motion.span
        animate={{
          display: animate ? (open ? "flex" : "none") : "flex",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="flex-1 whitespace-nowrap text-sm font-medium overflow-hidden items-center justify-between"
      >
        {label}
        <button
          onClick={handleChevronClick}
          className="p-1 hover:bg-zinc-800 rounded transition-colors"
        >
          <ChevronDown
            size={14}
            className={cn("transition-transform duration-200", isExpanded ? "rotate-180" : "")}
          />
        </button>
      </motion.span>
    </>
  );

  return (
    <div className="flex flex-col gap-1">
      {href ? (
        <Link
          href={href}
          className={cn(
            "flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-200 group w-full text-left",
            isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
          )}
        >
          {content}
        </Link>
      ) : (
        <button
          onClick={handleChevronClick}
          className={cn(
            "flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-200 group w-full text-left",
            "text-zinc-400 hover:text-white hover:bg-zinc-900"
          )}
        >
          {content}
        </button>
      )}

      <AnimatePresence>
        {isExpanded && open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-4 flex flex-col gap-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Navigation Link ---
export function SidebarLink({ link, onClick, className }: { link: { label: string; href: string; icon: React.ReactNode }; onClick?: () => void; className?: string }) {
  const { open, animate } = useSidebar();
  const pathname = usePathname();
  const isActive = pathname === link.href;

  return (
    <Link
      href={link.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-200 group",
        isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900",
        className
      )}
    >
      <span className={cn("flex-shrink-0", isActive ? "text-white" : "text-zinc-500 group-hover:text-white")}>
        {link.icon}
      </span>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="whitespace-nowrap text-sm font-medium overflow-hidden"
      >
        {link.label}
      </motion.span>
    </Link>
  );
}

// --- Dynamic User Profile Component ---
interface SidebarProfileProps {
  user: {
    name: string | null;
    email: string | null;
    intended_major: string | null;
  } | null;
  loading?: boolean;
  onSignOut?: () => void;
}

export const SidebarProfile = React.memo(function SidebarProfile({ user, loading, onSignOut }: SidebarProfileProps) {
  const { open, animate } = useSidebar();

  // Simple loading placeholder
  if (loading) {
    return (
      <div className="flex items-center gap-3 p-2 border-t border-zinc-800 mt-auto">
        <div className="h-8 w-8 rounded-full bg-zinc-800 animate-pulse" />
        {open && <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />}
      </div>
    );
  }

  const displayName = user?.name || "Student";
  const displayMajor = user?.intended_major || "Undeclared";
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className="mt-auto border-t border-zinc-800 pt-4 flex flex-col gap-1">
      <div className={cn(
        "flex items-center gap-3 rounded-lg transition-colors hover:bg-zinc-900/50 group",
        open ? "p-2" : "p-2 justify-center"
      )}>
        {/* Avatar */}
        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-300 border border-zinc-700 flex-shrink-0">
          {initials}
        </div>

        {/* Name & Major - Only visible when open */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex flex-col flex-1 overflow-hidden whitespace-nowrap"
            >
              <span className="text-sm font-medium text-zinc-200 truncate">{displayName}</span>
              <span className="text-[10px] text-zinc-500 truncate">{displayMajor}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout Button - Integrated when open */}
        {open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onSignOut}
            className="p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Sign Out"
          >
            <LogOut size={16} />
          </motion.button>
        )}
      </div>

      {/* Logout Button - Stacked when closed */}
      {!open && (
        <button
          onClick={onSignOut}
          className="flex items-center justify-center h-8 w-8 mx-auto rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition-colors"
          title="Sign Out"
        >
          <LogOut size={16} />
        </button>
      )}
    </div>
  );
});
