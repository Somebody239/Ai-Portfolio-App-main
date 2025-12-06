/**
 * OnboardingView - Main onboarding flow container
 * Single responsibility: Orchestrate onboarding steps using ViewModel, Manager, and Coordinator
 */
"use client";

import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboardingViewModel } from "@/viewmodels/OnboardingViewModel";
import { useOnboardingCoordinator } from "@/coordinators/OnboardingCoordinator";
import { OnboardingStep1 } from "@/components/onboarding/OnboardingStep1";
import { OnboardingStep2 } from "@/components/onboarding/OnboardingStep2";
import { OnboardingStep3 } from "@/components/onboarding/OnboardingStep3";
import type { OnboardingDataInput } from "@/lib/validation/Schemas";

export default function OnboardingFlow() {
  const {
    step,
    totalSteps,
    formData,
    isSubmitting,
    error,
    progress,
    nextStep,
    prevStep,
    setFormData,
    setSubmitting,
    setError,
  } = useOnboardingViewModel();

  const { completeOnboarding } = useOnboardingCoordinator();

  const handleStep1Next = useCallback(
    (data: { fullName: string; intendedMajor: string }) => {
      setFormData(data);
      nextStep();
    },
    [setFormData, nextStep]
  );

  const handleStep2Next = useCallback(
    (data: { currentGpa?: string; satScore?: string }) => {
      setFormData(data);
      nextStep();
    },
    [setFormData, nextStep]
  );

  const handleStep3Next = useCallback(
    async (data: { dreamUniversities: string[] }) => {
      try {
        setSubmitting(true);
        setError("");

        const completeData: OnboardingDataInput = {
          ...formData,
          ...data,
        } as OnboardingDataInput;

        await completeOnboarding(completeData);
      } catch (err: any) {
        console.error("Error completing onboarding:", err);
        setError(err.message || "Failed to save your information. Please try again.");
        setSubmitting(false);
      }
    },
    [formData, completeOnboarding, setSubmitting, setError]
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Header / Progress */}
      <div className="w-full max-w-md z-10 mb-8 space-y-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono">
              {step > totalSteps ? totalSteps : step}
            </span>
            <span className="uppercase tracking-widest text-[10px]">Step</span>
          </div>
          <span className="text-zinc-500 text-xs font-mono">
            {step <= totalSteps ? "Setup Profile" : "Finalizing"}
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Main Card Area */}
      <div className="w-full max-w-md z-10 relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <OnboardingStep1
              key="step1"
              onNext={handleStep1Next}
              defaultValues={formData}
            />
          )}
          {step === 2 && (
            <OnboardingStep2
              key="step2"
              onNext={handleStep2Next}
              onBack={prevStep}
              defaultValues={formData}
            />
          )}
          {step === 3 && (
            <OnboardingStep3
              key="step3"
              onNext={handleStep3Next}
              onBack={prevStep}
              isSubmitting={isSubmitting}
              error={error}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding */}
      <div className="fixed bottom-6 text-zinc-600 text-xs font-mono z-10">
        Powered by Path2Uni
      </div>
    </div>
  );
}
