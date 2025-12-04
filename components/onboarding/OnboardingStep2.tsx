/**
 * OnboardingStep2 - Academic baseline step
 * Single responsibility: Collect GPA and SAT scores
 */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ArrowLeft, GraduationCap } from "lucide-react";
import { AcademicDataSchema, type AcademicDataInput } from "@/lib/validation/Schemas";
import { OnboardingInputField } from "./OnboardingInputField";

interface OnboardingStep2Props {
  onNext: (data: AcademicDataInput) => void;
  onBack: () => void;
  defaultValues?: Partial<AcademicDataInput>;
}

export const OnboardingStep2: React.FC<OnboardingStep2Props> = ({
  onNext,
  onBack,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcademicDataInput>({
    resolver: zodResolver(AcademicDataSchema),
    defaultValues: {
      currentGpa: defaultValues?.currentGpa || "",
      satScore: defaultValues?.satScore || "",
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
          <GraduationCap className="text-zinc-400" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Academic Standing
        </h2>
        <p className="text-zinc-500 text-sm">
          This sets the baseline for your &quot;Safety&quot; vs &quot;Reach&quot; calculations.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <OnboardingInputField
          label="Current GPA (0-4.0)"
          placeholder="3.8"
          type="number"
          step="0.01"
          {...register("currentGpa")}
          error={errors.currentGpa?.message}
          autoFocus
        />
        <OnboardingInputField
          label="SAT Score (Optional)"
          placeholder="1450"
          type="number"
          {...register("satScore")}
          error={errors.satScore?.message}
        />
      </div>

      {/* Curriculum Type Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-200">
          Curriculum Type
        </label>
        <select
          {...register("curriculumType")}
          className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
        >
          <option value="">Select your curriculum</option>
          <option value="AP">AP (Advanced Placement)</option>
          <option value="IB">IB (International Baccalaureate)</option>
          <option value="Both">Both AP & IB</option>
          <option value="">Other / Regular</option>
        </select>
        {errors.curriculumType && (
          <p className="text-xs text-rose-400">{errors.curriculumType?.message}</p>
        )}
      </div>

      <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 leading-relaxed">
        <span className="text-white font-semibold block mb-1">
          Note on accuracy:
        </span>
        You can upload your transcript later for automatic course extraction.
        For now, an estimate works.
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="h-12 w-12 flex items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-900 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          type="submit"
          className="flex-1 group relative flex items-center justify-center gap-2 h-12 bg-white text-black rounded-xl font-semibold text-sm hover:bg-zinc-200 transition-colors"
        >
          Next Step
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.form>
  );
};

