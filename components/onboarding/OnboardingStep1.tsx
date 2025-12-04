/**
 * OnboardingStep1 - Profile information step
 * Single responsibility: Collect user name and intended major
 */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, User } from "lucide-react";
import { UserProfileSchema, type UserProfileInput } from "@/lib/validation/Schemas";
import { OnboardingInputField } from "./OnboardingInputField";

interface OnboardingStep1Props {
  onNext: (data: UserProfileInput) => void;
  defaultValues?: Partial<UserProfileInput>;
}

export const OnboardingStep1: React.FC<OnboardingStep1Props> = ({
  onNext,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileInput>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      fullName: defaultValues?.fullName || "",
      intendedMajor: defaultValues?.intendedMajor || "",
    },
  });

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={handleSubmit(onNext)}
      className="space-y-6"
    >
      <div className="space-y-2 text-center mb-8">
        <div className="w-12 h-12 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center mx-auto mb-4">
          <User className="text-zinc-400" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Who are you?
        </h2>
        <p className="text-zinc-500 text-sm">
          We need your details to personalize the AI recommendations.
        </p>
      </div>

      <OnboardingInputField
        label="Full Name"
        placeholder="e.g. Alex Carter"
        {...register("fullName")}
        error={errors.fullName?.message}
        autoFocus
      />

      <OnboardingInputField
        label="Intended Major"
        placeholder="e.g. Computer Science, Pre-Med"
        {...register("intendedMajor")}
        error={errors.intendedMajor?.message}
      />

      <button
        type="submit"
        className="w-full group relative flex items-center justify-center gap-2 h-12 bg-white text-black rounded-xl font-semibold text-sm hover:bg-zinc-200 transition-colors mt-4"
      >
        Continue
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.form>
  );
};

