"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useUser } from "@/hooks/useUser";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Card, Badge, ActionButton } from "@/components/ui/Atoms";
import { Loader2, Mail, GraduationCap, Target, User, BookOpen, Sparkles } from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/InteractiveHoverButton";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export default function ProfileView() {
  const { user, loading: userLoading, refreshUser } = useUser();
  const {
    extracurriculars,
    achievements,
    scores,
    targets,
    loading: portfolioLoading,
  } = usePortfolio();

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const loading = userLoading || portfolioLoading;

  if (loading) {
    return (
      <AppShell>
        <div className="flex h-full min-h-[300px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      </AppShell>
    );
  }

  const profileStats = [
    {
      label: "Current GPA",
      value:
        user?.current_gpa !== null && user?.current_gpa !== undefined
          ? user.current_gpa.toFixed(2)
          : "Not set",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      label: "Intended Major",
      value: user?.intended_major || "Not declared",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      label: "Targets",
      value: targets?.length || 0,
      icon: <Target className="h-4 w-4" />,
    },
  ];

  const involvement = [
    { label: "Extracurriculars", value: extracurriculars.length },
    { label: "Honors & Awards", value: achievements.length },
    { label: "Test Scores", value: scores.length },
  ];

  return (
    <AppShell>
      <Breadcrumbs items={[{ label: "Profile" }]} />
      <header className="flex flex-col gap-4 border-b border-zinc-900 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
            Profile
          </p>
          <h1 className="text-3xl font-semibold text-white">
            {user?.name || "Your Profile"}
          </h1>
          <p className="text-sm text-zinc-400">
            Manage personal info, academic stats, and application preferences.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <InteractiveHoverButton
            text="Edit Profile"
            className="w-40"
            onClick={() => setIsEditModalOpen(true)}
          />
          <button className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-600 hover:text-white transition">
            Export Summary
          </button>
        </div>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800">
                <User className="h-6 w-6 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Personal Details
                </h2>
                <p className="text-sm text-zinc-500">
                  Basic info synced from onboarding
                </p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <dt className="text-xs uppercase tracking-wide text-zinc-500">
                  Name
                </dt>
                <dd className="text-sm text-white">{user?.name || "—"}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs uppercase tracking-wide text-zinc-500">
                  Email
                </dt>
                <dd className="inline-flex items-center gap-2 text-sm text-white">
                  <Mail className="h-4 w-4 text-zinc-500" />
                  {user?.email || "Not available"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs uppercase tracking-wide text-zinc-500">
                  Intended Major
                </dt>
                <dd className="text-sm text-white">
                  {user?.intended_major || "Not declared"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs uppercase tracking-wide text-zinc-500">
                  Curriculum
                </dt>
                <dd className="text-sm text-white">{user?.curriculum_type || "Not set"}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Academic Snapshot
                </h2>
                <p className="text-sm text-zinc-500">
                  Key metrics powering your admissions model.
                </p>
              </div>
              <Badge text="Synced" variant="success" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {profileStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-zinc-900 bg-zinc-950/60 p-4"
                >
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-500">
                    {stat.icon}
                    {stat.label}
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Activity Overview
            </h3>
            <div className="mt-6 space-y-4">
              {involvement.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-zinc-900 bg-zinc-950/40 px-4 py-3"
                >
                  <span className="text-sm text-zinc-400">{item.label}</span>
                  <span className="text-xl font-semibold text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Next Actions</h3>
            <p className="text-sm text-zinc-500">
              Keep your profile updated to unlock better AI recommendations.
            </p>
            <div className="space-y-3">
              <ActionButton className="w-full justify-center bg-zinc-900 text-white hover:bg-zinc-800">
                Update Academic Info
              </ActionButton>
              <ActionButton className="w-full justify-center bg-zinc-900 text-white hover:bg-zinc-800">
                Add New Achievement
              </ActionButton>
              <ActionButton
                onClick={() => window.location.href = '/ai/portfolio-advisor'}
                className="w-full justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 border-none"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get AI Feedback
              </ActionButton>
            </div>
          </Card>
        </div>
      </div>

      {user && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
          onSuccess={() => {
            refreshUser?.();
            setIsEditModalOpen(false);
          }}
        />
      )}
    </AppShell>
  );
}

