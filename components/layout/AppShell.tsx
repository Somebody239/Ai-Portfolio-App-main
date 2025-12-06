"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  SidebarProfile,
  SidebarGroup,
} from "@/components/ui/Sidebar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCourses } from "@/hooks/useCourses";
import {
  LayoutDashboard,
  BookOpen,
  School,
  Settings,
  TrendingUp,
  LogOut,
  User,
  ChevronDown,
  Sparkles,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const { user, loading, signOut } = useUserProfile();
  const { courses } = useCourses();

  // Get current semester courses only
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11
  // Fall: Aug-Dec (7-11), Spring: Jan-May (0-4), Summer: Jun-Jul (5-6)
  let currentSemester = 'Fall';
  if (currentMonth >= 0 && currentMonth <= 4) currentSemester = 'Spring';
  else if (currentMonth >= 5 && currentMonth <= 6) currentSemester = 'Summer';

  const currentSemesterCourses = courses.filter(c => c.semester === currentSemester);

  const links = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0" />,
    },
    // Academics is handled separately
    {
      label: "Portfolio",
      href: "/portfolio",
      icon: <Briefcase className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Opportunities",
      href: "/opportunities",
      icon: <TrendingUp className="h-5 w-5 flex-shrink-0" />,
    },
  ];

  const settingsLinks = [
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5 flex-shrink-0" />,
    },
  ];

  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-black w-full flex-1 max-w-screen mx-auto overflow-hidden min-h-screen md:h-screen text-zinc-100 font-sans selection:bg-zinc-800">
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="h-10 flex items-center gap-3 mb-8 px-1">
              <Image src="/logo-white.png" alt="Path2Uni" width={30} height={30} className="h-[30px] w-[30px] flex-shrink-0" />
              {open && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-bold text-lg tracking-tight"
                >
                  Path2Uni
                </motion.span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={handleLinkClick}
                />
              ))}

              {/* Academics Group */}
              <SidebarGroup
                label="Academics"
                icon={<BookOpen className="h-5 w-5 flex-shrink-0" />}
                defaultOpen={true}
                href="/academics"
              >
                {currentSemesterCourses.map((course) => (
                  <SidebarLink
                    key={course.id}
                    link={{
                      label: course.name,
                      href: `/academics/${course.id}`,
                      icon: <div className={`w-1 h-1 rounded-full ${course.semester === 'Fall' ? 'bg-amber-500' :
                        course.semester === 'Spring' ? 'bg-emerald-500' : 'bg-blue-500'
                        }`} />
                    }}
                    onClick={handleLinkClick}
                    className="pl-2"
                  />
                ))}
              </SidebarGroup>



              <div className="my-4 border-t border-zinc-800/50 mx-2" />

              {settingsLinks.map((link, idx) => (
                <SidebarLink
                  key={`settings-${idx}`}
                  link={link}
                  onClick={handleLinkClick}
                />
              ))}
            </div>
          </div>

          <SidebarProfile user={user} loading={loading} onSignOut={signOut} />
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 overflow-y-auto md:h-screen bg-black relative z-0 px-4 py-6 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          {children}
        </div>
      </main>
    </div >
  );
};

