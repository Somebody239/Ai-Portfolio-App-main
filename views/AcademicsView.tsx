"use client";

import React, { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { usePortfolio } from "@/hooks/usePortfolio";
import { TestScoresSection } from "@/components/portfolio/TestScoresSection";
import { CourseTimelineView } from '@/components/academics/CourseTimelineView';
import { GPASection } from "@/components/academics/GPASection";
import { InteractiveHoverButton } from "@/components/ui/InteractiveHoverButton";
import { StatsService } from "@/services/StatsService";
import { useUser } from "@/hooks/useUser";
import { TestScoreModal } from "@/components/modals/scores/TestScoreModal";
import { CourseModal } from "@/components/modals/courses/CourseModal";
import { TestScoresManager } from "@/managers/TestScoresManager";
import { CoursesManager } from "@/managers/CoursesManager";
import { StandardizedScore, Course, CourseTerm, CourseLevel } from "@/lib/types";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { useRouter } from "next/navigation";

import { Scan } from "lucide-react";

export default function AcademicsView() {
  const {

    scores,
    courses,
    loading,
    error,
    refetch,
  } = usePortfolio();
  const { user, loading: userLoading } = useUser();
  const statsService = useMemo(() => StatsService.getInstance(), []);

  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  // Lifted state for year selection
  const [selectedYear, setSelectedYear] = useState<number>(12);
  const [selectedSemester, setSelectedSemester] = useState<string | undefined>(undefined);


  const [editingScore, setEditingScore] = useState<StandardizedScore | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const router = useRouter();

  // Filter courses for GPA Section based on selected year
  const currentYearCourses = useMemo(() => {
    return courses.filter(c => c.year === selectedYear);
  }, [courses, selectedYear]);



  const handleAddScore = () => {
    setEditingScore(null);
    setIsScoreModalOpen(true);
  };

  const handleEditScore = (score: StandardizedScore) => {
    setEditingScore(score);
    setIsScoreModalOpen(true);
  };

  const handleDeleteScore = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test score?")) return;
    try {
      const manager = new TestScoresManager();
      await manager.delete(id);
      refetch();
    } catch (error) {
      console.error("Failed to delete score:", error);
      alert("Failed to delete test score. Please try again.");
    }
  };

  // Added Course handlers
  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleDeleteCourse = async (course: Course) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const manager = new CoursesManager();
      await manager.delete(course.id);
      refetch();
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Failed to delete course. Please try again.");
    }
  };

  const handleSaveCourses = async (newCourses: any[]) => {
    try {
      const manager = new CoursesManager();
      // Assuming create method exists and takes a course object
      // We might need to loop or if manager supports bulk create
      for (const course of newCourses) {
        if (user?.id) {
          await manager.create(user.id, {
            name: course.name,
            year: selectedYear, // Default to selected year
            semester: (selectedSemester as CourseTerm) || CourseTerm.Fall, // Default
            level: (course.level as CourseLevel) || CourseLevel.Regular // Default level if missing
          });
        }
      }
      refetch();
    } catch (error) {
      console.error("Failed to save courses:", error);
      alert("Failed to save courses. Please try again.");
    }
  };

  const isLoading = loading || userLoading;

  if (isLoading) {
    return (
      <AppShell>
        <div className="h-full flex items-center justify-center">
          <span className="text-zinc-500 animate-pulse">Loading Academics...</span>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="h-full flex items-center justify-center">
          <span className="text-red-400 text-sm">Failed to load academics. Please refresh.</span>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Breadcrumbs items={[{ label: "Academics" }]} />
      {/* Page Header */}
      <header className="flex justify-between items-start mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Academics</h1>
          <p className="text-zinc-400 max-w-2xl">
            {user?.name ? `Hi ${user.name.split(" ")[0]},` : "Manage"} your coursework, GPA, test scores, and activities.
            {user?.curriculum_type && (
              <span className="ml-2 px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20">
                {user.curriculum_type === 'Both' ? 'AP & IB' : user.curriculum_type}
              </span>
            )}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3">

          <InteractiveHoverButton text="Download Transcript" className="w-48" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Course Management & Activities */}
        <div className="lg:col-span-8 space-y-10">
          {/* Courses Section - NEW! */}
          {user && (
            <CourseTimelineView
              courses={courses}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              onAddCourse={(semester) => {
                setEditingCourse(null);
                setSelectedSemester(semester);
                setIsCourseModalOpen(true);
              }}
              onEditCourse={handleEditCourse}
              onDeleteCourse={handleDeleteCourse}
              onAddCourses={handleSaveCourses}
              userId={user?.id || ""}
              onCourseClick={(course) => router.push(`/academics/${course.id}`)}
            />
          )}

          <div className="w-full h-px bg-zinc-900" /> {/* Divider */}

          {/* Test Scores */}
          <TestScoresSection
            scores={scores}
            onAdd={handleAddScore}
            onEdit={handleEditScore}
            onDelete={handleDeleteScore}
          />


        </div>

        {/* RIGHT COLUMN: GPA Stats (Sticky) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-4 space-y-8">
            {/* GPA Section - Showing stats for SELECTED year, but trend for ALL */}
            <GPASection courses={courses} selectedYear={selectedYear} />


          </div>
        </div>
      </div>

      {/* Modals */}
      {user && (
        <>
          <CourseModal
            isOpen={isCourseModalOpen}
            onClose={() => {
              setIsCourseModalOpen(false);
              setEditingCourse(null);
              setSelectedSemester(undefined);
            }}
            onSuccess={() => {
              refetch();
              setIsCourseModalOpen(false);
              setEditingCourse(null);
              setSelectedSemester(undefined);
            }}
            userId={user.id}
            initialData={editingCourse || { year: selectedYear, semester: selectedSemester } as any}
            mode={editingCourse ? "edit" : "create"}
          />
        </>
      )}
    </AppShell>
  );
}
